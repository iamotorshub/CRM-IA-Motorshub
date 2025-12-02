import { motion } from "framer-motion";
import { Plus, Building2, User, Zap, FileText, Upload, Calendar, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  onClick?: () => void;
}

const quickActions: QuickAction[] = [
  { id: "property", label: "New Property", icon: Building2, color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20" },
  { id: "contact", label: "Add Contact", icon: User, color: "bg-green-500/10 text-green-500 hover:bg-green-500/20" },
  { id: "automation", label: "Create Flow", icon: Zap, color: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" },
  { id: "quote", label: "New Quote", icon: FileText, color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20" },
  { id: "upload", label: "Upload Media", icon: Upload, color: "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20" },
  { id: "meeting", label: "Schedule", icon: Calendar, color: "bg-pink-500/10 text-pink-500 hover:bg-pink-500/20" },
  { id: "ai", label: "AI Agent", icon: Bot, color: "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20" },
  { id: "more", label: "More", icon: Plus, color: "bg-muted text-muted-foreground hover:bg-muted/80" },
];

export default function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
            >
              <Button
                variant="ghost"
                className={cn(
                  "flex flex-col items-center justify-center gap-2 h-auto py-4 w-full rounded-xl",
                  action.color
                )}
                onClick={action.onClick}
                data-testid={`quick-action-${action.id}`}
              >
                <action.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
