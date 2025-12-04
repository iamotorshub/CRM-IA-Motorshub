import type { Express, Request, Response } from "express";
import type { Server as HTTPServer } from "http";
import { db } from "../db";
import { 
  contacts, campaigns, campaignSteps, whatsappLogs,
  buyerIntentScans, buyerIntentSignals, buyerIntentHistory,
  automations, automationActions, automationLogs 
} from "../shared/schema";
import { eq, desc } from "drizzle-orm";
import { runLLM } from "./ai/llmRouter";
import { getAgentPrompt } from "./ai/agents/hormozi";
import { sendWhatsAppMessage } from "./whatsapp/ultraMsgClient";
import { crawlDomain } from "./buyerIntent/crawler";
import { gatherAllSignals } from "./buyerIntent/signals";
import { calculateIntentScore } from "./buyerIntent/scoring";
import { generateInsights } from "./buyerIntent/insights";
import { loadAutomations, getAutomationById, createAutomation, updateAutomationStatus, deleteAutomation } from "./automation/registry";
import { executeAutomation } from "./automation/executor";
import { TRIGGER_DEFINITIONS, matchTrigger, createTriggerEvent } from "./automation/triggers";
import { ACTION_DEFINITIONS } from "./automation/executor";
import { generateAutomationBlueprint, generateN8nBlueprint, generateMakeBlueprint } from "./automation/builder";
import { listN8nWorkflows } from "./automation/n8nClient";
import { listMakeScenarios } from "./automation/makeClient";

export async function registerRoutes(httpServer: HTTPServer, app: Express) {
  // Contacts API
  app.get("/api/contacts", async (_req: Request, res: Response) => {
    const allContacts = await db.select().from(contacts);
    res.json(allContacts);
  });

  app.post("/api/contacts", async (req: Request, res: Response) => {
    const newContact = await db.insert(contacts).values(req.body).returning();
    res.json(newContact[0]);
  });

  app.put("/api/contacts/:id", async (req: Request, res: Response) => {
    const updated = await db
      .update(contacts)
      .set(req.body)
      .where(eq(contacts.id, parseInt(req.params.id)))
      .returning();
    res.json(updated[0]);
  });

  app.delete("/api/contacts/:id", async (req: Request, res: Response) => {
    await db.delete(contacts).where(eq(contacts.id, parseInt(req.params.id)));
    res.json({ success: true });
  });

  // Campaigns API
  app.get("/api/campaigns", async (_req: Request, res: Response) => {
    const allCampaigns = await db.select().from(campaigns);
    res.json(allCampaigns);
  });

  app.post("/api/campaigns", async (req: Request, res: Response) => {
    const newCampaign = await db.insert(campaigns).values(req.body).returning();
    res.json(newCampaign[0]);
  });

  app.get("/api/campaigns/:id", async (req: Request, res: Response) => {
    const campaign = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, parseInt(req.params.id)));
    
    if (!campaign.length) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const steps = await db
      .select()
      .from(campaignSteps)
      .where(eq(campaignSteps.campaignId, parseInt(req.params.id)));

    res.json({ ...campaign[0], steps });
  });

  app.put("/api/campaigns/:id", async (req: Request, res: Response) => {
    const updated = await db
      .update(campaigns)
      .set(req.body)
      .where(eq(campaigns.id, parseInt(req.params.id)))
      .returning();
    res.json(updated[0]);
  });

  app.delete("/api/campaigns/:id", async (req: Request, res: Response) => {
    await db.delete(campaigns).where(eq(campaigns.id, parseInt(req.params.id)));
    res.json({ success: true });
  });

  // Campaign Steps API
  app.post("/api/campaigns/:id/steps", async (req: Request, res: Response) => {
    const newStep = await db
      .insert(campaignSteps)
      .values({
        ...req.body,
        campaignId: parseInt(req.params.id),
      })
      .returning();
    res.json(newStep[0]);
  });

  app.put("/api/campaigns/:campaignId/steps/:stepId", async (req: Request, res: Response) => {
    const updated = await db
      .update(campaignSteps)
      .set(req.body)
      .where(eq(campaignSteps.id, parseInt(req.params.stepId)))
      .returning();
    res.json(updated[0]);
  });

  app.delete("/api/campaigns/:campaignId/steps/:stepId", async (req: Request, res: Response) => {
    await db.delete(campaignSteps).where(eq(campaignSteps.id, parseInt(req.params.stepId)));
    res.json({ success: true });
  });

  // WhatsApp API
  app.post("/api/whatsapp/send", async (req: Request, res: Response) => {
    try {
      const { to, message } = req.body;
      const result = await sendWhatsAppMessage({ to, body: message });
      
      await db.insert(whatsappLogs).values({
        message,
        status: result.sent ? "sent" : "failed",
        direction: "outgoing",
      });

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/whatsapp/contact-send", async (req: Request, res: Response) => {
    try {
      const { contactId, message } = req.body;
      
      const contact = await db
        .select()
        .from(contacts)
        .where(eq(contacts.id, contactId))
        .limit(1);

      if (!contact.length || !contact[0].phone) {
        return res.status(400).json({ error: "Contact not found or no phone" });
      }

      const result = await sendWhatsAppMessage({ 
        to: contact[0].phone, 
        body: message 
      });

      await db.insert(whatsappLogs).values({
        contactId,
        message,
        status: result.sent ? "sent" : "failed",
        direction: "outgoing",
      });

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/whatsapp/campaign-step-send", async (req: Request, res: Response) => {
    try {
      const { contactId, campaignStepId } = req.body;
      
      const contact = await db
        .select()
        .from(contacts)
        .where(eq(contacts.id, contactId))
        .limit(1);

      const step = await db
        .select()
        .from(campaignSteps)
        .where(eq(campaignSteps.id, campaignStepId))
        .limit(1);

      if (!contact.length || !step.length || !contact[0].phone) {
        return res.status(400).json({ error: "Invalid contact or step" });
      }

      const result = await sendWhatsAppMessage({ 
        to: contact[0].phone, 
        body: step[0].body || "" 
      });

      await db.insert(whatsappLogs).values({
        contactId,
        campaignStepId,
        message: step[0].body || "",
        status: result.sent ? "sent" : "failed",
        direction: "outgoing",
      });

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/whatsapp/webhook", async (req: Request, res: Response) => {
    try {
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/contacts/:id/whatsapp-logs", async (req: Request, res: Response) => {
    try {
      const logs = await db
        .select()
        .from(whatsappLogs)
        .where(eq(whatsappLogs.contactId, parseInt(req.params.id)));
      
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // AI Endpoints
  app.post("/api/ai/chat", async (req: Request, res: Response) => {
    try {
      const { provider, systemPrompt, messages } = req.body;
      const result = await runLLM({ provider, systemPrompt, messages });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/generate-campaign", async (req: Request, res: Response) => {
    try {
      const { provider, segmentDescription, mainOffer, tone, agentStyle } = req.body;
      
      const agentPrompt = getAgentPrompt(agentStyle || 'hormozi');
      
      const systemPrompt = `${agentPrompt}

You are generating a multi-channel campaign. Return ONLY valid JSON with this exact structure:
{
  "email_subjects": ["subject1", "subject2", "subject3"],
  "email_first_touch": "full email body here",
  "whatsapp_opening": "WhatsApp message here",
  "call_outline": "Call script outline here"
}

Target: ${segmentDescription}
Offer: ${mainOffer}
Tone: ${tone}`;

      const messages = [{ role: "user", content: "Generate the campaign content now." }];
      
      const result = await runLLM({ provider, systemPrompt, messages });
      const content = JSON.parse(result.reply);
      
      res.json(content);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/generate-step", async (req: Request, res: Response) => {
    try {
      const { provider, subjectInstruction, bodyInstruction, tone } = req.body;
      
      const systemPrompt = `You are a professional copywriter. Generate email content based on the instructions.
Return ONLY valid JSON with this structure:
{
  "subject": "email subject here",
  "body": "email body here"
}

Tone: ${tone}`;

      const messages = [{
        role: "user",
        content: `Subject instruction: ${subjectInstruction}\nBody instruction: ${bodyInstruction}`
      }];
      
      const result = await runLLM({ provider, systemPrompt, messages });
      const content = JSON.parse(result.reply);
      
      res.json(content);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/enrich-contact", async (req: Request, res: Response) => {
    try {
      const { provider, contact } = req.body;
      
      const systemPrompt = `You are a lead scoring AI. Analyze the contact and return ONLY valid JSON:
{
  "score": 85,
  "status": "hot",
  "notes": "analysis here",
  "tags": ["tag1", "tag2"]
}

Score: 1-100
Status: hot/warm/cold`;

      const messages = [{
        role: "user",
        content: `Analyze this contact: ${JSON.stringify(contact)}`
      }];
      
      const result = await runLLM({ provider, systemPrompt, messages });
      const enriched = JSON.parse(result.reply);
      
      res.json(enriched);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== BUYER INTENT API ====================
  
  app.get("/api/buyer-intent/scans", async (_req: Request, res: Response) => {
    try {
      const scans = await db.select().from(buyerIntentScans).orderBy(desc(buyerIntentScans.createdAt));
      res.json(scans || []);
    } catch (error: any) {
      console.error("Error fetching buyer intent scans:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/buyer-intent/scans/:id", async (req: Request, res: Response) => {
    try {
      const scan = await db.select().from(buyerIntentScans).where(eq(buyerIntentScans.id, parseInt(req.params.id)));
      if (!scan.length) {
        return res.status(404).json({ error: "Scan not found" });
      }
      
      const signals = await db.select().from(buyerIntentSignals).where(eq(buyerIntentSignals.domain, scan[0].domain));
      const history = await db.select().from(buyerIntentHistory).where(eq(buyerIntentHistory.domain, scan[0].domain));
      
      res.json({ ...scan[0], signals, history });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/buyer-intent/scan", async (req: Request, res: Response) => {
    try {
      const { domain } = req.body;
      
      if (!domain) {
        return res.status(400).json({ error: "Domain is required" });
      }

      const crawlerResult = await crawlDomain(domain);
      const signals = await gatherAllSignals(domain);
      const scoring = calculateIntentScore(crawlerResult, signals);
      const insights = await generateInsights({
        domain,
        title: crawlerResult.title,
        description: crawlerResult.description,
        hasContactForm: crawlerResult.hasContactForm,
        hasChat: crawlerResult.hasChat,
        hasSocialLinks: crawlerResult.hasSocialLinks,
        technology: crawlerResult.technology,
        signals,
        totalScore: scoring.totalScore
      });

      const newScan = await db.insert(buyerIntentScans).values({
        domain,
        html: crawlerResult.html.substring(0, 10000),
        score: scoring.totalScore,
        insights: JSON.stringify(insights)
      }).returning();

      for (const signal of signals) {
        await db.insert(buyerIntentSignals).values({
          domain,
          source: signal.source,
          data: signal.data,
          score: signal.score
        });
      }

      res.json({
        scan: newScan[0],
        crawlerResult,
        signals,
        scoring,
        insights
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/buyer-intent/bulk-scan", async (req: Request, res: Response) => {
    try {
      const { domains } = req.body;
      
      if (!domains || !Array.isArray(domains)) {
        return res.status(400).json({ error: "Domains array is required" });
      }

      const results = [];
      for (const domain of domains.slice(0, 10)) {
        try {
          const crawlerResult = await crawlDomain(domain);
          const signals = await gatherAllSignals(domain);
          const scoring = calculateIntentScore(crawlerResult, signals);

          const newScan = await db.insert(buyerIntentScans).values({
            domain,
            score: scoring.totalScore,
            insights: scoring.recommendation
          }).returning();

          results.push({
            domain,
            score: scoring.totalScore,
            intent: scoring.intent,
            success: true
          });
        } catch (error: any) {
          results.push({
            domain,
            score: 0,
            intent: "error",
            success: false,
            error: error.message
          });
        }
      }

      res.json({ results });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/buyer-intent/signals/:domain", async (req: Request, res: Response) => {
    try {
      const signals = await db.select().from(buyerIntentSignals).where(eq(buyerIntentSignals.domain, req.params.domain));
      res.json(signals);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/buyer-intent/scans/:id", async (req: Request, res: Response) => {
    try {
      await db.delete(buyerIntentScans).where(eq(buyerIntentScans.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== AUTOMATION API ====================
  
  app.get("/api/automations", async (_req: Request, res: Response) => {
    try {
      const allAutomations = await loadAutomations();
      res.json(allAutomations || []);
    } catch (error: any) {
      console.error("Error fetching automations:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/automations/:id", async (req: Request, res: Response) => {
    try {
      const automation = await getAutomationById(parseInt(req.params.id));
      if (!automation) {
        return res.status(404).json({ error: "Automation not found" });
      }
      res.json(automation);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/automations", async (req: Request, res: Response) => {
    try {
      const { name, description, triggerType, actions } = req.body;
      
      if (!name || !triggerType) {
        return res.status(400).json({ error: "Name and triggerType are required" });
      }

      const automation = await createAutomation({
        name,
        description,
        triggerType,
        actions: actions || []
      });

      res.json(automation);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/automations/:id", async (req: Request, res: Response) => {
    try {
      const { name, description, triggerType, isActive } = req.body;
      
      const updated = await db
        .update(automations)
        .set({ name, description, triggerType, isActive })
        .where(eq(automations.id, parseInt(req.params.id)))
        .returning();

      res.json(updated[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/automations/:id/toggle", async (req: Request, res: Response) => {
    try {
      const { isActive } = req.body;
      await updateAutomationStatus(parseInt(req.params.id), isActive);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/automations/:id", async (req: Request, res: Response) => {
    try {
      await deleteAutomation(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/automations/:id/actions", async (req: Request, res: Response) => {
    try {
      const { actionType, config } = req.body;
      
      const newAction = await db.insert(automationActions).values({
        automationId: parseInt(req.params.id),
        actionType,
        config
      }).returning();

      res.json(newAction[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/automations/:automationId/actions/:actionId", async (req: Request, res: Response) => {
    try {
      await db.delete(automationActions).where(eq(automationActions.id, parseInt(req.params.actionId)));
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/automations/:id/test", async (req: Request, res: Response) => {
    try {
      const automation = await getAutomationById(parseInt(req.params.id));
      if (!automation) {
        return res.status(404).json({ error: "Automation not found" });
      }

      const testPayload = req.body.payload || { test: true, timestamp: new Date().toISOString() };
      
      const results = await executeAutomation(
        automation.id,
        automation.actions,
        testPayload
      );

      res.json({ results });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/automations/:id/logs", async (req: Request, res: Response) => {
    try {
      const logs = await db
        .select()
        .from(automationLogs)
        .where(eq(automationLogs.automationId, parseInt(req.params.id)))
        .orderBy(desc(automationLogs.createdAt));
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/automation-triggers", async (_req: Request, res: Response) => {
    res.json(TRIGGER_DEFINITIONS);
  });

  app.get("/api/automation-actions", async (_req: Request, res: Response) => {
    res.json(ACTION_DEFINITIONS);
  });

  app.post("/api/automations/generate", async (req: Request, res: Response) => {
    try {
      const { description } = req.body;
      
      if (!description) {
        return res.status(400).json({ error: "Description is required" });
      }

      const blueprint = await generateAutomationBlueprint(description);
      res.json(blueprint);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/automations/:id/export/n8n", async (req: Request, res: Response) => {
    try {
      const automation = await getAutomationById(parseInt(req.params.id));
      if (!automation) {
        return res.status(404).json({ error: "Automation not found" });
      }

      const n8nBlueprint = generateN8nBlueprint({
        name: automation.name,
        description: automation.description || "",
        triggerType: automation.triggerType,
        actions: automation.actions.map(a => ({
          actionType: a.actionType,
          config: a.config || {}
        }))
      });

      res.json(n8nBlueprint);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/automations/:id/export/make", async (req: Request, res: Response) => {
    try {
      const automation = await getAutomationById(parseInt(req.params.id));
      if (!automation) {
        return res.status(404).json({ error: "Automation not found" });
      }

      const makeBlueprint = generateMakeBlueprint({
        name: automation.name,
        description: automation.description || "",
        triggerType: automation.triggerType,
        actions: automation.actions.map(a => ({
          actionType: a.actionType,
          config: a.config || {}
        }))
      });

      res.json(makeBlueprint);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/integrations/n8n/workflows", async (_req: Request, res: Response) => {
    try {
      const result = await listN8nWorkflows();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/integrations/make/scenarios", async (_req: Request, res: Response) => {
    try {
      const result = await listMakeScenarios();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/webhooks/automation-trigger", async (req: Request, res: Response) => {
    try {
      const { triggerType, payload } = req.body;
      
      const allAutomations = await loadAutomations();
      const event = createTriggerEvent(triggerType, payload);
      const matchingAutomations = matchTrigger(event, allAutomations);
      
      const results = [];
      for (const automation of matchingAutomations) {
        const executionResults = await executeAutomation(
          automation.id,
          automation.actions,
          payload
        );
        results.push({
          automationId: automation.id,
          automationName: automation.name,
          results: executionResults
        });
      }

      res.json({ triggered: matchingAutomations.length, results });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}
