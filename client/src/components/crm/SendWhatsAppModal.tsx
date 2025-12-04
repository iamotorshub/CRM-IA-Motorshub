
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SendWhatsAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactId?: number;
  contactName?: string;
}

export default function SendWhatsAppModal({ 
  open, 
  onOpenChange, 
  contactId,
  contactName 
}: SendWhatsAppModalProps) {
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "openai",
          systemPrompt: "You generate short WhatsApp outreach messages. Format: max 2 lines, punchy, direct, no emojis unless strategic.",
          messages: [{ role: "user", content: `Generate a WhatsApp message for ${contactName}` }]
        }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMessage(data.reply);
    },
  });

  const sendMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/whatsapp/contact-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId, message }),
      });
      if (!response.ok) throw new Error("Failed to send");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "WhatsApp sent successfully!" });
      onOpenChange(false);
      setMessage("");
    },
    onError: () => {
      toast({ title: "Failed to send WhatsApp", variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Send WhatsApp to {contactName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your WhatsApp message..."
              rows={5}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
          >
            {generateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Generate with AI
          </Button>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => sendMutation.mutate()} 
            disabled={!message || sendMutation.isPending}
          >
            {sendMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Send WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
