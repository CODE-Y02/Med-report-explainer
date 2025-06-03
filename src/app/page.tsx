"use client";

import { useState, FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { SummaryView } from "@/components/ui/summary-view";

export default function HomePage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Do NOT reset uploadedFile here
    setSummary("");
    setIsLoading(true);
    setError(null);
    setUploadProgress(0);

    if (!file) {
      setError("No file selected");
      setIsLoading(false);
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF files are accepted");
      e.target.value = "";
      setIsLoading(false);
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setError("File exceeds 4MB limit");
      e.target.value = "";
      setIsLoading(false);
      return;
    }

    // Set valid file
    setUploadedFile(file);
    setError("");
    setIsLoading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!uploadedFile) return;

    setIsLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      // Add progress tracking
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          setUploadProgress(Math.round((event.loaded / event.total) * 100));
        }
      });

      const response = await fetch("/api/summarize", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();
      setSummary(result.summary);
      setUploadProgress(100);
      setUploadedFile(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process file");
      setUploadProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg p-3">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-800">
              Medical Report Summarizer
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Upload PDF Report
                </label>
                <Input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf"
                  disabled={isLoading}
                />
                {uploadedFile && (
                  <p className="text-sm text-slate-500 mt-2">
                    Selected file: {uploadedFile.name}
                  </p>
                )}
                {uploadedFile && (
                  <div className="mt-2 text-sm">
                    Selected: {uploadedFile.name} (
                    {Math.round(uploadedFile.size / 1024)}KB)
                  </div>
                )}
              </div>

              {isLoading && (
                <Progress value={uploadProgress} className="h-2 bg-slate-200" />
              )}

              {error && (
                <p className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                  Error: {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={isLoading || !uploadedFile}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? "Processing..." : "Summarize Report"}
              </Button>
            </form>
          </CardContent>

          {summary && <SummaryView summary={summary} />}
        </Card>
      </div>
    </div>
  );
}
