import { motion } from "framer-motion";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import SendWhatsAppModal from "../components/crm/SendWhatsAppModal";
import { useState } from "react";

export default function CampaignEditor() {
  const [testStep, setTestStep] = useState<any>(null);

  return (
    <div className="p-8 w-full min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <ArrowLeft className="h-6 w-6 cursor-pointer" />
          <h1 className="text-3xl font-bold">Create Campaign</h1>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="lg">
            Cancel
          </Button>
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            <Save className="h-4 w-4 mr-2" /> Save Campaign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-1">
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input id="campaign-name" placeholder="e.g. Summer Sale Outreach" />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="campaign-description">Description</Label>
                  <Textarea
                    id="campaign-description"
                    placeholder="e.g. Reach out to customers with our summer sale offers."
                    rows={5}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Campaign Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Render campaign steps here */}
                {/* Example Step */}
                <Card className="bg-gray-100">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Step 1: Welcome Message</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <button
                          className="text-green-600 hover:underline ml-2 text-sm"
                          onClick={() => setTestStep({ id: 1, name: "Welcome Message" })}
                        >
                          Send Test WhatsApp
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <Label>Message Content</Label>
                      <Textarea
                        placeholder="Type your message here..."
                        rows={4}
                        className="bg-white"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-100">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Step 2: Offer Details</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <button
                          className="text-green-600 hover:underline ml-2 text-sm"
                          onClick={() => setTestStep({ id: 2, name: "Offer Details" })}
                        >
                          Send Test WhatsApp
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <Label>Message Content</Label>
                      <Textarea
                        placeholder="Type your message here..."
                        rows={4}
                        className="bg-white"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button
                variant="outline"
                className="mt-6 w-full border-dashed hover:border-green-600 hover:text-green-600"
              >
                <Plus className="h-4 w-4 mr-2" /> Add New Step
              </Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-1">
                  <Label htmlFor="schedule-date">Schedule Date</Label>
                  <Input type="date" id="schedule-date" />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="schedule-time">Schedule Time</Label>
                  <Input type="time" id="schedule-time" />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">EST</SelectItem>
                      <SelectItem value="pst">PST</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1">
                  <Label>Audience</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Contacts</SelectItem>
                      <SelectItem value="segment">Custom Segment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {testStep && (
        <SendWhatsAppModal
          open={true}
          onOpenChange={(open) => !open && setTestStep(null)}
          contactId={undefined}
          contactName="Test Contact"
        />
      )}
    </div>
  );
}