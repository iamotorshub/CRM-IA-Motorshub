import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  Users,
  Bot,
  CalendarDays,
  Globe,
  BarChart3,
  Settings,
  ChevronDown,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/" },
  {
    title: "CRM",
    icon: Users,
    children: [
      { title: "Contacts", href: "/crm/contacts" },
      { title: "Leads", href: "/crm/leads" },
      { title: "Pipelines", href: "/crm/pipelines" },
    ],
  },
  {
    title: "Real Estate",
    icon: Building2,
    children: [
      { title: "Properties", href: "/properties" },
      { title: "Listings", href: "/properties/listings" },
      { title: "Web Portal", href: "/properties/portal" },
    ],
  },
  { title: "Campaigns", icon: CalendarDays, href: "/campaigns" },
  { title: "Buyer Intent", icon: Globe, href: "/buyer-intent" },
  { title: "Automations", icon: Zap, href: "/automations" },
  { title: "AI Agents", icon: Bot, href: "/ai-agents" },
  { title: "Reports", icon: BarChart3, href: "/reports" },
];

function NavMenuItem({ item }: { item: NavItem }) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const isActive = item.href
    ? location === item.href
    : item.children?.some((child) => location === child.href);

  if (item.children) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              className={cn(
                "w-full justify-between",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
              data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <span className="flex items-center gap-3">
                <item.icon className="h-4 w-4" />
                {!isCollapsed && <span>{item.title}</span>}
              </span>
              {!isCollapsed && (
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              )}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children.map((child) => (
                <SidebarMenuSubItem key={child.href}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={location === child.href}
                  >
                    <Link href={child.href} data-testid={`nav-${child.title.toLowerCase().replace(/\s+/g, "-")}`}>
                      {child.title}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <Link href={item.href!}>
          <item.icon className="h-4 w-4" />
          {!isCollapsed && <span>{item.title}</span>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export default function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <h1 className="text-lg font-semibold whitespace-nowrap">Luxe CRM</h1>
                <p className="text-xs text-muted-foreground whitespace-nowrap">Premium Real Estate</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <NavMenuItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild data-testid="nav-settings">
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                {!isCollapsed && <span>Settings</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {!isCollapsed && (
          <div className="flex items-center gap-3 px-2 py-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">john@luxecrm.com</p>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
