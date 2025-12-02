import { motion } from "framer-motion";
import { Building2, Users, DollarSign, TrendingUp, Zap, CalendarDays } from "lucide-react";
import HeroCarousel from "@/components/dashboard/HeroCarousel";
import KPICard from "@/components/dashboard/KPICard";
import OnboardingChecklist from "@/components/dashboard/OnboardingChecklist";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import PropertyCard, { Property } from "@/components/properties/PropertyCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const kpis = [
  { title: "Active Properties", value: 47, change: 12, trend: "up" as const, icon: <Building2 className="h-6 w-6" /> },
  { title: "Total Leads", value: 284, change: 23, trend: "up" as const, icon: <Users className="h-6 w-6" /> },
  { title: "Deals in Pipeline", value: "$4.2M", change: 8, trend: "up" as const, icon: <DollarSign className="h-6 w-6" /> },
  { title: "Closed This Month", value: 12, change: -3, trend: "down" as const, icon: <TrendingUp className="h-6 w-6" /> },
  { title: "Active Automations", value: 18, change: 5, trend: "up" as const, icon: <Zap className="h-6 w-6" /> },
  { title: "Scheduled Viewings", value: 9, change: 0, trend: "neutral" as const, icon: <CalendarDays className="h-6 w-6" /> },
];

const featuredProperties: Property[] = [
  { id: "1", title: "Luxury Oceanfront Villa", price: 2500000, currency: "USD", status: "available", type: "sale", location: "Miami Beach, FL", bedrooms: 5, bathrooms: 4, area: 450, imageIndex: 0, tags: ["Premium", "New"] },
  { id: "2", title: "Modern City Penthouse", price: 1800000, currency: "USD", status: "available", type: "sale", location: "Manhattan, NY", bedrooms: 3, bathrooms: 2, area: 280, imageIndex: 1, tags: ["Featured"] },
  { id: "3", title: "Skyline Terrace Suite", price: 15000, currency: "USD", status: "available", type: "rent", location: "Los Angeles, CA", bedrooms: 2, bathrooms: 2, area: 180, imageIndex: 2 },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HeroCarousel />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <KPICard {...kpi} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <OnboardingChecklist />
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle className="text-lg">Featured Properties</CardTitle>
              <Button variant="ghost" size="sm" data-testid="button-view-all-properties">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <div className="flex gap-4 pb-4">
                  {featuredProperties.map((property) => (
                    <div key={property.id} className="w-80 shrink-0">
                      <PropertyCard
                        property={property}
                        onView={(id) => console.log("View:", id)}
                        onShare={(id) => console.log("Share:", id)}
                        onFavorite={(id) => console.log("Favorite:", id)}
                      />
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <QuickActions />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
