import type { Patient } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PatientProfileCard({ patient }: { patient: Patient }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={patient.avatar} alt={patient.name} data-ai-hint="person" />
          <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl">{patient.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{patient.age} years old, {patient.gender}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Date of Birth</span>
          <span className="font-medium">{patient.profile.dob}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Blood Type</span>
          <span className="font-medium">{patient.profile.bloodType}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Allergies</span>
          <div className="flex flex-wrap gap-2 pt-1">
            {patient.profile.allergies.length > 0 ? (
              patient.profile.allergies.map((allergy) => (
                <Badge key={allergy} variant="secondary">{allergy}</Badge>
              ))
            ) : (
              <span className="font-medium">None</span>
            )}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-muted-foreground mb-2">Lifestyle</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Smoker</span>
              <span className="font-medium">{patient.profile.lifestyle.smoker ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Alcohol</span>
              <span className="font-medium">{patient.profile.lifestyle.alcohol}</span>
            </div>
             <div className="flex justify-between">
              <span className="text-muted-foreground">Exercise</span>
              <span className="font-medium">{patient.profile.lifestyle.exercise}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
