import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/lib/theme";
import AppSidebar from "@/components/layout/AppSidebar";
import TopNavbar from "@/components/layout/TopNavbar";
import NotFound from "./pages/not-found";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import Contacts from "./pages/Contacts";
import Pipelines from "./pages/Pipelines";
import Campaigns from "./pages/Campaigns";
import CampaignEditor from "./pages/CampaignEditor";
import AIAgents from "./pages/AIAgents";
import AISettings from "./pages/AISettings";
import Settings from "./pages/Settings";
import BuyerIntent from "./pages/BuyerIntent";
import Automations from "./pages/Automations";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/properties" component={Properties} />
      <Route path="/crm/contacts" component={Contacts} />
      <Route path="/crm/leads" component={Contacts} />
      <Route path="/crm/pipelines" component={Pipelines} />
      <Route path="/campaigns" component={Campaigns} />
      <Route path="/campaigns/:id" component={CampaignEditor} />
      <Route path="/ai-agents" component={AIAgents} />
      <Route path="/ai/settings" component={AISettings} />
      <Route path="/buyer-intent" component={BuyerIntent} />
      <Route path="/automations" component={Automations} />
      <Route path="/automations/:type" component={Automations} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <SidebarInset className="flex flex-col flex-1 overflow-hidden">
                <TopNavbar />
                <main className="flex-1 overflow-auto p-6">
                  <Router />
                </main>
              </SidebarInset>
            </div>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
