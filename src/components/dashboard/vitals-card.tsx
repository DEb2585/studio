import type { Patient } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartPulse, Thermometer, Wind, Gauge } from 'lucide-react';

export default function VitalsCard({ vitals }: { vitals: Patient['vitals'] }) {
  const vitalsList = [
    { name: 'Heart Rate', value: `${vitals.heartRate} bpm`, icon: HeartPulse },
    { name: 'Blood Pressure', value: vitals.bloodPressure, icon: Gauge },
    { name: 'Temperature', value: `${vitals.temperature.toFixed(1)} °C`, icon: Thermometer },
    { name: 'Respiratory Rate', value: `${vitals.respiratoryRate} bpm`, icon: Wind },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vitals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {vitalsList.map((vital) => (
            <div key={vital.name} className="flex items-start gap-3 rounded-lg bg-background p-3">
              <vital.icon className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">{vital.name}</p>
                <p className="text-lg font-bold">{vital.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
