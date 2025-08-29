'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { explainPrediction } from '@/ai/flows/explain-prediction';
import { Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExplainabilityDialogProps {
  prediction: string;
  factors: Record<string, number>;
}

export default function ExplainabilityDialog({ prediction, factors }: ExplainabilityDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleExplain = async () => {
    if (!isOpen) return;
    setIsLoading(true);
    setExplanation('');
    try {
      const result = await explainPrediction({ prediction, factors });
      setExplanation(result.explanation);
    } catch (error) {
      console.error('Error fetching explanation:', error);
      setExplanation('Sorry, we could not generate an explanation at this time.');
    } finally {
      setIsLoading(false);
    }
  };

  const sortedFactors = Object.entries(factors).sort(([, a], [, b]) => b - a);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (open) {
            handleExplain();
        }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Explain</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI-Powered Explanation</DialogTitle>
          <DialogDescription>
            Understanding the 'why' behind the {prediction} risk prediction.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Key Contributing Factors</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                        {sortedFactors.map(([factor, weight]) => (
                            <li key={factor} className="flex justify-between">
                                <span>{factor}</span>
                                <span className="font-mono text-foreground">{(weight * 100).toFixed(0)}%</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                     <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-accent" />
                        AI Narrative
                     </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center min-h-[80px]">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <p className="ml-2 text-sm text-muted-foreground">Generating insights...</p>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">{explanation}</p>
                    )}
                </CardContent>
            </Card>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
