import { runLLM } from "../ai/llmRouter";

interface CrawlerResult {
  html: string;
  title: string;
  description: string;
  keywords: string[];
  hasContactForm: boolean;
  hasChat: boolean;
  hasSocialLinks: boolean;
  branding: {
    logo: boolean;
    colors: string[];
    fonts: string[];
  };
  technology: string[];
  aiAnalysis: string;
}

export async function crawlDomain(domain: string): Promise<CrawlerResult> {
  const normalizedDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const url = `https://${normalizedDomain}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AuraCRM/1.0; +https://auracrm.com)",
      },
    });
    
    const html = await response.text();
    
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "";
    
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const description = descMatch ? descMatch[1].trim() : "";
    
    const keywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["']/i);
    const keywords = keywordsMatch ? keywordsMatch[1].split(",").map(k => k.trim()) : [];
    
    const hasContactForm = /<form[^>]*>/i.test(html) && 
      (html.toLowerCase().includes("contact") || html.toLowerCase().includes("email"));
    
    const hasChat = html.includes("intercom") || 
      html.includes("crisp") || 
      html.includes("zendesk") ||
      html.includes("drift") ||
      html.includes("livechat");
    
    const hasSocialLinks = html.includes("facebook.com") || 
      html.includes("instagram.com") || 
      html.includes("twitter.com") ||
      html.includes("linkedin.com");
    
    const hasLogo = /<img[^>]*(logo|brand)[^>]*>/i.test(html) || 
      html.includes("logo");
    
    const technology: string[] = [];
    if (html.includes("react")) technology.push("React");
    if (html.includes("vue")) technology.push("Vue");
    if (html.includes("angular")) technology.push("Angular");
    if (html.includes("wordpress")) technology.push("WordPress");
    if (html.includes("shopify")) technology.push("Shopify");
    if (html.includes("wix")) technology.push("Wix");
    if (html.includes("squarespace")) technology.push("Squarespace");
    if (html.includes("webflow")) technology.push("Webflow");
    
    let aiAnalysis = "";
    try {
      const analysisResult = await runLLM({
        provider: "openai",
        systemPrompt: `You are a website analysis expert. Analyze the website metadata and provide insights about buyer intent, quality, and recommendations. Be concise.`,
        messages: [{
          role: "user",
          content: `Analyze this website:
Domain: ${normalizedDomain}
Title: ${title}
Description: ${description}
Has contact form: ${hasContactForm}
Has chat widget: ${hasChat}
Has social links: ${hasSocialLinks}
Technologies detected: ${technology.join(", ") || "Unknown"}

Provide a brief analysis of the website quality and buyer intent signals.`
        }]
      });
      aiAnalysis = analysisResult.reply;
    } catch (e) {
      aiAnalysis = "AI analysis unavailable";
    }
    
    return {
      html: html.substring(0, 50000),
      title,
      description,
      keywords,
      hasContactForm,
      hasChat,
      hasSocialLinks,
      branding: {
        logo: hasLogo,
        colors: [],
        fonts: []
      },
      technology,
      aiAnalysis
    };
  } catch (error: any) {
    return {
      html: "",
      title: "",
      description: "",
      keywords: [],
      hasContactForm: false,
      hasChat: false,
      hasSocialLinks: false,
      branding: { logo: false, colors: [], fonts: [] },
      technology: [],
      aiAnalysis: `Error crawling: ${error.message}`
    };
  }
}
