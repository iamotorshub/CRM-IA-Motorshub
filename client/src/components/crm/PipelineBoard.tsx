import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { MoreHorizontal, Plus, DollarSign, User, Building2, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Deal {
  id: string;
  title: string;
  value: number;
  contact: string;
  property?: string;
  daysInStage: number;
  priority: "low" | "medium" | "high";
}

interface Stage {
  id: string;
  title: string;
  color: string;
  deals: Deal[];
}

const initialStages: Stage[] = [
  {
    id: "new",
    title: "New Leads",
    color: "bg-blue-500",
    deals: [
      { id: "1", title: "Ocean View Inquiry", value: 850000, contact: "Sarah J.", property: "Ocean View Apt", daysInStage: 2, priority: "high" },
      { id: "2", title: "Downtown Condo Interest", value: 650000, contact: "Mike R.", property: "Downtown Loft", daysInStage: 5, priority: "medium" },
    ],
  },
  {
    id: "contacted",
    title: "Contacted",
    color: "bg-amber-500",
    deals: [
      { id: "3", title: "Penthouse Tour Scheduled", value: 1200000, contact: "Emily K.", property: "Skyline Penthouse", daysInStage: 3, priority: "high" },
    ],
  },
  {
    id: "viewing",
    title: "Property Viewing",
    color: "bg-purple-500",
    deals: [
      { id: "4", title: "Beach House Visit", value: 2100000, contact: "James W.", property: "Beachfront Estate", daysInStage: 1, priority: "high" },
      { id: "5", title: "Mountain Retreat Tour", value: 780000, contact: "Lisa M.", property: "Mountain Cabin", daysInStage: 4, priority: "low" },
    ],
  },
  {
    id: "negotiation",
    title: "Negotiation",
    color: "bg-orange-500",
    deals: [
      { id: "6", title: "Price Discussion", value: 1500000, contact: "David C.", property: "Garden Villa", daysInStage: 7, priority: "high" },
    ],
  },
  {
    id: "closed",
    title: "Closed Won",
    color: "bg-green-500",
    deals: [
      { id: "7", title: "Riverside Mansion", value: 3200000, contact: "Anna B.", property: "Riverside Estate", daysInStage: 0, priority: "medium" },
    ],
  },
];

const priorityColors = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
  high: "bg-red-500/20 text-red-600 dark:text-red-400",
};

function DealCard({ deal }: { deal: Deal }) {
  const formatValue = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -2 }}
      className="cursor-grab active:cursor-grabbing"
    >
      <Card className="hover-elevate" data-testid={`deal-card-${deal.id}`}>
        <CardContent className="p-3 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-sm line-clamp-2">{deal.title}</h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Edit Deal</DropdownMenuItem>
                <DropdownMenuItem>Add Note</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-3.5 w-3.5 text-green-500" />
            <span className="font-semibold">{formatValue(deal.value)}</span>
          </div>

          {deal.property && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Building2 className="h-3 w-3" />
              <span className="truncate">{deal.property}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                  {deal.contact.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{deal.contact}</span>
            </div>
            <Badge variant="secondary" className={cn("text-[10px] h-5", priorityColors[deal.priority])}>
              {deal.daysInStage}d
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function PipelineBoard() {
  const [stages, setStages] = useState(initialStages);

  const getTotalValue = (deals: Deal[]) => {
    return deals.reduce((sum, deal) => sum + deal.value, 0);
  };

  const formatValue = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-4 pb-4 min-w-max">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="w-80 shrink-0"
            data-testid={`pipeline-stage-${stage.id}`}
          >
            <Card className="bg-muted/30">
              <CardHeader className="p-3 pb-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={cn("h-2 w-2 rounded-full", stage.color)} />
                    <CardTitle className="text-sm font-medium">{stage.title}</CardTitle>
                    <Badge variant="secondary" className="h-5 text-xs">
                      {stage.deals.length}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatValue(getTotalValue(stage.deals))} total
                </p>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-2 min-h-[200px]">
                  {stage.deals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} />
                  ))}
                  {stage.deals.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                      <p className="text-xs text-muted-foreground">No deals</p>
                      <Button variant="ghost" size="sm" className="mt-2 gap-1 text-xs">
                        <Plus className="h-3 w-3" />
                        Add Deal
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
