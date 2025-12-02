import { ThemeProvider } from "@/lib/theme";
import QuickActions from "../dashboard/QuickActions";

export default function QuickActionsExample() {
  return (
    <ThemeProvider>
      <div className="w-full max-w-md">
        <QuickActions />
      </div>
    </ThemeProvider>
  );
}
