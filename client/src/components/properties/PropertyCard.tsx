import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Square, Share2, Heart, Eye, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import propertyImage1 from "@assets/generated_images/luxury_property_exterior_twilight.png";
import propertyImage2 from "@assets/generated_images/modern_luxury_living_room.png";
import propertyImage3 from "@assets/generated_images/penthouse_terrace_city_view.png";

export interface Property {
  id: string;
  title: string;
  price: number;
  currency: string;
  status: "available" | "reserved" | "sold";
  type: "sale" | "rent";
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageIndex?: number;
  tags?: string[];
}

const propertyImages = [propertyImage1, propertyImage2, propertyImage3];

const statusConfig = {
  available: { label: "Available", className: "bg-green-500/90 text-white" },
  reserved: { label: "Reserved", className: "bg-amber-500/90 text-white" },
  sold: { label: "Sold", className: "bg-red-500/90 text-white" },
};

interface PropertyCardProps {
  property: Property;
  onView?: (id: string) => void;
  onShare?: (id: string) => void;
  onFavorite?: (id: string) => void;
}

export default function PropertyCard({
  property,
  onView,
  onShare,
  onFavorite,
}: PropertyCardProps) {
  const { id, title, price, currency, status, type, location, bedrooms, bathrooms, area, imageIndex = 0, tags } = property;
  const statusInfo = statusConfig[status];
  const image = propertyImages[imageIndex % propertyImages.length];

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden group hover-elevate" data-testid={`property-card-${id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            <Badge className={cn("backdrop-blur-md", statusInfo.className)}>
              {statusInfo.label}
            </Badge>
            {tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="backdrop-blur-md bg-white/20 text-white border-white/30">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-white">
                  {formatPrice(price, currency)}
                  {type === "rent" && <span className="text-sm font-normal">/mo</span>}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-full backdrop-blur-md bg-white/20 border border-white/30 text-white hover:bg-white/30"
                  onClick={() => onFavorite?.(id)}
                  data-testid={`button-favorite-${id}`}
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-full backdrop-blur-md bg-white/20 border border-white/30 text-white hover:bg-white/30"
                  onClick={() => onShare?.(id)}
                  data-testid={`button-share-${id}`}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
              <MapPin className="h-3.5 w-3.5" />
              <span className="line-clamp-1">{location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{bedrooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{bathrooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <Square className="h-4 w-4" />
                <span>{area} m²</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="gap-1"
                onClick={() => onView?.(id)}
                data-testid={`button-view-${id}`}
              >
                <Eye className="h-4 w-4" />
                View
              </Button>
              <Button
                size="sm"
                variant="default"
                className="gap-1"
                data-testid={`button-contact-${id}`}
              >
                <MessageCircle className="h-4 w-4" />
                Contact
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
