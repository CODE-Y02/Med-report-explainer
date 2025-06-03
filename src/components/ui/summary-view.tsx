import { Card } from "@/components/ui/card";

export function SummaryView({ summary }: { summary: string }) {
  return (
    <Card className="bg-slate-50 border-t p-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-800">Summary:</h3>
        <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
          {summary}
        </p>
      </div>
    </Card>
  );
}
