
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import SendWhatsAppModal from "./SendWhatsAppModal";

export default function ContactsList() {
  const [selectedContact, setSelectedContact] = useState<any>(null);

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["/api/contacts"],
  });

  if (isLoading) {
    return <div>Loading contacts...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact: any) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>
                    <Badge variant={contact.status === "hot" ? "destructive" : "secondary"}>
                      {contact.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button
                      className="text-green-600 font-medium hover:underline"
                      onClick={() => setSelectedContact(contact)}
                    >
                      WhatsApp
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedContact && (
        <SendWhatsAppModal
          open={true}
          onOpenChange={(open) => !open && setSelectedContact(null)}
          contactId={selectedContact.id}
          contactName={selectedContact.name}
        />
      )}
    </>
  );
}
