
import { ThemeProvider } from "@/lib/theme";
import WhatsAppLogs from "../crm/WhatsAppLogs";

export default function WhatsAppLogsExample() {
  // Example usage: <WhatsAppLogs contactId={1} />
  return (
    <ThemeProvider>
      <div className="w-full max-w-2xl mx-auto p-4">
        <WhatsAppLogs contactId={1} />
      </div>
    </ThemeProvider>
  );
}
