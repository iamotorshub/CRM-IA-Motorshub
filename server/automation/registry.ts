import { db } from "../../db";
import { automations, automationActions } from "../../shared/schema";
import { eq } from "drizzle-orm";

export interface Automation {
  id: number;
  name: string;
  description: string | null;
  triggerType: string;
  isActive: boolean | null;
  createdAt: Date | null;
  actions: AutomationAction[];
}

export interface AutomationAction {
  id: number;
  automationId: number | null;
  actionType: string;
  config: any;
  createdAt: Date | null;
}

export async function loadAutomations(): Promise<Automation[]> {
  const allAutomations = await db.select().from(automations);
  
  if (!allAutomations || allAutomations.length === 0) {
    return [];
  }
  
  const result: Automation[] = [];
  
  for (const automation of allAutomations) {
    const actions = await db
      .select()
      .from(automationActions)
      .where(eq(automationActions.automationId, automation.id));
    
    result.push({
      ...automation,
      actions: actions || []
    });
  }
  
  return result;
}

export async function getAutomationById(id: number): Promise<Automation | null> {
  const automationResult = await db
    .select()
    .from(automations)
    .where(eq(automations.id, id));
  
  if (!automationResult.length) return null;
  
  const actions = await db
    .select()
    .from(automationActions)
    .where(eq(automationActions.automationId, id));
  
  return {
    ...automationResult[0],
    actions
  };
}

export async function createAutomation(data: {
  name: string;
  description?: string;
  triggerType: string;
  actions: Array<{ actionType: string; config: any }>;
}): Promise<Automation> {
  const newAutomation = await db
    .insert(automations)
    .values({
      name: data.name,
      description: data.description || null,
      triggerType: data.triggerType,
      isActive: true
    })
    .returning();
  
  const automationId = newAutomation[0].id;
  
  const createdActions: AutomationAction[] = [];
  for (const action of data.actions) {
    const newAction = await db
      .insert(automationActions)
      .values({
        automationId,
        actionType: action.actionType,
        config: action.config
      })
      .returning();
    createdActions.push(newAction[0]);
  }
  
  return {
    ...newAutomation[0],
    actions: createdActions
  };
}

export async function updateAutomationStatus(id: number, isActive: boolean): Promise<void> {
  await db
    .update(automations)
    .set({ isActive })
    .where(eq(automations.id, id));
}

export async function deleteAutomation(id: number): Promise<void> {
  await db.delete(automations).where(eq(automations.id, id));
}
