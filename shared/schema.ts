
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
  campaignId: integer("campaign_id").references(() => campaigns.id),
  order: integer("order"),
  subject: text("subject"),
  body: text("body"),
  delayDays: integer("delay_days"),
});
