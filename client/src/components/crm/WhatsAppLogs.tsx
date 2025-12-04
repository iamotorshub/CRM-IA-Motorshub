
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

interface WhatsAppLogsProps {
  contactId: number;
}

export default function WhatsAppLogs({ contactId }: WhatsAppLogsProps) {
  const { data: logs = [] } = useQuery({
    queryKey: [`/api/contacts/${contactId}/whatsapp-logs`],
  });

  const statusColors: Record<string, string> = {
    sent: "bg-blue-500/10 text-blue-600",
    delivered: "bg-green-500/10 text-green-600",
    read: "bg-purple-500/10 text-purple-600",
    failed: "bg-red-500/10 text-red-600",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          WhatsApp History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No WhatsApp messages yet</p>
        ) : (
          <div className="space-y-3">
            {logs.map((log: any) => (
              <div key={log.id} className="border-b pb-3 last:border-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm">{log.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge className={statusColors[log.status] || ""}>
                    {log.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
