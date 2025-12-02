import { ThemeProvider } from "@/lib/theme";
import RecentActivity from "../dashboard/RecentActivity";

export default function RecentActivityExample() {
  return (
    <ThemeProvider>
      <div className="w-full max-w-md">
        <RecentActivity />
      </div>
    </ThemeProvider>
  );
}
