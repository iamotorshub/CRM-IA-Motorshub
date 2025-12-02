import { ThemeProvider } from "@/lib/theme";
import AIGenerateButton from "../common/AIGenerateButton";

export default function AIGenerateButtonExample() {
  return (
    <ThemeProvider>
      <div className="flex flex-col gap-4">
        <AIGenerateButton
          label="Generate Description"
          onClick={() => console.log("AI generation triggered")}
        />
        <AIGenerateButton
          label="Analyze Lead"
          size="sm"
          onClick={() => console.log("Lead analysis triggered")}
        />
      </div>
    </ThemeProvider>
  );
}
