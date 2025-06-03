import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "./card";

export function FileSubmission({
  onFileSelect,
  uploadedFile,
  isLoading,
  error,
}: {
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadedFile: File | null;
  isLoading: boolean;
  error: string;
}) {
  return (
    <Card className="w-full max-w-md space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="pdf-upload">Upload Medical Report</Label>
        <Input
          id="pdf-upload"
          type="file"
          accept=".pdf"
          onChange={onFileSelect}
          disabled={isLoading}
        />
      </div>
      {uploadedFile && (
        <div className="text-sm">
          Selected: {uploadedFile.name} ({Math.round(uploadedFile.size / 1024)}
          KB)
        </div>
      )}
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </Card>
  );
}
