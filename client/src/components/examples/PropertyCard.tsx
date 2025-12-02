import { ThemeProvider } from "@/lib/theme";
import PropertyCard, { Property } from "../properties/PropertyCard";

const mockProperty: Property = {
  id: "1",
  title: "Luxury Oceanfront Villa",
  price: 2500000,
  currency: "USD",
  status: "available",
  type: "sale",
  location: "Miami Beach, FL",
  bedrooms: 5,
  bathrooms: 4,
  area: 450,
  imageIndex: 0,
  tags: ["Premium", "New"],
};

export default function PropertyCardExample() {
  return (
    <ThemeProvider>
      <div className="w-full max-w-sm">
        <PropertyCard
          property={mockProperty}
          onView={(id) => console.log("View property:", id)}
          onShare={(id) => console.log("Share property:", id)}
          onFavorite={(id) => console.log("Favorite property:", id)}
        />
      </div>
    </ThemeProvider>
  );
}
