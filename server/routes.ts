
import type { Express, Request, Response } from "express";
import type { Server as HTTPServer } from "http";
import { db } from "../db";
import { contacts, campaigns, campaignSteps, whatsappLogs } from "../shared/schema";
import { eq } from "drizzle-orm";
import { runLLM } from "./ai/llmRouter";
import { getAgentPrompt } from "./ai/agents/hormozi";
import { sendWhatsAppMessage } from "./whatsapp/ultraMsgClient";

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
      const { id, status } = req.body;
      // Update log status based on webhook data
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
}
