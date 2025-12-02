import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, Grid3X3, List, SlidersHorizontal } from "lucide-react";
import PropertyCard, { Property } from "@/components/properties/PropertyCard";
import PropertyForm from "@/components/properties/PropertyForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const mockProperties: Property[] = [
  { id: "1", title: "Luxury Oceanfront Villa", price: 2500000, currency: "USD", status: "available", type: "sale", location: "Miami Beach, FL", bedrooms: 5, bathrooms: 4, area: 450, imageIndex: 0, tags: ["Premium", "New"] },
  { id: "2", title: "Modern City Penthouse", price: 1800000, currency: "USD", status: "reserved", type: "sale", location: "Manhattan, NY", bedrooms: 3, bathrooms: 2, area: 280, imageIndex: 1, tags: ["Featured"] },
  { id: "3", title: "Skyline Terrace Suite", price: 15000, currency: "USD", status: "available", type: "rent", location: "Los Angeles, CA", bedrooms: 2, bathrooms: 2, area: 180, imageIndex: 2 },
  { id: "4", title: "Beachfront Paradise", price: 3200000, currency: "USD", status: "sold", type: "sale", location: "Malibu, CA", bedrooms: 6, bathrooms: 5, area: 520, imageIndex: 0 },
  { id: "5", title: "Downtown Loft", price: 650000, currency: "USD", status: "available", type: "sale", location: "Chicago, IL", bedrooms: 1, bathrooms: 1, area: 95, imageIndex: 1, tags: ["Opportunity"] },
  { id: "6", title: "Mountain View Retreat", price: 890000, currency: "USD", status: "available", type: "sale", location: "Aspen, CO", bedrooms: 4, bathrooms: 3, area: 320, imageIndex: 2, tags: ["Premium"] },
];

export default function Properties() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredProperties = mockProperties.filter((property) => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || property.status === statusFilter;
    const matchesType = typeFilter === "all" || property.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Properties</h1>
          <p className="text-muted-foreground">Manage your property listings</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" data-testid="button-new-property">
              <Plus className="h-4 w-4" />
              New Property
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Property</DialogTitle>
            </DialogHeader>
            <PropertyForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full"
            data-testid="input-search-properties"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32" data-testid="select-status-filter">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32" data-testid="select-type-filter">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sale">For Sale</SelectItem>
              <SelectItem value="rent">For Rent</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" data-testid="button-advanced-filter">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="rounded-none"
              data-testid="button-grid-view"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-none"
              data-testid="button-list-view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="secondary">{filteredProperties.length} properties</Badge>
        {statusFilter !== "all" && (
          <Badge variant="outline" className="gap-1">
            Status: {statusFilter}
            <button onClick={() => setStatusFilter("all")} className="ml-1 hover:text-destructive">×</button>
          </Badge>
        )}
        {typeFilter !== "all" && (
          <Badge variant="outline" className="gap-1">
            Type: {typeFilter}
            <button onClick={() => setTypeFilter("all")} className="ml-1 hover:text-destructive">×</button>
          </Badge>
        )}
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.05 } },
        }}
      >
        {filteredProperties.map((property) => (
          <motion.div
            key={property.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <PropertyCard
              property={property}
              onView={(id) => console.log("View:", id)}
              onShare={(id) => console.log("Share:", id)}
              onFavorite={(id) => console.log("Favorite:", id)}
            />
          </motion.div>
        ))}
      </motion.div>

      {filteredProperties.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No properties found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
