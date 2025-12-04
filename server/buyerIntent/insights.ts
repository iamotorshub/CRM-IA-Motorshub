import { runLLM } from "../ai/llmRouter";

interface InsightRequest {
  domain: string;
  title: string;
  description: string;
  hasContactForm: boolean;
  hasChat: boolean;
  hasSocialLinks: boolean;
  technology: string[];
  signals: Array<{
    source: string;
    data: Record<string, any>;
    score: number;
  }>;
  totalScore: number;
}

interface InsightResult {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  recommendedApproach: string;
  talkingPoints: string[];
  estimatedValue: string;
}

export async function generateInsights(request: InsightRequest): Promise<InsightResult> {
  try {
    const prompt = `Analyze this real estate agency website and provide sales intelligence:

Domain: ${request.domain}
Title: ${request.title}
Description: ${request.description}
Has Contact Form: ${request.hasContactForm}
Has Chat Widget: ${request.hasChat}
Has Social Links: ${request.hasSocialLinks}
Technologies: ${request.technology.join(", ") || "None detected"}
Overall Score: ${request.totalScore}/100

Digital Presence Signals:
${request.signals.map(s => `- ${s.source}: Score ${s.score}, Data: ${JSON.stringify(s.data)}`).join("\n")}

Provide a JSON response with:
{
  "summary": "brief 2-3 sentence summary",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "opportunities": ["opportunity1", "opportunity2"],
  "recommendedApproach": "how to approach this prospect",
  "talkingPoints": ["point1", "point2", "point3"],
  "estimatedValue": "estimated monthly value if they become a client"
}`;

    const result = await runLLM({
      provider: "openai",
      systemPrompt: "You are a sales intelligence AI that analyzes websites and provides actionable insights for B2B sales. Always respond with valid JSON.",
      messages: [{ role: "user", content: prompt }]
    });

    try {
      const jsonMatch = result.reply.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
    }

    return {
      summary: `${request.domain} is a real estate agency with a score of ${request.totalScore}/100. ${request.hasContactForm ? "They have a contact form." : "No contact form detected."} ${request.hasChat ? "Chat widget present." : "No chat widget."}`,
      strengths: request.technology.length > 0 ? ["Modern technology stack"] : ["Established presence"],
      weaknesses: !request.hasChat ? ["No live chat support"] : [],
      opportunities: ["AI-powered lead generation", "Premium website redesign", "Marketing automation"],
      recommendedApproach: request.totalScore >= 60 ? "Premium package pitch" : "Growth-focused consultation",
      talkingPoints: [
        "Discuss their current lead generation challenges",
        "Highlight AI chatbot benefits for 24/7 lead capture",
        "Present case studies from similar agencies"
      ],
      estimatedValue: request.totalScore >= 60 ? "$2,000-5,000/mo" : "$500-1,500/mo"
    };
  } catch (error: any) {
    return {
      summary: `Analysis for ${request.domain}`,
      strengths: ["Website is live and accessible"],
      weaknesses: ["Limited data available"],
      opportunities: ["Digital transformation potential"],
      recommendedApproach: "Initial discovery call recommended",
      talkingPoints: ["Understand their current digital strategy"],
      estimatedValue: "To be determined"
    };
  }
}
