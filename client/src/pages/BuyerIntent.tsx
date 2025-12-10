import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Globe, Search, Target, TrendingUp, AlertCircle, 
  Loader2, Trash2, ExternalLink, BarChart3, Zap,
  Instagram, Building2, ShoppingBag
} from "lucide-react";
import { SiFacebook } from "react-icons/si";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface Scan {
  id: number;
  domain: string;
  score: number;
  insights: string;
  createdAt: string;
}

interface Signal {
  id: number;
  domain: string;
  source: string;
  data: Record<string, any>;
  score: number;
}

interface ScanResult {
  scan: Scan;
  crawlerResult: {
    title: string;
    description: string;
    hasContactForm: boolean;
    hasChat: boolean;
    hasSocialLinks: boolean;
    technology: string[];
    aiAnalysis: string;
  };
  signals: Signal[];
  scoring: {
    totalScore: number;
    breakdown: Array<{ category: string; score: number; maxScore: number; details: string }>;
    intent: "high" | "medium" | "low";
    recommendation: string;
  };
  insights: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    recommendedApproach: string;
    talkingPoints: string[];
    estimatedValue: string;
  };
}

function getIntentColor(intent: string) {
  switch (intent) {
    case "high": return "bg-green-500";
    case "medium": return "bg-yellow-500";
    case "low": return "bg-red-500";
    default: return "bg-muted";
  }
}

function getIntentBadgeVariant(intent: string) {
  switch (intent) {
    case "high": return "default";
    case "medium": return "secondary";
    case "low": return "outline";
    default: return "outline";
  }
}

function SignalIcon({ source }: { source: string }) {
  switch (source) {
    case "facebook_ads": return <SiFacebook className="h-4 w-4" />;
    case "instagram": return <Instagram className="h-4 w-4" />;
    case "google_business": return <Building2 className="h-4 w-4" />;
    case "listings": return <ShoppingBag className="h-4 w-4" />;
    default: return <Globe className="h-4 w-4" />;
  }
}

export default function BuyerIntent() {
  const { toast } = useToast();
  const [domain, setDomain] = useState("");
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);

  const { data: scans, isLoading: scansLoading } = useQuery<Scan[]>({
    queryKey: ["/api/buyer-intent/scans"],
  });

  const scanMutation = useMutation({
    mutationFn: async (domain: string) => {
      const response = await apiRequest("POST", "/api/buyer-intent/scan", { domain });
      return response.json();
    },
    onSuccess: (data: ScanResult) => {
      queryClient.invalidateQueries({ queryKey: ["/api/buyer-intent/scans"] });
      setSelectedScan(data);
      toast({
        title: "Scan Complete",
        description: `Analyzed ${data.scan.domain} - Score: ${data.scoring.totalScore}/100`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Scan Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/buyer-intent/scans/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/buyer-intent/scans"] });
      toast({ title: "Scan deleted" });
    },
  });

  const handleScan = () => {
    if (!domain.trim()) {
      toast({ title: "Please enter a domain", variant: "destructive" });
      return;
    }
    scanMutation.mutate(domain.trim());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Buyer Intent Scanner</h1>
          <p className="text-muted-foreground">Analyze websites to identify high-intent prospects</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Scan Domain
          </CardTitle>
          <CardDescription>
            Enter a website domain to analyze its digital presence and buyer intent signals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
              className="flex-1"
              data-testid="input-domain"
            />
            <Button 
              onClick={handleScan} 
              disabled={scanMutation.isPending}
              data-testid="button-scan"
            >
              {scanMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Target className="h-4 w-4 mr-2" />
              )}
              Analyze
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedScan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    {selectedScan.scan.domain}
                  </CardTitle>
                  <CardDescription>{selectedScan.crawlerResult.title}</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={getIntentBadgeVariant(selectedScan.scoring.intent)}>
                    {selectedScan.scoring.intent.toUpperCase()} INTENT
                  </Badge>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{selectedScan.scoring.totalScore}</div>
                    <div className="text-xs text-muted-foreground">/ 100</div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                  <TabsTrigger value="signals" data-testid="tab-signals">Signals</TabsTrigger>
                  <TabsTrigger value="insights" data-testid="tab-insights">AI Insights</TabsTrigger>
                </TabsList>

                {/* ------------------ OVERVIEW ------------------ */}

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Score Breakdown</h3>
                      {selectedScan.scoring.breakdown.map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{item.category}</span>
                            <span className="text-muted-foreground">{item.score}/{item.maxScore}</span>
                          </div>
                          <Progress value={(item.score / item.maxScore) * 100} />
                          <p className="text-xs text-muted-foreground">{item.details}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Website Analysis</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <div className={`h-2 w-2 rounded-full ${selectedScan.crawlerResult.hasContactForm ? "bg-green-500" : "bg-red-500"}`} />
                          Contact Form
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className={`h-2 w-2 rounded-full ${selectedScan.crawlerResult.hasChat ? "bg-green-500" : "bg-red-500"}`} />
                          Chat Widget
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className={`h-2 w-2 rounded-full ${selectedScan.crawlerResult.hasSocialLinks ? "bg-green-500" : "bg-red-500"}`} />
                          Social Links
                        </div>
                      </div>

                      {selectedScan.crawlerResult.technology.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Technologies</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedScan.crawlerResult.technology.map((tech, i) => (
                              <Badge key={i} variant="outline">{tech}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Recommendation
                    </h3>
                    <p className="text-sm text-muted-foreground">{selectedScan.scoring.recommendation}</p>
                  </div>
                </TabsContent>

                {/* ------------------ SIGNALS ------------------ */}

                <TabsContent value="signals" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedScan.signals.map((signal, i) => (
                      <Card key={i}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <SignalIcon source={signal.source} />
                            {signal.source.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                            <Badge variant="outline" className="ml-auto">{signal.score} pts</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-1 text-sm">
                            {Object.entries(signal.data).slice(0, 5).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-muted-foreground">{key.replace(/_/g, " ")}</span>
                                <span>{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* ------------------ AI INSIGHTS ------------------ */}

                <TabsContent value="insights" className="space-y-6">

                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <h3 className="font-semibold mb-2">Summary</h3>
                    <p className="text-sm">
                      {selectedScan?.insights?.summary || "No summary available."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* ---------- Strengths ---------- */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-green-600">Strengths</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          {Array.isArray(selectedScan?.insights?.strengths) &&
                          selectedScan.insights.strengths.length > 0 ? (
                            selectedScan.insights.strengths.map((s, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">+</span> {s}
                              </li>
                            ))
                          ) : (
                            <li className="text-muted-foreground text-sm">
                              No strengths detected.
                            </li>
                          )}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* ---------- Weaknesses ---------- */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-red-600">Weaknesses</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          {Array.isArray(selectedScan?.insights?.weaknesses) &&
                          selectedScan.insights.weaknesses.length > 0 ? (
                            selectedScan.insights.weaknesses.map((w, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">-</span> {w}
                              </li>
                            ))
                          ) : (
                            <li className="text-muted-foreground text-sm">
                              No weaknesses found.
                            </li>
                          )}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* ---------- Opportunities ---------- */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-blue-600">Opportunities</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          {Array.isArray(selectedScan?.insights?.opportunities) &&
                          selectedScan.insights.opportunities.length > 0 ? (
                            selectedScan.insights.opportunities.map((o, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">*</span> {o}
                              </li>
                            ))
                          ) : (
                            <li className="text-muted-foreground text-sm">
                              No opportunities identified.
                            </li>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recommended Approach + Estimated Value */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Recommended Approach</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {selectedScan?.insights?.recommendedApproach ||
                           "No recommended approach available."}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Estimated Value</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-primary">
                          {selectedScan?.insights?.estimatedValue || "$0"}
                        </p>
                        <p className="text-xs text-muted-foreground">Monthly recurring revenue potential</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* ---------- Talking Points ---------- */}

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Talking Points</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-2">
                        {Array.isArray(selectedScan?.insights?.talkingPoints) &&
                        selectedScan.insights.talkingPoints.length > 0 ? (
                          selectedScan.insights.talkingPoints.map((point, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs shrink-0">
                                {i + 1}
                              </span>
                              {point}
                            </li>
                          ))
                        ) : (
                          <li className="text-muted-foreground text-sm">
                            No talking points available.
                          </li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>

                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ------------------ RECENT SCANS ------------------ */}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Recent Scans
          </CardTitle>
        </CardHeader>
        <CardContent>
          {scansLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !scans?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No scans yet. Enter a domain above to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scans.map((scan) => {
                const intent = scan.score >= 70 ? "high" : scan.score >= 40 ? "medium" : "low";
                return (
                  <div
                    key={scan.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover-elevate cursor-pointer"
                    onClick={() => setDomain(scan.domain)}
                    data-testid={`scan-row-${scan.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${getIntentColor(intent)}`} />
                      <div>
                        <p className="font-medium">{scan.domain}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(scan.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={getIntentBadgeVariant(intent)}>{scan.score}/100</Badge>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMutation.mutate(scan.id);
                        }}
                        data-testid={`button-delete-scan-${scan.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}