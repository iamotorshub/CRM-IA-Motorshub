import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Zap, Plus, Play, Pause, Trash2, Settings, 
  Loader2, Workflow, ArrowRight, Download,
  MessageSquare, Mail, Webhook, Bell, Tag, CheckSquare
} from "lucide-react";
import { SiN8N } from "react-icons/si";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogFooter, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface AutomationAction {
  id: number;
  actionType: string;
  config: Record<string, any>;
}

interface Automation {
  id: number;
  name: string;
  description: string | null;
  triggerType: string;
  isActive: boolean;
  createdAt: string;
  actions: AutomationAction[];
}

interface AutomationLog {
  id: number;
  automationId: number;
  status: string;
  message: string;
  createdAt: string;
}

const triggerLabels: Record<string, string> = {
  "contact.created": "Contact Created",
  "contact.updated": "Contact Updated",
  "contact.scored_high": "High Score Contact",
  "intent.high": "High Buyer Intent",
  "intent.medium": "Medium Buyer Intent",
  "whatsapp.received": "WhatsApp Received",
  "campaign.completed": "Campaign Completed",
  "webhook.received": "Webhook Received",
};

const actionLabels: Record<string, { label: string; icon: React.ElementType }> = {
  "send_whatsapp": { label: "Send WhatsApp", icon: MessageSquare },
  "send_email": { label: "Send Email", icon: Mail },
  "webhook": { label: "Call Webhook", icon: Webhook },
  "run_n8n": { label: "Run n8n Workflow", icon: Workflow },
  "run_make": { label: "Run Make Scenario", icon: Zap },
  "update_contact": { label: "Update Contact", icon: Settings },
  "create_task": { label: "Create Task", icon: CheckSquare },
  "add_tag": { label: "Add Tag", icon: Tag },
  "notify_team": { label: "Notify Team", icon: Bell },
};

function ActionIcon({ actionType }: { actionType: string }) {
  const Icon = actionLabels[actionType]?.icon || Zap;
  return <Icon className="h-4 w-4" />;
}

export default function Automations() {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);
  const [newAutomation, setNewAutomation] = useState({
    name: "",
    description: "",
    triggerType: "contact.created",
    actions: [] as Array<{ actionType: string; config: Record<string, any> }>,
  });
  const [aiDescription, setAiDescription] = useState("");

  const { data: automations, isLoading } = useQuery<Automation[]>({
    queryKey: ["/api/automations"],
  });

  const { data: triggers } = useQuery<Record<string, { label: string; description: string }>>({
    queryKey: ["/api/automation-triggers"],
  });

  const { data: actions } = useQuery<Record<string, { label: string; description: string }>>({
    queryKey: ["/api/automation-actions"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof newAutomation) => {
      const response = await apiRequest("POST", "/api/automations", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/automations"] });
      setIsCreateOpen(false);
      setNewAutomation({ name: "", description: "", triggerType: "contact.created", actions: [] });
      toast({ title: "Automation created" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to create automation", description: error.message, variant: "destructive" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      await apiRequest("PATCH", `/api/automations/${id}/toggle`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/automations"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/automations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/automations"] });
      toast({ title: "Automation deleted" });
    },
  });

  const testMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("POST", `/api/automations/${id}/test`, {});
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Test Complete",
        description: `Executed ${data.results.length} action(s)`,
      });
    },
    onError: (error: any) => {
      toast({ title: "Test failed", description: error.message, variant: "destructive" });
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (description: string) => {
      const response = await apiRequest("POST", "/api/automations/generate", { description });
      return response.json();
    },
    onSuccess: (data) => {
      setNewAutomation({
        name: data.name,
        description: data.description,
        triggerType: data.triggerType,
        actions: data.actions,
      });
      toast({ title: "Automation generated from description" });
    },
    onError: (error: any) => {
      toast({ title: "Generation failed", description: error.message, variant: "destructive" });
    },
  });

  const exportN8nMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("POST", `/api/automations/${id}/export/n8n`, {});
      return response.json();
    },
    onSuccess: (data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.name || "automation"}-n8n.json`;
      a.click();
      toast({ title: "n8n workflow exported" });
    },
  });

  const addAction = () => {
    setNewAutomation({
      ...newAutomation,
      actions: [...newAutomation.actions, { actionType: "notify_team", config: {} }],
    });
  };

  const removeAction = (index: number) => {
    setNewAutomation({
      ...newAutomation,
      actions: newAutomation.actions.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Automations</h1>
          <p className="text-muted-foreground">Build and manage workflow automations</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-automation">
              <Plus className="h-4 w-4 mr-2" />
              Create Automation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Automation</DialogTitle>
              <DialogDescription>
                Define triggers and actions for your automation workflow
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <Label>AI Assistant</Label>
                <Textarea
                  placeholder="Describe what you want to automate in plain language, e.g., 'When a new contact is added with high score, send them a WhatsApp welcome message and notify the sales team'"
                  value={aiDescription}
                  onChange={(e) => setAiDescription(e.target.value)}
                  data-testid="input-ai-description"
                />
                <Button
                  variant="secondary"
                  onClick={() => generateMutation.mutate(aiDescription)}
                  disabled={generateMutation.isPending || !aiDescription}
                  data-testid="button-generate-ai"
                >
                  {generateMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Generate with AI
                </Button>
              </div>

              <div className="space-y-3">
                <Label>Name</Label>
                <Input
                  placeholder="My Automation"
                  value={newAutomation.name}
                  onChange={(e) => setNewAutomation({ ...newAutomation, name: e.target.value })}
                  data-testid="input-automation-name"
                />
              </div>

              <div className="space-y-3">
                <Label>Description</Label>
                <Input
                  placeholder="What does this automation do?"
                  value={newAutomation.description}
                  onChange={(e) => setNewAutomation({ ...newAutomation, description: e.target.value })}
                  data-testid="input-automation-description"
                />
              </div>

              <div className="space-y-3">
                <Label>Trigger</Label>
                <Select
                  value={newAutomation.triggerType}
                  onValueChange={(value) => setNewAutomation({ ...newAutomation, triggerType: value })}
                >
                  <SelectTrigger data-testid="select-trigger">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(triggers || triggerLabels).map(([key, val]) => (
                      <SelectItem key={key} value={key}>
                        {typeof val === "string" ? val : val.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Actions</Label>
                  <Button size="sm" variant="outline" onClick={addAction} data-testid="button-add-action">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Action
                  </Button>
                </div>
                
                {newAutomation.actions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No actions yet. Add an action to define what happens when the trigger fires.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {newAutomation.actions.map((action, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <ActionIcon actionType={action.actionType} />
                        <Select
                          value={action.actionType}
                          onValueChange={(value) => {
                            const updated = [...newAutomation.actions];
                            updated[index] = { ...updated[index], actionType: value };
                            setNewAutomation({ ...newAutomation, actions: updated });
                          }}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(actions || actionLabels).map(([key, val]) => (
                              <SelectItem key={key} value={key}>
                                {typeof val === "string" ? val : val.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeAction(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => createMutation.mutate(newAutomation)}
                disabled={createMutation.isPending || !newAutomation.name}
                data-testid="button-save-automation"
              >
                {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Create Automation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">All Automations</TabsTrigger>
          <TabsTrigger value="active" data-testid="tab-active">Active</TabsTrigger>
          <TabsTrigger value="integrations" data-testid="tab-integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !automations?.length ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Zap className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Automations Yet</h3>
                <p className="text-muted-foreground text-center max-w-md mb-4">
                  Create your first automation to streamline your workflow and save time on repetitive tasks.
                </p>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Automation
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {automations.map((automation) => (
                <motion.div
                  key={automation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="h-full flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-base">{automation.name}</CardTitle>
                          {automation.description && (
                            <CardDescription className="text-xs mt-1">
                              {automation.description}
                            </CardDescription>
                          )}
                        </div>
                        <Switch
                          checked={automation.isActive}
                          onCheckedChange={(checked) => 
                            toggleMutation.mutate({ id: automation.id, isActive: checked })
                          }
                          data-testid={`switch-automation-${automation.id}`}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 pb-3">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline">
                            {triggerLabels[automation.triggerType] || automation.triggerType}
                          </Badge>
                        </div>
                        
                        {automation.actions.length > 0 && (
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <div className="flex flex-wrap gap-1">
                              {automation.actions.map((action, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {actionLabels[action.actionType]?.label || action.actionType}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => testMutation.mutate(automation.id)}
                        disabled={testMutation.isPending}
                        data-testid={`button-test-${automation.id}`}
                      >
                        {testMutation.isPending ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => exportN8nMutation.mutate(automation.id)}
                        data-testid={`button-export-${automation.id}`}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="ml-auto"
                        onClick={() => deleteMutation.mutate(automation.id)}
                        data-testid={`button-delete-${automation.id}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          {automations?.filter(a => a.isActive).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Pause className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Automations</h3>
                <p className="text-muted-foreground">
                  Toggle on some automations to see them here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {automations?.filter(a => a.isActive).map((automation) => (
                <Card key={automation.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{automation.name}</CardTitle>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {automation.actions.length} action(s) configured
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SiN8N className="h-5 w-5" />
                  n8n Integration
                </CardTitle>
                <CardDescription>
                  Connect to your n8n instance for advanced workflow automation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>n8n Base URL</Label>
                  <Input placeholder="https://your-n8n.example.com" disabled />
                </div>
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input type="password" placeholder="Configure in environment" disabled />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" disabled>
                  Connect n8n
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Make (Integromat)
                </CardTitle>
                <CardDescription>
                  Connect to Make for visual automation workflows
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input type="password" placeholder="Configure in environment" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Team ID</Label>
                  <Input placeholder="Your Make team ID" disabled />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" disabled>
                  Connect Make
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
