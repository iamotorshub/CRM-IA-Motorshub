import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Circle, ChevronRight, X, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  action: string;
}

const initialItems: ChecklistItem[] = [
  {
    id: "1",
    title: "Create your first property",
    description: "Add a property listing to get started",
    completed: true,
    action: "View Property",
  },
  {
    id: "2",
    title: "Connect n8n automation",
    description: "Set up your automation workflows",
    completed: false,
    action: "Connect n8n",
  },
  {
    id: "3",
    title: "Import your contacts",
    description: "Bring in your existing leads and contacts",
    completed: false,
    action: "Import Contacts",
  },
  {
    id: "4",
    title: "Generate AI description",
    description: "Use AI to create property descriptions",
    completed: false,
    action: "Try AI",
  },
];

export default function OnboardingChecklist() {
  const [items, setItems] = useState(initialItems);
  const [dismissed, setDismissed] = useState(false);
  
  const completedCount = items.filter((item) => item.completed).length;
  const progress = (completedCount / items.length) * 100;

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              Getting Started
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Complete these steps to set up your workspace
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDismissed(true)}
            className="shrink-0"
            data-testid="button-dismiss-checklist"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {completedCount} of {items.length} completed
              </span>
              <span className="font-medium text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-2">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                className={cn(
                  "flex items-center gap-3 rounded-lg p-3 transition-colors",
                  item.completed
                    ? "bg-muted/50"
                    : "bg-background hover-elevate cursor-pointer"
                )}
                onClick={() => !item.completed && toggleItem(item.id)}
                data-testid={`checklist-item-${item.id}`}
              >
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    item.completed
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30"
                  )}
                >
                  <AnimatePresence mode="wait">
                    {item.completed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Check className="h-3 w-3" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      item.completed && "text-muted-foreground line-through"
                    )}
                  >
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.description}
                  </p>
                </div>
                {!item.completed && (
                  <Button variant="ghost" size="sm" className="shrink-0 gap-1">
                    {item.action}
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
