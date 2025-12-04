
import type { Express } from "express";
import { createServer as createHttpServer, Server } from "http";
import { db } from "../db";
import { contacts } from "../shared/schema";
import { eq } from "drizzle-orm";
import * as storage from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // GET /api/contacts
  app.get("/api/contacts", async (_req, res) => {
    try {
      const allContacts = await storage.getContacts();
      return res.json(allContacts);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // GET /api/contacts/:id
  app.get("/api/contacts/:id", async (req, res) => {
    try {
      const contact = await storage.getContactById(parseInt(req.params.id));
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      return res.json(contact);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // POST /api/contacts
  app.post("/api/contacts", async (req, res) => {
    try {
      const newContact = await storage.createContact(req.body);
      return res.status(201).json(newContact);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // PUT /api/contacts/:id
  app.put("/api/contacts/:id", async (req, res) => {
    try {
      const updated = await storage.updateContact(parseInt(req.params.id), req.body);
      if (!updated) {
        return res.status(404).json({ message: "Contact not found" });
      }
      return res.json(updated);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // DELETE /api/contacts/:id
  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteContact(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Contact not found" });
      }
      return res.json({ message: "Contact deleted" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // POST /api/contacts/bulk
  app.post("/api/contacts/bulk", async (req, res) => {
    try {
      const { contacts: contactsData } = req.body;
      if (!Array.isArray(contactsData)) {
        return res.status(400).json({ message: "Invalid data format" });
      }
      const created = await storage.bulkCreateContacts(contactsData);
      return res.status(201).json({ count: created.length, contacts: created });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // Campaign routes
  app.get("/api/campaigns", async (_req, res) => {
    try {
      const allCampaigns = await storage.getCampaigns();
      return res.json(allCampaigns);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/campaigns", async (req, res) => {
    try {
      const newCampaign = await storage.createCampaign(req.body);
      return res.status(201).json(newCampaign);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const campaign = await storage.getCampaignById(parseInt(req.params.id));
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      const steps = await storage.getStepsForCampaign(campaign.id);
      return res.json({ ...campaign, steps });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/campaigns/:id", async (req, res) => {
    try {
      const updated = await storage.updateCampaign(parseInt(req.params.id), req.body);
      if (!updated) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      return res.json(updated);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/campaigns/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCampaign(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      return res.json({ message: "Campaign deleted" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // Campaign step routes
  app.post("/api/campaigns/:id/steps", async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const newStep = await storage.createStep({ ...req.body, campaignId });
      return res.status(201).json(newStep);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/campaigns/:id/steps/:stepId", async (req, res) => {
    try {
      const updated = await storage.updateStep(parseInt(req.params.stepId), req.body);
      if (!updated) {
        return res.status(404).json({ message: "Step not found" });
      }
      return res.json(updated);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/campaigns/:id/steps/:stepId", async (req, res) => {
    try {
      const deleted = await storage.deleteStep(parseInt(req.params.stepId));
      if (!deleted) {
        return res.status(404).json({ message: "Step not found" });
      }
      return res.json({ message: "Step deleted" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/campaigns/:id/steps/reorder", async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const { steps } = req.body;
      const reordered = await storage.reorderSteps(campaignId, steps);
      return res.json(reordered);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // AI generation routes
  app.post("/api/ai/generate-campaign", async (req, res) => {
    try {
      const { targetAudience, productService, tone } = req.body;
      
      // Mock AI response for now - integrate with actual LLM later
      const generated = {
        email_subjects: [
          `Exclusive Offer for ${targetAudience}`,
          `Don't Miss Out: ${productService} Special`,
          `Limited Time: ${productService} Benefits`
        ],
        email_first_touch: `Hi there!\n\nI hope this message finds you well. I wanted to reach out because I believe ${productService} could be a great fit for ${targetAudience}.\n\nBest regards`,
        whatsapp_opening: `Hi! 👋 Quick question about ${productService} - do you have a moment?`,
        call_outline: [
          "Introduction and rapport building",
          `Discuss pain points relevant to ${targetAudience}`,
          `Present ${productService} solution`,
          "Handle objections",
          "Schedule follow-up or close"
        ]
      };
      
      return res.json(generated);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/generate-step", async (req, res) => {
    try {
      const { campaignContext, stepNumber, previousContent } = req.body;
      
      // Mock AI response
      const generated = {
        subject: `Follow-up #${stepNumber}: ${campaignContext}`,
        body: `Building on our previous conversation...\n\n${previousContent ? 'Following up on: ' + previousContent : 'Let me share more details.'}\n\nBest regards`
      };
      
      return res.json(generated);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  return httpServer;
}
