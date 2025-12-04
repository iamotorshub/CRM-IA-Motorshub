import { db } from "../db";
import { contacts, campaigns, campaignSteps, whatsappLogs } from "../shared/schema";
import { eq } from "drizzle-orm";

export async function getContacts() {
  return await db.select().from(contacts);
}

export async function getContactById(id: number) {
  const result = await db.select().from(contacts).where(eq(contacts.id, id));
  return result[0] || null;
}

export async function createContact(data: typeof contacts.$inferInsert) {
  const result = await db.insert(contacts).values(data).returning();
  return result[0];
}

export async function updateContact(id: number, data: Partial<typeof contacts.$inferInsert>) {
  const result = await db.update(contacts).set(data).where(eq(contacts.id, id)).returning();
  return result[0] || null;
}

export async function deleteContact(id: number) {
  const result = await db.delete(contacts).where(eq(contacts.id, id)).returning();
  return result[0] || null;
}

export async function bulkCreateContacts(rows: Array<typeof contacts.$inferInsert>) {
  if (rows.length === 0) return [];
  return await db.insert(contacts).values(rows).returning();
}

export async function getCampaigns() {
  return await db.select().from(campaigns);
}

export async function getCampaignById(id: number) {
  const result = await db.select().from(campaigns).where(eq(campaigns.id, id));
  return result[0] || null;
}

export async function createCampaign(data: typeof campaigns.$inferInsert) {
  const result = await db.insert(campaigns).values(data).returning();
  return result[0];
}

export async function updateCampaign(id: number, data: Partial<typeof campaigns.$inferInsert>) {
  const result = await db.update(campaigns).set(data).where(eq(campaigns.id, id)).returning();
  return result[0] || null;
}

export async function deleteCampaign(id: number) {
  const result = await db.delete(campaigns).where(eq(campaigns.id, id)).returning();
  return result[0] || null;
}

export async function getStepsForCampaign(campaignId: number) {
  return await db.select().from(campaignSteps).where(eq(campaignSteps.campaignId, campaignId));
}

export async function createStep(data: typeof campaignSteps.$inferInsert) {
  const result = await db.insert(campaignSteps).values(data).returning();
  return result[0];
}

export async function updateStep(id: number, data: Partial<typeof campaignSteps.$inferInsert>) {
  const result = await db.update(campaignSteps).set(data).where(eq(campaignSteps.id, id)).returning();
  return result[0] || null;
}

export async function deleteStep(id: number) {
  const result = await db.delete(campaignSteps).where(eq(campaignSteps.id, id)).returning();
  return result[0] || null;
}

export async function reorderSteps(campaignId: number, steps: Array<{ id: number; stepOrder: number }>) {
  for (const step of steps) {
    await db.update(campaignSteps).set({ stepOrder: step.stepOrder }).where(eq(campaignSteps.id, step.id));
  }
  return await getStepsForCampaign(campaignId);
}

export async function createWhatsAppLog(data: typeof whatsappLogs.$inferInsert) {
  const result = await db.insert(whatsappLogs).values(data).returning();
  return result[0];
}

export async function getWhatsAppLogsForContact(contactId: number) {
  return await db.select().from(whatsappLogs).where(eq(whatsappLogs.contactId, contactId));
}
