import * as React from 'react';
import type { Patient } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ExplainabilityDialog from './explainability-dialog';

// A new component that wraps the Progress component to allow a custom color for the indicator.
const ColoredProgress = React.forwardRef<
  React.ElementRef<typeof Progress>,
  React.ComponentProps<typeof Progress> & { indicatorClassName?: string }
>(({ value, indicatorClassName, ...props }, ref) => {
  return (
    <Progress
      ref={ref}
      value={value}
      {...props}
      indicatorProps={{ className: indicatorClassName }}
    />
  );
});
ColoredProgress.displayName = 'ColoredProgress';

export default function RiskScoresCard({ riskScores }: { riskScores: Patient['riskScores'] }) {
  
  const getRiskColor = (level: 'Low' | 'Medium' | 'High' | 'Critical') => {
    switch (level) {
      case 'Low': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'High': return 'bg-orange-500';
      case 'Critical': return 'bg-red-500';
    }
  };

  const getBadgeVariant = (level: 'Low' | 'Medium' | 'High' | 'Critical') => {
    switch (level) {
      case 'Low': return 'default';
      case 'Medium': return 'default';
      case 'High': return 'destructive';
      case 'Critical': return 'destructive';
    }
  }

  const risks = [
    { name: 'Cardiovascular Disease', data: riskScores.cardiovascularDisease, predictionKey: 'Cardiovascular Disease' },
    { name: 'Diabetes', data: riskScores.diabetes, predictionKey: 'Diabetes' },
    { name: 'Readmission', data: riskScores.readmission, predictionKey: 'Hospital Readmission' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Risk Analysis</CardTitle>
        <CardDescription>AI-powered predictions for key health risks.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {risks.map((risk) => (
          <div key={risk.name} className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-semibold">{risk.name}</h4>
              <Badge variant={getBadgeVariant(risk.data.level)} className={cn('text-white', getRiskColor(risk.data.level))}>
                {risk.data.level} Risk
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 text-right">
                <span className="text-xl font-bold">{risk.data.score}</span>
                <span className="text-xs text-muted-foreground">/100</span>
              </div>
              <ColoredProgress value={risk.data.score} className="flex-1 h-3" indicatorClassName={getRiskColor(risk.data.level)} />
              <ExplainabilityDialog prediction={risk.predictionKey} factors={risk.data.factors} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
