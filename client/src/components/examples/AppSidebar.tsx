import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/lib/theme";
import AppSidebar from "../layout/AppSidebar";

export default function AppSidebarExample() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>
    </ThemeProvider>
  );
}
