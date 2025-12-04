interface N8nConfig {
  baseUrl: string;
  apiKey: string;
}

interface N8nResult {
  success: boolean;
  workflowId?: string;
  executionId?: string;
  error?: string;
}

function getN8nConfig(): N8nConfig {
  return {
    baseUrl: process.env.N8N_BASE_URL || "http://localhost:5678",
    apiKey: process.env.N8N_API_KEY || ""
  };
}

export async function postToN8n(
  workflowId: string,
  payload: Record<string, any>
): Promise<N8nResult> {
  const config = getN8nConfig();
  
  if (!config.apiKey) {
    console.log("[n8n] API key not configured, simulating success");
    return {
      success: true,
      workflowId,
      executionId: `sim-${Date.now()}`
    };
  }
  
  try {
    const response = await fetch(
      `${config.baseUrl}/api/v1/workflows/${workflowId}/execute`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-N8N-API-KEY": config.apiKey
        },
        body: JSON.stringify({ data: payload })
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        workflowId,
        error: `n8n error: ${response.status} - ${errorText}`
      };
    }
    
    const result = await response.json();
    
    return {
      success: true,
      workflowId,
      executionId: result.executionId || result.id
    };
  } catch (error: any) {
    return {
      success: false,
      workflowId,
      error: error.message
    };
  }
}

export async function createN8nWorkflow(
  blueprint: Record<string, any>
): Promise<N8nResult> {
  const config = getN8nConfig();
  
  if (!config.apiKey) {
    console.log("[n8n] API key not configured, simulating workflow creation");
    return {
      success: true,
      workflowId: `wf-sim-${Date.now()}`
    };
  }
  
  try {
    const response = await fetch(
      `${config.baseUrl}/api/v1/workflows`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-N8N-API-KEY": config.apiKey
        },
        body: JSON.stringify(blueprint)
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `n8n error: ${response.status} - ${errorText}`
      };
    }
    
    const result = await response.json();
    
    return {
      success: true,
      workflowId: result.id
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

export async function listN8nWorkflows(): Promise<{ workflows: any[]; error?: string }> {
  const config = getN8nConfig();
  
  if (!config.apiKey) {
    return {
      workflows: [
        { id: "demo-1", name: "Lead Qualification Flow", active: true },
        { id: "demo-2", name: "Follow-up Sequence", active: true },
        { id: "demo-3", name: "Data Enrichment", active: false }
      ]
    };
  }
  
  try {
    const response = await fetch(
      `${config.baseUrl}/api/v1/workflows`,
      {
        headers: {
          "X-N8N-API-KEY": config.apiKey
        }
      }
    );
    
    if (!response.ok) {
      return { workflows: [], error: `Failed to fetch workflows: ${response.status}` };
    }
    
    const result = await response.json();
    return { workflows: result.data || result };
  } catch (error: any) {
    return { workflows: [], error: error.message };
  }
}
