interface CrawlerResult {
  hasContactForm: boolean;
  hasChat: boolean;
  hasSocialLinks: boolean;
  branding: {
    logo: boolean;
  };
  technology: string[];
}

interface Signal {
  source: string;
  score: number;
  data: Record<string, any>;
}

interface ScoringResult {
  totalScore: number;
  breakdown: {
    category: string;
    score: number;
    maxScore: number;
    details: string;
  }[];
  intent: "high" | "medium" | "low";
  recommendation: string;
}

export function calculateIntentScore(
  crawlerResult: CrawlerResult,
  signals: Signal[]
): ScoringResult {
  const breakdown: ScoringResult["breakdown"] = [];
  
  let websiteScore = 0;
  if (crawlerResult.hasContactForm) websiteScore += 10;
  if (crawlerResult.hasChat) websiteScore += 15;
  if (crawlerResult.hasSocialLinks) websiteScore += 5;
  if (crawlerResult.branding.logo) websiteScore += 5;
  if (crawlerResult.technology.length > 0) websiteScore += 5;
  
  breakdown.push({
    category: "Website Quality",
    score: websiteScore,
    maxScore: 40,
    details: `Contact form: ${crawlerResult.hasContactForm}, Chat: ${crawlerResult.hasChat}, Social: ${crawlerResult.hasSocialLinks}`
  });
  
  let signalsScore = 0;
  for (const signal of signals) {
    signalsScore += signal.score;
  }
  signalsScore = Math.min(signalsScore, 60);
  
  breakdown.push({
    category: "Digital Presence",
    score: signalsScore,
    maxScore: 60,
    details: `${signals.length} signals detected across platforms`
  });
  
  const totalScore = Math.min(websiteScore + signalsScore, 100);
  
  let intent: "high" | "medium" | "low";
  let recommendation: string;
  
  if (totalScore >= 70) {
    intent = "high";
    recommendation = "High-priority prospect. Strong digital presence indicates active marketing investment. Recommend immediate outreach with premium web + AI agent offer.";
  } else if (totalScore >= 40) {
    intent = "medium";
    recommendation = "Medium-priority prospect. Some digital presence but room for improvement. Position as growth partner with focus on lead generation.";
  } else {
    intent = "low";
    recommendation = "Lower priority but potential for transformation. May need education on digital marketing benefits before pitching premium services.";
  }
  
  return {
    totalScore,
    breakdown,
    intent,
    recommendation
  };
}
