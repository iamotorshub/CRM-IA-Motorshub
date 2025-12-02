import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, MapPin, DollarSign, Home, Maximize, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AIGenerateButton from "@/components/common/AIGenerateButton";
import { cn } from "@/lib/utils";

import propertyImage from "@assets/generated_images/modern_luxury_living_room.png";

export default function PropertyForm() {
  const [images, setImages] = useState<string[]>([propertyImage]);
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setDescription(
      "Experience luxury living in this stunning modern residence featuring floor-to-ceiling windows that flood the space with natural light. The open-concept design seamlessly blends contemporary elegance with functional comfort. Premium finishes throughout include custom Italian cabinetry, quartz countertops, and hardwood flooring. The gourmet kitchen is a chef's dream with top-of-the-line appliances and a large center island perfect for entertaining. Wake up to breathtaking views from the master suite, complete with a spa-like bathroom and walk-in closet. Additional amenities include smart home technology, private balcony, and dedicated parking."
    );
    setIsGenerating(false);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Create New Property</CardTitle>
          <CardDescription>
            Add a new property listing to your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title</Label>
              <Input
                id="title"
                placeholder="e.g., Luxury Oceanfront Villa"
                data-testid="input-property-title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Internal Code</Label>
              <Input
                id="code"
                placeholder="e.g., PROP-001"
                data-testid="input-property-code"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select defaultValue="available">
                <SelectTrigger data-testid="select-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select defaultValue="sale">
                <SelectTrigger data-testid="select-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">For Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                  <SelectItem value="seasonal">Seasonal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Property Type</Label>
              <Select defaultValue="house">
                <SelectTrigger data-testid="select-property-type">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  className="pl-9"
                  data-testid="input-price"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select defaultValue="USD">
                <SelectTrigger data-testid="select-currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                placeholder="0"
                data-testid="input-bedrooms"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                placeholder="0"
                data-testid="input-bathrooms"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Area (m²)</Label>
              <Input
                id="area"
                type="number"
                placeholder="0"
                data-testid="input-area"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parking">Parking Spaces</Label>
              <Input
                id="parking"
                type="number"
                placeholder="0"
                data-testid="input-parking"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="location"
                placeholder="e.g., 123 Ocean Drive, Miami Beach, FL"
                className="pl-9"
                data-testid="input-location"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description</Label>
              <AIGenerateButton
                label="Generate with AI"
                size="sm"
                onClick={handleGenerateDescription}
              />
            </div>
            <Textarea
              id="description"
              placeholder="Describe the property features, amenities, and unique selling points..."
              className="min-h-[150px] resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-testid="textarea-description"
            />
          </div>

          <div className="space-y-2">
            <Label>Property Images</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-lg overflow-hidden group"
                >
                  <img
                    src={image}
                    alt={`Property ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                    data-testid={`button-remove-image-${index}`}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <label
                className={cn(
                  "flex flex-col items-center justify-center aspect-video rounded-lg",
                  "border-2 border-dashed border-muted-foreground/25",
                  "cursor-pointer hover:border-primary/50 hover:bg-muted/50",
                  "transition-colors"
                )}
                data-testid="upload-zone"
              >
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground">Upload Image</span>
                <input type="file" className="hidden" accept="image/*" />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" data-testid="button-cancel">
              Cancel
            </Button>
            <Button data-testid="button-save-property">
              Save Property
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
