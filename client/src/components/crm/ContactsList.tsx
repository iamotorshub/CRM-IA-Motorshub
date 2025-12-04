
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Mail, Phone, MapPin } from "lucide-react";

export default function ContactsList() {
  const { data: contacts, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/contacts"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive">Error loading contacts: {error.message}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Contacts</CardTitle>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {!contacts || contacts.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No contacts yet. Import a CSV or add one manually.</p>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact: any) => (
              <div key={contact.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-semibold">
                      {contact.firstName} {contact.lastName}
                    </h3>
                    {contact.email && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="h-3 w-3 mr-1" />
                        {contact.email}
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="h-3 w-3 mr-1" />
                        {contact.phone}
                      </div>
                    )}
                    {contact.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {contact.location}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {contact.status && <Badge variant="outline">{contact.status}</Badge>}
                    {contact.score !== null && <Badge variant="secondary">Score: {contact.score}</Badge>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
