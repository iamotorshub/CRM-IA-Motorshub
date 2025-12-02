import { ThemeProvider } from "@/lib/theme";
import ContactsList from "../crm/ContactsList";

export default function ContactsListExample() {
  return (
    <ThemeProvider>
      <div className="w-full">
        <ContactsList />
      </div>
    </ThemeProvider>
  );
}
