import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/lib/theme";
import TopNavbar from "../layout/TopNavbar";

export default function TopNavbarExample() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="w-full">
          <TopNavbar />
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
