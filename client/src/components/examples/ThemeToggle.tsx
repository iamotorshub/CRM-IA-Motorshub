import { ThemeProvider } from "@/lib/theme";
import ThemeToggle from "../common/ThemeToggle";

export default function ThemeToggleExample() {
  return (
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );
}
