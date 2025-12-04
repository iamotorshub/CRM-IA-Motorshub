import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";

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