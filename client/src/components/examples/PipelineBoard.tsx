import { ThemeProvider } from "@/lib/theme";
import PipelineBoard from "../crm/PipelineBoard";

export default function PipelineBoardExample() {
  return (
    <ThemeProvider>
      <div className="w-full overflow-x-auto">
        <PipelineBoard />
      </div>
    </ThemeProvider>
  );
}
