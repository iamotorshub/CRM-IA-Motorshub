import { runLLM } from "../ai/llmRouter";
import { TRIGGER_DEFINITIONS } from "./triggers";
import { ACTION_DEFINITIONS } from "./executor";

interface AutomationBlueprint {
  name: string;
  description: string;
  triggerType: string;
  actions: Array<{
    actionType: string;
    config: Record<string, any>;
  }>;
}

export async function generateAutomationBlueprint(
  description: string
): Promise<AutomationBlueprint> {
  const triggersList = Object.entries(TRIGGER_DEFINITIONS)
    .map(([key, val]) => `${key}: ${val.description}`)
    .join("\n");
  
  const actionsList = Object.entries(ACTION_DEFINITIONS)
    .map(([key, val]) => `${key}: ${val.description}`)
    .join("\n");
  
  const prompt = `Generate an automation blueprint based on this description:
"${description}"

Available triggers:
${triggersList}

Available actions:
${actionsList}

Return ONLY valid JSON with this structure:
{
  "name": "Automation Name",
  "description": "What this automation does",
  "triggerType": "one_of_the_triggers",
  "actions": [
    {
      "actionType": "one_of_the_actions",
      "config": { "relevant": "config" }
    }
  ]
}`;

  try {
    const result = await runLLM({
      provider: "openai",
      systemPrompt: "You are an automation expert. Generate automation blueprints in valid JSON format only.",
      messages: [{ role: "user", content: prompt }]
    });
    
    const jsonMatch = result.reply.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error("[AutomationBuilder] Error generating blueprint:", error);
  }
  
  return {
    name: "New Automation",
    description: description,
    triggerType: "contact.created",
    actions: [
      {
        actionType: "notify_team",
        config: { channel: "default", message: "New automation triggered" }
      }
    ]
  };
}

export function generateN8nBlueprint(automation: AutomationBlueprint): Record<string, any> {
  const nodes: any[] = [];
  let nodeY = 0;
  
  nodes.push({
    id: "trigger",
    name: "Webhook Trigger",
    type: "n8n-nodes-base.webhook",
    position: [250, nodeY],
    parameters: {
      httpMethod: "POST",
      path: `automation-${Date.now()}`
    }
  });
  
  let previousNodeId = "trigger";
  
  for (let i = 0; i < automation.actions.length; i++) {
    const action = automation.actions[i];
    nodeY += 200;
    
    const nodeId = `action_${i}`;
    let nodeType = "n8n-nodes-base.noOp";
    let params: Record<string, any> = {};
    
    switch (action.actionType) {
      case "send_whatsapp":
        nodeType = "n8n-nodes-base.httpRequest";
        params = {
          method: "POST",
          url: "{{$env.WHATSAPP_API_URL}}",
          body: JSON.stringify({ message: action.config.message })
        };
        break;
      case "send_email":
        nodeType = "n8n-nodes-base.emailSend";
        params = {
          to: action.config.to,
          subject: action.config.subject,
          text: action.config.body
        };
        break;
      case "webhook":
        nodeType = "n8n-nodes-base.httpRequest";
        params = {
          method: action.config.method || "POST",
          url: action.config.url
        };
        break;
      default:
        nodeType = "n8n-nodes-base.set";
        params = { values: { string: [{ name: "action", value: action.actionType }] } };
    }
    
    nodes.push({
      id: nodeId,
      name: action.actionType,
      type: nodeType,
      position: [250, nodeY],
      parameters: params
    });
    
    previousNodeId = nodeId;
  }
  
  const connections: Record<string, any> = {};
  for (let i = 0; i < nodes.length - 1; i++) {
    connections[nodes[i].id] = {
      main: [[{ node: nodes[i + 1].id, type: "main", index: 0 }]]
    };
  }
  
  return {
    name: automation.name,
    nodes,
    connections,
    active: false,
    settings: {}
  };
}

export function generateMakeBlueprint(automation: AutomationBlueprint): Record<string, any> {
  const modules: any[] = [];
  
  modules.push({
    id: 1,
    module: "gateway:CustomWebHook",
    version: 1,
    parameters: {},
    mapper: {},
    metadata: {
      designer: { x: 0, y: 0 }
    }
  });
  
  for (let i = 0; i < automation.actions.length; i++) {
    const action = automation.actions[i];
    
    let moduleType = "builtin:BasicRouter";
    const mapper: Record<string, any> = {};
    
    switch (action.actionType) {
      case "send_whatsapp":
        moduleType = "http:ActionSendData";
        mapper.url = "{{WHATSAPP_API_URL}}";
        mapper.method = "POST";
        break;
      case "send_email":
        moduleType = "email:ActionSendEmail";
        mapper.to = action.config.to;
        mapper.subject = action.config.subject;
        break;
      case "webhook":
        moduleType = "http:ActionSendData";
        mapper.url = action.config.url;
        mapper.method = action.config.method || "POST";
        break;
      default:
        moduleType = "builtin:BasicRouter";
    }
    
    modules.push({
      id: i + 2,
      module: moduleType,
      version: 1,
      parameters: {},
      mapper,
      metadata: {
        designer: { x: (i + 1) * 300, y: 0 }
      }
    });
  }
  
  return {
    name: automation.name,
    blueprint: {
      flow: modules,
      metadata: {
        version: 1,
        designer: { orphans: [] }
      }
    }
  };
}
