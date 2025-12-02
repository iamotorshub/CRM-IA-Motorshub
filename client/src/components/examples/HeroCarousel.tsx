import { ThemeProvider } from "@/lib/theme";
import HeroCarousel from "../dashboard/HeroCarousel";

export default function HeroCarouselExample() {
  return (
    <ThemeProvider>
      <div className="w-full max-w-5xl">
        <HeroCarousel />
      </div>
    </ThemeProvider>
  );
}
