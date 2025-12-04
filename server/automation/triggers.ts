export type TriggerType = 
  | "contact.created"
  | "contact.updated"
  | "contact.scored_high"
  | "intent.high"
  | "intent.medium"
  | "whatsapp.received"
  | "campaign.completed"
  | "deal.created"
  | "deal.stage_changed"
  | "property.viewed"
  | "form.submitted"
  | "schedule.daily"
  | "schedule.weekly"
  | "webhook.received";

export interface TriggerEvent {
  type: TriggerType;
  payload: Record<string, any>;
  timestamp: Date;
}

export interface AutomationWithActions {
  id: number;
  name: string;
  triggerType: string;
  isActive: boolean | null;
  actions: Array<{
    actionType: string;
    config: any;
  }>;
}

export function matchTrigger(
  event: TriggerEvent,
  automations: AutomationWithActions[]
): AutomationWithActions[] {
  return automations.filter(
    automation => 
      automation.isActive && 
      automation.triggerType === event.type
  );
}

export function createTriggerEvent(
  type: TriggerType,
  payload: Record<string, any>
): TriggerEvent {
  return {
    type,
    payload,
    timestamp: new Date()
  };
}

export const TRIGGER_DEFINITIONS: Record<TriggerType, { label: string; description: string }> = {
  "contact.created": {
    label: "Contact Created",
    description: "Triggered when a new contact is added to the CRM"
  },
  "contact.updated": {
    label: "Contact Updated",
    description: "Triggered when contact information is modified"
  },
  "contact.scored_high": {
    label: "Contact Scored High",
    description: "Triggered when a contact's score exceeds threshold"
  },
  "intent.high": {
    label: "High Intent Detected",
    description: "Triggered when buyer intent scan shows high score"
  },
  "intent.medium": {
    label: "Medium Intent Detected",
    description: "Triggered when buyer intent scan shows medium score"
  },
  "whatsapp.received": {
    label: "WhatsApp Message Received",
    description: "Triggered when a WhatsApp message is received"
  },
  "campaign.completed": {
    label: "Campaign Completed",
    description: "Triggered when a campaign finishes execution"
  },
  "deal.created": {
    label: "Deal Created",
    description: "Triggered when a new deal is created"
  },
  "deal.stage_changed": {
    label: "Deal Stage Changed",
    description: "Triggered when a deal moves to a new stage"
  },
  "property.viewed": {
    label: "Property Viewed",
    description: "Triggered when a property listing is viewed"
  },
  "form.submitted": {
    label: "Form Submitted",
    description: "Triggered when a web form is submitted"
  },
  "schedule.daily": {
    label: "Daily Schedule",
    description: "Triggered once per day at specified time"
  },
  "schedule.weekly": {
    label: "Weekly Schedule",
    description: "Triggered once per week on specified day"
  },
  "webhook.received": {
    label: "Webhook Received",
    description: "Triggered when external webhook is received"
  }
};
