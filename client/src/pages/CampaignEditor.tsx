
import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Trash2, Sparkles, Save, ArrowLeft } from "lucide-react";

export default function CampaignEditor() {
  const params = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isNew = params.id === "new";
  const campaignId = isNew ? null : parseInt(params.id!);

  const [name, setName] = useState("");
  const [targetSegment, setTargetSegment] = useState("all");
  const [status, setStatus] = useState("draft");
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [steps, setSteps] = useState<any[]>([]);

  const { data: campaign, isLoading } = useQuery({
    queryKey: ["/api/campaigns", campaignId],
    enabled: !isNew && !!campaignId,
  });

  useState(() => {
    if (campaign) {
      setName(campaign.name || "");
      setTargetSegment(campaign.targetSegment || "all");
      setStatus(campaign.status || "draft");
      setSteps(campaign.steps || []);
    }
  });

  const saveCampaignMutation = useMutation({
    mutationFn: async () => {
      if (isNew) {
        const created = await apiRequest("POST", "/api/campaigns", {
          name,
          targetSegment,
          status,
        });
        return await created.json();
      } else {
        await apiRequest("PUT", `/api/campaigns/${campaignId}`, {
          name,
          targetSegment,
          status,
        });
        return campaign;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({
        title: "Campaign saved",
        description: "Your campaign has been saved successfully",
      });
      if (isNew) {
        navigate(`/crm/campaigns/${data.id}`);
      }
    },
  });

  const addStepMutation = useMutation({
    mutationFn: async (stepData: any) => {
      const res = await apiRequest("POST", `/api/campaigns/${campaignId}/steps`, stepData);
      return await res.json();
    },
    onSuccess: (newStep) => {
      setSteps([...steps, newStep]);
      toast({ title: "Step added" });
    },
  });

  const updateStepMutation = useMutation({
    mutationFn: async ({ stepId, data }: any) => {
      const res = await apiRequest("PUT", `/api/campaigns/${campaignId}/steps/${stepId}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns", campaignId] });
      toast({ title: "Step updated" });
    },
  });

  const deleteStepMutation = useMutation({
    mutationFn: async (stepId: number) => {
      await apiRequest("DELETE", `/api/campaigns/${campaignId}/steps/${stepId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns", campaignId] });
      toast({ title: "Step deleted" });
    },
  });

  const selectedStep = steps.find((s) => s.id === selectedStepId);

  if (isLoading && !isNew) {
    return <Skeleton className="h-screen w-full" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/crm/campaigns")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{isNew ? "New Campaign" : "Edit Campaign"}</h1>
        </div>
        <Button onClick={() => saveCampaignMutation.mutate()} className="gap-2">
          <Save className="h-4 w-4" />
          Save Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Campaign Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label>Target Segment</Label>
                <Select value={targetSegment} onValueChange={setTargetSegment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Contacts</SelectItem>
                    <SelectItem value="hot">Hot Leads</SelectItem>
                    <SelectItem value="warm">Warm Leads</SelectItem>
                    <SelectItem value="cold">Cold Leads</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Campaign Steps</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (!campaignId) {
                    toast({
                      title: "Save campaign first",
                      description: "Please save the campaign before adding steps",
                      variant: "destructive",
                    });
                    return;
                  }
                  addStepMutation.mutate({
                    order: steps.length + 1,
                    subject: "New step",
                    body: "",
                    delayDays: 0,
                  });
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {steps.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No steps yet. Add your first step.
                </p>
              ) : (
                <div className="space-y-2">
                  {steps.map((step, idx) => (
                    <div
                      key={step.id}
                      className={`p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors ${
                        selectedStepId === step.id ? "bg-accent" : ""
                      }`}
                      onClick={() => setSelectedStepId(step.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge variant="outline" className="mb-1">
                            Step {idx + 1}
                          </Badge>
                          <p className="text-sm font-medium">{step.subject}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {selectedStep ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Step Editor</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      toast({
                        title: "AI Generation",
                        description: "AI content generation coming soon!",
                      });
                    }}
                  >
                    <Sparkles className="h-4 w-4" />
                    Generate
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      deleteStepMutation.mutate(selectedStep.id);
                      setSelectedStepId(null);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Subject</Label>
                  <Input
                    value={selectedStep.subject || ""}
                    onChange={(e) => {
                      const updated = steps.map((s) =>
                        s.id === selectedStep.id ? { ...s, subject: e.target.value } : s
                      );
                      setSteps(updated);
                    }}
                    onBlur={() => {
                      updateStepMutation.mutate({
                        stepId: selectedStep.id,
                        data: { subject: selectedStep.subject },
                      });
                    }}
                  />
                </div>
                <div>
                  <Label>Email Body</Label>
                  <Textarea
                    rows={12}
                    value={selectedStep.body || ""}
                    onChange={(e) => {
                      const updated = steps.map((s) =>
                        s.id === selectedStep.id ? { ...s, body: e.target.value } : s
                      );
                      setSteps(updated);
                    }}
                    onBlur={() => {
                      updateStepMutation.mutate({
                        stepId: selectedStep.id,
                        data: { body: selectedStep.body },
                      });
                    }}
                  />
                </div>
                <div>
                  <Label>Delay (days)</Label>
                  <Input
                    type="number"
                    value={selectedStep.delayDays || 0}
                    onChange={(e) => {
                      const updated = steps.map((s) =>
                        s.id === selectedStep.id
                          ? { ...s, delayDays: parseInt(e.target.value) }
                          : s
                      );
                      setSteps(updated);
                    }}
                    onBlur={() => {
                      updateStepMutation.mutate({
                        stepId: selectedStep.id,
                        data: { delayDays: selectedStep.delayDays },
                      });
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12">
                <p className="text-muted-foreground text-center">
                  Select a step from the left to edit it
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
