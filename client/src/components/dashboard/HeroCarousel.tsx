import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Building2, Zap, Sparkles, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import heroImage from "@assets/generated_images/premium_real_estate_office_hero.png";

interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

const slides: CarouselSlide[] = [
  {
    id: 1,
    title: "Real Estate CRM",
    subtitle: "Manage Properties & Leads",
    description: "Track properties, listings, and leads with a powerful CRM built specifically for real estate professionals.",
    icon: <Building2 className="h-8 w-8" />,
    gradient: "from-blue-600/20 to-cyan-600/20",
  },
  {
    id: 2,
    title: "Automation Hub",
    subtitle: "n8n + Make Integrations",
    description: "Connect your workflows with powerful automation. Trigger actions, sync data, and save hours every week.",
    icon: <Zap className="h-8 w-8" />,
    gradient: "from-amber-600/20 to-orange-600/20",
  },
  {
    id: 3,
    title: "AI-Powered",
    subtitle: "GPT, Gemini & Claude",
    description: "Generate property descriptions, analyze leads, and create content with multi-provider AI integration.",
    icon: <Sparkles className="h-8 w-8" />,
    gradient: "from-purple-600/20 to-pink-600/20",
  },
  {
    id: 4,
    title: "Media Library",
    subtitle: "Google Cloud Storage",
    description: "Store and organize all your property photos, videos, and documents in one secure cloud library.",
    icon: <FolderOpen className="h-8 w-8" />,
    gradient: "from-emerald-600/20 to-teal-600/20",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const slide = slides[currentSlide];

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-[400px] md:h-[480px]">
        <img
          src={heroImage}
          alt="Premium office"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-8 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className={cn(
                    "inline-flex items-center gap-3 rounded-full px-4 py-2",
                    "bg-white/10 backdrop-blur-md border border-white/20"
                  )}>
                    <div className="text-white">{slide.icon}</div>
                    <span className="text-sm font-medium text-white">{slide.subtitle}</span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                    {slide.title}
                  </h2>
                  
                  <p className="text-lg text-white/80 max-w-md">
                    {slide.description}
                  </p>

                  <div className="flex gap-3">
                    <Button size="lg" className="gap-2" data-testid="button-get-started">
                      Get Started
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="backdrop-blur-md bg-white/10 border-white/30 text-white hover:bg-white/20"
                      data-testid="button-learn-more"
                    >
                      Learn More
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === currentSlide
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/60"
              )}
              data-testid={`carousel-dot-${index}`}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
          onClick={prevSlide}
          data-testid="button-carousel-prev"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
          onClick={nextSlide}
          data-testid="button-carousel-next"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
