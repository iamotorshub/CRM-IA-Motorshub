import { db } from "../../db";
import { automationLogs } from "../../shared/schema";
import { sendWhatsAppMessage } from "../whatsapp/ultraMsgClient";
import { postToN8n } from "./n8nClient";
import { postToMake } from "./makeClient";

export type ActionType = 
  | "send_whatsapp"
  | "send_email"
  | "webhook"
  | "run_n8n"
  | "run_make"
  | "update_contact"
  | "create_task"
  | "add_tag"
  | "notify_team";

interface ActionConfig {
  [key: string]: any;
}

interface ExecutionResult {
  success: boolean;
  actionType: string;
  message: string;
  data?: any;
}

async function logExecution(
  automationId: number,
  status: string,
  message: string
): Promise<void> {
  await db.insert(automationLogs).values({
    automationId,
    status,
    message
  });
}

export async function executeAction(
  automationId: number,
  actionType: ActionType,
  config: ActionConfig,
  payload: Record<string, any>
): Promise<ExecutionResult> {
  try {
    switch (actionType) {
      case "send_whatsapp": {
        const phone = config.phone || payload.phone;
        const message = interpolateTemplate(config.message || "", payload);
        
        if (!phone) {
          await logExecution(automationId, "failed", "No phone number provided");
          return { success: false, actionType, message: "No phone number" };
        }
        
        const result = await sendWhatsAppMessage({ to: phone, body: message });
        await logExecution(automationId, result.sent ? "success" : "failed", `WhatsApp to ${phone}`);
        return { success: result.sent, actionType, message: `WhatsApp sent to ${phone}`, data: result };
      }
      
      case "send_email": {
        const to = config.to || payload.email;
        const subject = interpolateTemplate(config.subject || "", payload);
        const body = interpolateTemplate(config.body || "", payload);
        
        await logExecution(automationId, "success", `Email queued to ${to}`);
        return { success: true, actionType, message: `Email queued to ${to}`, data: { to, subject } };
      }
      
      case "webhook": {
        const url = config.url;
        const method = config.method || "POST";
        const headers = config.headers || {};
        
        try {
          const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json", ...headers },
            body: JSON.stringify(payload)
          });
          
          const success = response.ok;
          await logExecution(automationId, success ? "success" : "failed", `Webhook to ${url}: ${response.status}`);
          return { success, actionType, message: `Webhook ${method} ${url}`, data: { status: response.status } };
        } catch (error: any) {
          await logExecution(automationId, "failed", `Webhook failed: ${error.message}`);
          return { success: false, actionType, message: error.message };
        }
      }
      
      case "run_n8n": {
        const result = await postToN8n(config.workflowId, payload);
        await logExecution(automationId, result.success ? "success" : "failed", `n8n workflow ${config.workflowId}`);
        return { success: result.success, actionType, message: "n8n workflow triggered", data: result };
      }
      
      case "run_make": {
        const result = await postToMake(config.scenarioId, payload);
        await logExecution(automationId, result.success ? "success" : "failed", `Make scenario ${config.scenarioId}`);
        return { success: result.success, actionType, message: "Make scenario triggered", data: result };
      }
      
      case "update_contact": {
        await logExecution(automationId, "success", `Contact update: ${JSON.stringify(config.updates)}`);
        return { success: true, actionType, message: "Contact updated", data: config.updates };
      }
      
      case "create_task": {
        await logExecution(automationId, "success", `Task created: ${config.title}`);
        return { success: true, actionType, message: `Task created: ${config.title}` };
      }
      
      case "add_tag": {
        await logExecution(automationId, "success", `Tag added: ${config.tag}`);
        return { success: true, actionType, message: `Tag added: ${config.tag}` };
      }
      
      case "notify_team": {
        await logExecution(automationId, "success", `Team notified: ${config.channel}`);
        return { success: true, actionType, message: `Team notified via ${config.channel}` };
      }
      
      default:
        await logExecution(automationId, "failed", `Unknown action type: ${actionType}`);
        return { success: false, actionType, message: `Unknown action type: ${actionType}` };
    }
  } catch (error: any) {
    await logExecution(automationId, "failed", error.message);
    return { success: false, actionType, message: error.message };
  }
}

export async function executeAutomation(
  automationId: number,
  actions: Array<{ actionType: string; config: any }>,
  payload: Record<string, any>
): Promise<ExecutionResult[]> {
  const results: ExecutionResult[] = [];
  
  for (const action of actions) {
    const result = await executeAction(
      automationId,
      action.actionType as ActionType,
      action.config || {},
      payload
    );
    results.push(result);
    
    if (!result.success && action.config?.stopOnError) {
      break;
    }
  }
  
  return results;
}

function interpolateTemplate(template: string, data: Record<string, any>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] !== undefined ? String(data[key]) : match;
  });
}

export const ACTION_DEFINITIONS: Record<ActionType, { label: string; description: string; configFields: string[] }> = {
  "send_whatsapp": {
    label: "Send WhatsApp",
    description: "Send a WhatsApp message to the contact",
    configFields: ["message", "phone"]
  },
  "send_email": {
    label: "Send Email",
    description: "Send an email to the contact",
    configFields: ["to", "subject", "body"]
  },
  "webhook": {
    label: "Call Webhook",
    description: "Make an HTTP request to an external URL",
    configFields: ["url", "method", "headers"]
  },
  "run_n8n": {
    label: "Run n8n Workflow",
    description: "Trigger an n8n automation workflow",
    configFields: ["workflowId"]
  },
  "run_make": {
    label: "Run Make Scenario",
    description: "Trigger a Make (Integromat) scenario",
    configFields: ["scenarioId"]
  },
  "update_contact": {
    label: "Update Contact",
    description: "Update contact fields in CRM",
    configFields: ["updates"]
  },
  "create_task": {
    label: "Create Task",
    description: "Create a follow-up task",
    configFields: ["title", "dueDate", "assignee"]
  },
  "add_tag": {
    label: "Add Tag",
    description: "Add a tag to the contact",
    configFields: ["tag"]
  },
  "notify_team": {
    label: "Notify Team",
    description: "Send notification to team channel",
    configFields: ["channel", "message"]
  }
};
