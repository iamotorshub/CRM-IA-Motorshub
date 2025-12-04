interface MakeConfig {
  baseUrl: string;
  apiKey: string;
  teamId: string;
}

interface MakeResult {
  success: boolean;
  scenarioId?: string;
  executionId?: string;
  error?: string;
}

function getMakeConfig(): MakeConfig {
  return {
    baseUrl: process.env.MAKE_BASE_URL || "https://hook.eu1.make.com",
    apiKey: process.env.MAKE_API_KEY || "",
    teamId: process.env.MAKE_TEAM_ID || ""
  };
}

export async function postToMake(
  scenarioId: string,
  payload: Record<string, any>
): Promise<MakeResult> {
  const config = getMakeConfig();
  
  if (!config.apiKey) {
    console.log("[Make] API key not configured, simulating success");
    return {
      success: true,
      scenarioId,
      executionId: `sim-${Date.now()}`
    };
  }
  
  try {
    const webhookUrl = `${config.baseUrl}/${scenarioId}`;
    
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        scenarioId,
        error: `Make error: ${response.status} - ${errorText}`
      };
    }
    
    return {
      success: true,
      scenarioId,
      executionId: `exec-${Date.now()}`
    };
  } catch (error: any) {
    return {
      success: false,
      scenarioId,
      error: error.message
    };
  }
}

export async function createMakeScenario(
  blueprint: Record<string, any>
): Promise<MakeResult> {
  const config = getMakeConfig();
  
  if (!config.apiKey) {
    console.log("[Make] API key not configured, simulating scenario creation");
    return {
      success: true,
      scenarioId: `sc-sim-${Date.now()}`
    };
  }
  
  try {
    const response = await fetch(
      `https://eu1.make.com/api/v2/scenarios`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${config.apiKey}`
        },
        body: JSON.stringify({
          teamId: config.teamId,
          ...blueprint
        })
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Make error: ${response.status} - ${errorText}`
      };
    }
    
    const result = await response.json();
    
    return {
      success: true,
      scenarioId: result.scenario?.id || result.id
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

export async function listMakeScenarios(): Promise<{ scenarios: any[]; error?: string }> {
  const config = getMakeConfig();
  
  if (!config.apiKey) {
    return {
      scenarios: [
        { id: "demo-1", name: "New Lead Notification", isActive: true },
        { id: "demo-2", name: "CRM Sync", isActive: true },
        { id: "demo-3", name: "Property Alert", isActive: false }
      ]
    };
  }
  
  try {
    const response = await fetch(
      `https://eu1.make.com/api/v2/scenarios?teamId=${config.teamId}`,
      {
        headers: {
          "Authorization": `Token ${config.apiKey}`
        }
      }
    );
    
    if (!response.ok) {
      return { scenarios: [], error: `Failed to fetch scenarios: ${response.status}` };
    }
    
    const result = await response.json();
    return { scenarios: result.scenarios || result };
  } catch (error: any) {
    return { scenarios: [], error: error.message };
  }
}
