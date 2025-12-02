import { ThemeProvider } from "@/lib/theme";
import { Building2 } from "lucide-react";
import KPICard from "../dashboard/KPICard";

export default function KPICardExample() {
  return (
    <ThemeProvider>
      <div className="w-80">
        <KPICard
          title="Active Properties"
          value={47}
          change={12}
          trend="up"
          icon={<Building2 className="h-6 w-6" />}
        />
      </div>
    </ThemeProvider>
  );
}
