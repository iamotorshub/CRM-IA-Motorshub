
import { motion } from "framer-motion";
import { Plus, Mail, Users, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";

const campaignStats = [
  { label: "Active Campaigns", value: 12, icon: Mail },
  { label: "Total Contacts", value: 284, icon: Users },
  { label: "Scheduled", value: 8, icon: Calendar },
  { label: "Conversion Rate", value: "24%", icon: TrendingUp },
];

export default function Campaigns() {
  const [, navigate] = useLocation();
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["/api/campaigns"],
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">Manage your outreach campaigns</p>
        </div>
        <Button className="gap-2" onClick={() => navigate("/crm/campaigns/new")}>
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {campaignStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : !campaigns || campaigns.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No campaigns yet. Create your first campaign to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign: any) => (
                <div
                  key={campaign.id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/crm/campaigns/${campaign.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{campaign.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Target: {campaign.targetSegment}
                      </p>
                    </div>
                    <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                      {campaign.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
