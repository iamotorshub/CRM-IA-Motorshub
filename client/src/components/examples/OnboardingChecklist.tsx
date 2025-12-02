import { ThemeProvider } from "@/lib/theme";
import OnboardingChecklist from "../dashboard/OnboardingChecklist";

export default function OnboardingChecklistExample() {
  return (
    <ThemeProvider>
      <div className="w-full max-w-md">
        <OnboardingChecklist />
      </div>
    </ThemeProvider>
  );
}
