import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Papa from "papaparse";
import { apiRequest } from "@/lib/queryClient";

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

const CONTACT_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "location",
  "status",
  "source",
  "score",
  "tags",
  "notes",
];

export default function CSVImportModal({ isOpen, onClose, onImportComplete }: CSVImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    Papa.parse(selectedFile, {
      header: true,
      complete: (results) => {
        setCsvData(results.data);
        setCsvHeaders(results.meta.fields || []);
      },
      error: (error) => {
        toast({
          title: "Error parsing CSV",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleImport = async () => {
    if (csvData.length === 0) {
      toast({
        title: "No data to import",
        description: "Please upload a CSV file first",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const mappedContacts = csvData
        .filter((row) => Object.values(row).some((val) => val))
        .map((row) => {
          const contact: any = {};
          Object.entries(columnMapping).forEach(([csvCol, contactField]) => {
            if (contactField && row[csvCol]) {
              contact[contactField] = row[csvCol];
            }
          });
          return contact;
        });

      await apiRequest("POST", "/api/contacts/bulk", { contacts: mappedContacts });

      toast({
        title: "Import successful",
        description: `Imported ${mappedContacts.length} contacts`,
      });

      onImportComplete();
      onClose();
      resetState();
    } catch (error: any) {
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetState = () => {
    setFile(null);
    setCsvData([]);
    setCsvHeaders([]);
    setColumnMapping({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Contacts from CSV</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="csv-file">Upload CSV File</Label>
            <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} />
          </div>

          {csvHeaders.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Map CSV Columns to Contact Fields</h3>
              <div className="grid grid-cols-2 gap-4">
                {csvHeaders.map((header) => (
                  <div key={header} className="flex items-center gap-2">
                    <Label className="min-w-[120px]">{header}</Label>
                    <Select
                      value={columnMapping[header] || ""}
                      onValueChange={(value) =>
                        setColumnMapping({ ...columnMapping, [header]: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Skip</SelectItem>
                        {CONTACT_FIELDS.map((field) => (
                          <SelectItem key={field} value={field}>
                            {field}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {csvData.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Preview ({csvData.length} rows)</h3>
              <div className="border rounded-lg overflow-auto max-h-[200px]">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      {csvHeaders.map((header) => (
                        <th key={header} className="p-2 text-left">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="border-t">
                        {csvHeaders.map((header) => (
                          <td key={header} className="p-2">
                            {row[header]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={isUploading || csvData.length === 0}>
            {isUploading ? "Importing..." : "Import Contacts"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}