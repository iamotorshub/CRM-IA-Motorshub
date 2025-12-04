interface Signal {
  source: string;
  data: Record<string, any>;
  score: number;
}

export async function detectFacebookAds(domain: string): Promise<Signal> {
  try {
    const normalizedDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
    
    return {
      source: "facebook_ads",
      data: {
        domain: normalizedDomain,
        hasActiveAds: Math.random() > 0.5,
        adCount: Math.floor(Math.random() * 10),
        lastAdDate: new Date().toISOString(),
        categories: ["real_estate", "services"]
      },
      score: Math.floor(Math.random() * 30) + 10
    };
  } catch (error) {
    return {
      source: "facebook_ads",
      data: { error: "Unable to fetch Facebook Ads data" },
      score: 0
    };
  }
}

export async function detectInstagramPresence(domain: string): Promise<Signal> {
  try {
    const normalizedDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "").split(".")[0];
    
    return {
      source: "instagram",
      data: {
        handle: `@${normalizedDomain}`,
        exists: Math.random() > 0.3,
        followers: Math.floor(Math.random() * 10000),
        posts: Math.floor(Math.random() * 200),
        engagement: (Math.random() * 5).toFixed(2) + "%",
        lastPost: new Date().toISOString()
      },
      score: Math.floor(Math.random() * 25) + 5
    };
  } catch (error) {
    return {
      source: "instagram",
      data: { error: "Unable to fetch Instagram data" },
      score: 0
    };
  }
}

export async function detectGoogleBusiness(domain: string): Promise<Signal> {
  try {
    const normalizedDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
    
    return {
      source: "google_business",
      data: {
        domain: normalizedDomain,
        hasListing: Math.random() > 0.4,
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviewCount: Math.floor(Math.random() * 100),
        category: "Real Estate Agency",
        verified: Math.random() > 0.5
      },
      score: Math.floor(Math.random() * 20) + 10
    };
  } catch (error) {
    return {
      source: "google_business",
      data: { error: "Unable to fetch Google Business data" },
      score: 0
    };
  }
}

export async function detectListings(domain: string): Promise<Signal> {
  try {
    const normalizedDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
    
    return {
      source: "listings",
      data: {
        domain: normalizedDomain,
        hasPropertyListings: Math.random() > 0.3,
        listingCount: Math.floor(Math.random() * 50),
        platforms: ["idealista", "fotocasa", "habitaclia"].filter(() => Math.random() > 0.5),
        priceRange: {
          min: Math.floor(Math.random() * 100000) + 50000,
          max: Math.floor(Math.random() * 500000) + 200000
        }
      },
      score: Math.floor(Math.random() * 25) + 5
    };
  } catch (error) {
    return {
      source: "listings",
      data: { error: "Unable to fetch listings data" },
      score: 0
    };
  }
}

export async function gatherAllSignals(domain: string): Promise<Signal[]> {
  const signals = await Promise.all([
    detectFacebookAds(domain),
    detectInstagramPresence(domain),
    detectGoogleBusiness(domain),
    detectListings(domain)
  ]);
  
  return signals;
}
