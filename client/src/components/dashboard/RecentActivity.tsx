import { motion } from "framer-motion";
import { Building2, User, DollarSign, Calendar, MessageSquare, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "property" | "lead" | "deal" | "meeting" | "message" | "call";
  title: string;
  description: string;
  time: string;
  user?: string;
}

const activities: Activity[] = [
  { id: "1", type: "lead", title: "New lead assigned", description: "Sarah Johnson is interested in Ocean View Apt", time: "2 min ago", user: "SJ" },
  { id: "2", type: "deal", title: "Deal moved to Negotiation", description: "Garden Villa - $1.5M", time: "15 min ago", user: "DC" },
  { id: "3", type: "property", title: "Property listing updated", description: "Mountain Retreat photos added", time: "1 hour ago", user: "JW" },
  { id: "4", type: "meeting", title: "Property viewing scheduled", description: "Beachfront Estate - Tomorrow 2PM", time: "2 hours ago", user: "LM" },
  { id: "5", type: "call", title: "Missed call", description: "Michael Chen tried to reach you", time: "3 hours ago", user: "MC" },
  { id: "6", type: "message", title: "New message", description: "Emily Rodriguez sent a message about Penthouse", time: "5 hours ago", user: "ER" },
];

const typeConfig = {
  property: { icon: Building2, color: "text-blue-500 bg-blue-500/10" },
  lead: { icon: User, color: "text-green-500 bg-green-500/10" },
  deal: { icon: DollarSign, color: "text-amber-500 bg-amber-500/10" },
  meeting: { icon: Calendar, color: "text-purple-500 bg-purple-500/10" },
  message: { icon: MessageSquare, color: "text-cyan-500 bg-cyan-500/10" },
  call: { icon: Phone, color: "text-pink-500 bg-pink-500/10" },
};

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <Badge variant="secondary" className="text-xs">Live</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => {
          const config = typeConfig[activity.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 group hover-elevate rounded-lg p-2 -mx-2"
              data-testid={`activity-${activity.id}`}
            >
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", config.color)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted-foreground">{activity.time}</span>
                {activity.user && (
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                      {activity.user}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
