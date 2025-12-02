import { motion } from "framer-motion";
import { Plus, Upload, Download, Users } from "lucide-react";
import ContactsList from "@/components/crm/ContactsList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const contactStats = [
  { label: "Total Contacts", value: 284, icon: Users },
  { label: "Hot Leads", value: 42, color: "text-red-500" },
  { label: "Warm Leads", value: 89, color: "text-amber-500" },
  { label: "Cold Leads", value: 153, color: "text-blue-500" },
];

export default function Contacts() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Contacts</h1>
          <p className="text-muted-foreground">Manage your leads and contacts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" data-testid="button-import-contacts">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" className="gap-2" data-testid="button-export-contacts">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2" data-testid="button-add-contact">
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {contactStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.color || ""}`}>{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <ContactsList />
    </div>
  );
}
