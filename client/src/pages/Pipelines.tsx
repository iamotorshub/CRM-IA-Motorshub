import { motion } from "framer-motion";
import { Plus, Filter, MoreHorizontal, DollarSign } from "lucide-react";
import PipelineBoard from "@/components/crm/PipelineBoard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const pipelineStats = [
  { label: "Total Value", value: "$8.2M", change: "+15%" },
  { label: "Open Deals", value: "23", change: "+3" },
  { label: "Won This Month", value: "$1.4M", change: "+28%" },
  { label: "Avg Deal Size", value: "$356K", change: "+5%" },
];

export default function Pipelines() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Sales Pipeline</h1>
          <p className="text-muted-foreground">Track and manage your deals</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" data-testid="button-filter-pipeline">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export Pipeline</DropdownMenuItem>
              <DropdownMenuItem>Pipeline Settings</DropdownMenuItem>
              <DropdownMenuItem>Manage Stages</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="gap-2" data-testid="button-new-deal">
            <Plus className="h-4 w-4" />
            New Deal
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {pipelineStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <Badge variant="secondary" className="text-green-600 dark:text-green-400 bg-green-500/10">
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Deal Pipeline
            </CardTitle>
            <Badge variant="outline">Updated just now</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <PipelineBoard />
        </CardContent>
      </Card>
    </div>
  );
}
