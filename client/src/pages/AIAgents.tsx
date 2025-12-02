import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Bot, Sparkles, MessageSquare, FileText, Zap, Settings, Play, Pause, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AIGenerateButton from "@/components/common/AIGenerateButton";
import { cn } from "@/lib/utils";

interface AIAgent {
  id: string;
  name: string;
  description: string;
  provider: "openai" | "gemini" | "claude";
  type: "chat" | "content" | "analysis" | "automation";
  active: boolean;
  usage: number;
}

const agents: AIAgent[] = [
  { id: "1", name: "Property Describer", description: "Generates compelling property descriptions from features", provider: "openai", type: "content", active: true, usage: 847 },
  { id: "2", name: "Lead Analyzer", description: "Scores and categorizes incoming leads automatically", provider: "claude", type: "analysis", active: true, usage: 432 },
  { id: "3", name: "Website Chat", description: "Handles visitor inquiries on property listings", provider: "gemini", type: "chat", active: false, usage: 1256 },
  { id: "4", name: "Content Planner", description: "Creates social media content calendars", provider: "openai", type: "content", active: true, usage: 89 },
  { id: "5", name: "Email Responder", description: "Drafts professional email responses", provider: "claude", type: "automation", active: false, usage: 234 },
];

const providerColors = {
  openai: "bg-green-500/10 text-green-600 dark:text-green-400",
  gemini: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  claude: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

const typeIcons = {
  chat: MessageSquare,
  content: FileText,
  analysis: Sparkles,
  automation: Zap,
};

export default function AIAgents() {
  const [agentList, setAgentList] = useState(agents);

  const toggleAgent = (id: string) => {
    setAgentList((prev) =>
      prev.map((agent) =>
        agent.id === id ? { ...agent, active: !agent.active } : agent
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">AI Agents</h1>
          <p className="text-muted-foreground">Configure and manage your AI assistants</p>
        </div>
        <Button className="gap-2" data-testid="button-create-agent">
          <Plus className="h-4 w-4" />
          Create Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-indigo-500/10 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total AI Calls</p>
                <p className="text-2xl font-bold">2,858</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Agents</p>
                <p className="text-2xl font-bold">{agentList.filter((a) => a.active).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Automations</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agentList.map((agent, index) => {
          const TypeIcon = typeIcons[agent.type];
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={cn("hover-elevate", !agent.active && "opacity-60")} data-testid={`agent-card-${agent.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-lg">
                        <AvatarFallback className="rounded-lg bg-primary/10">
                          <TypeIcon className="h-5 w-5 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{agent.name}</CardTitle>
                        <Badge variant="secondary" className={cn("text-xs mt-1", providerColors[agent.provider])}>
                          {agent.provider.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={agent.active}
                        onCheckedChange={() => toggleAgent(agent.id)}
                        data-testid={`toggle-agent-${agent.id}`}
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Settings className="h-4 w-4 mr-2" />
                            Configure
                          </DropdownMenuItem>
                          <DropdownMenuItem>View Logs</DropdownMenuItem>
                          <DropdownMenuItem>Test Agent</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardDescription className="line-clamp-2">{agent.description}</CardDescription>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-xs text-muted-foreground">{agent.usage} calls</span>
                    <Button variant="ghost" size="sm" className="gap-1 h-7">
                      {agent.active ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                      {agent.active ? "Pause" : "Start"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Bot className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium">Create a Custom Agent</h3>
          <p className="text-muted-foreground text-center max-w-md mt-1">
            Build AI agents with custom prompts, tools, and permissions for your specific workflows
          </p>
          <AIGenerateButton
            label="Create with AI"
            className="mt-4"
            onClick={() => console.log("Create agent with AI")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
