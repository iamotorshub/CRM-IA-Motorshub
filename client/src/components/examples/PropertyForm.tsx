import { ThemeProvider } from "@/lib/theme";
import PropertyForm from "../properties/PropertyForm";

export default function PropertyFormExample() {
  return (
    <ThemeProvider>
      <div className="w-full max-w-4xl">
        <PropertyForm />
      </div>
    </ThemeProvider>
  );
}
