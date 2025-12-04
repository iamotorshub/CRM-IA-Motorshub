import { pgTable, text, serial, integer, timestamp, boolean, json } from "drizzle-orm/pg-core";

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  phone: text("phone"),
  location: text("location"),
  status: text("status"),
  source: text("source"),
  score: integer("score"),
  tags: text("tags"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: text("name"),
  status: text("status").default("draft"),
  targetSegment: text("target_segment").default("all"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const campaignSteps = pgTable("campaign_steps", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id, { onDelete: "cascade" }),
  stepOrder: integer("step_order").notNull(),
  channel: text("channel").notNull(),
  delayDays: integer("delay_days").default(0),
  subject: text("subject"),
  body: text("body"),
  status: text("status").default("draft"),
});

export const whatsappLogs = pgTable("whatsapp_logs", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").references(() => contacts.id, { onDelete: "cascade" }),
  campaignStepId: integer("campaign_step_id"),
  direction: text("direction").default("outgoing"),
  message: text("message"),
  provider: text("provider").default("ultramsg"),
  status: text("status").default("sent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const buyerIntentScans = pgTable("buyer_intent_scans", {
  id: serial("id").primaryKey(),
  domain: text("domain").notNull(),
  html: text("html"),
  screenshotUrl: text("screenshot_url"),
  score: integer("score").default(0),
  insights: text("insights"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const buyerIntentSignals = pgTable("buyer_intent_signals", {
  id: serial("id").primaryKey(),
  domain: text("domain").notNull(),
  source: text("source").notNull(),
  data: json("data"),
  score: integer("score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const buyerIntentHistory = pgTable("buyer_intent_history", {
  id: serial("id").primaryKey(),
  domain: text("domain").notNull(),
  diff: text("diff"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const automations = pgTable("automations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  triggerType: text("trigger_type").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const automationActions = pgTable("automation_actions", {
  id: serial("id").primaryKey(),
  automationId: integer("automation_id").references(() => automations.id, { onDelete: "cascade" }),
  actionType: text("action_type").notNull(),
  config: json("config"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const automationLogs = pgTable("automation_logs", {
  id: serial("id").primaryKey(),
  automationId: integer("automation_id").references(() => automations.id, { onDelete: "cascade" }),
  status: text("status").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});
