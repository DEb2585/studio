'use client';

import { useState } from 'react';
import Link from 'next/link';
import * as React from 'react';
import {
  Activity,
  PlusCircle,
  Search,
  Loader2,
  Sparkles,
  Send,
} from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarContent, SidebarFooter, SidebarInput, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, SidebarSeparator } from '@/components/ui/sidebar';
import { patients, type Patient } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';


// --- Inlined Components ---

// explainability-dialog.tsx
interface ExplainabilityDialogProps {
  prediction: string;
  factors: Record<string, number>;
}

function ExplainabilityDialog({ prediction, factors }: ExplainabilityDialogProps) {
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

// patient-profile-card.tsx
function PatientProfileCard({ patient }: { patient: Patient }) {
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

// prescription-editor.tsx
function PrescriptionEditor() {
  const [prescription, setPrescription] = useState('');
  const { toast } = useToast();

  const handleSendPrescription = () => {
    if (prescription.trim() === '') {
        toast({
            title: 'Error',
            description: 'Prescription cannot be empty.',
            variant: 'destructive',
        });
        return;
    }
    console.log('Sending prescription:', prescription);
    toast({
      title: 'Prescription Sent',
      description: 'The new prescription has been sent to the patient.',
    });
    setPrescription('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write Prescription</CardTitle>
        <CardDescription>Compose a new prescription for the patient. It will be sent securely.</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="e.g., Amoxicillin 500mg, take one tablet every 8 hours for 7 days."
          className="min-h-[150px] resize-y"
          value={prescription}
          onChange={(e) => setPrescription(e.target.value)}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSendPrescription}>
          <Send className="mr-2 h-4 w-4" />
          Send Prescription
        </Button>
      </CardFooter>
    </Card>
  );
}


// risk-scores-card.tsx
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

function RiskScoresCard({ riskScores }: { riskScores: Patient['riskScores'] }) {
  
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

// patient-details.tsx
function PatientDetails({ patient }: { patient: Patient }) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Patient Dashboard: {patient.name}
      </h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="col-span-1 flex flex-col gap-6">
          <PatientProfileCard patient={patient} />
        </div>
        <div className="col-span-1 flex flex-col gap-6 lg:col-span-2">
          <RiskScoresCard riskScores={patient.riskScores} />
          <PrescriptionEditor />
        </div>
      </div>
    </div>
  );
}

// patient-list.tsx
interface PatientListProps {
  patients: Patient[];
  selectedPatientId: string | null;
  onSelectPatient: (id: string) => void;
}

function PatientList({
  patients,
  selectedPatientId,
  onSelectPatient,
}: PatientListProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SidebarHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="size-8 text-primary" />
          <h2 className="text-lg font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
            Insights
          </h2>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <div className="relative p-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <SidebarInput
            placeholder="Search patients..."
            className="pl-8 group-data-[collapsible=icon]:hidden"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <SidebarMenu className="p-2">
          {filteredPatients.map((patient) => (
            <SidebarMenuItem key={patient.id}>
              <SidebarMenuButton
                onClick={() => onSelectPatient(patient.id)}
                isActive={selectedPatientId === patient.id}
                className="justify-start"
                tooltip={patient.name}
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={patient.avatar} alt={patient.name} data-ai-hint="person" />
                  <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="truncate">{patient.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {filteredPatients.length === 0 && (
            <p className="p-2 text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
              No patients found.
            </p>
          )}
        </SidebarMenu>
      </SidebarContent>
       <SidebarSeparator />
        <SidebarFooter className="p-2">
            <SidebarMenuItem>
                <Link href="/register" legacyBehavior passHref>
                    <SidebarMenuButton
                        className="justify-start"
                        tooltip="Register New Patient"
                    >
                        <PlusCircle />
                        <span className="truncate">New Patient</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
        </SidebarFooter>
    </>
  );
}


// --- Main Page Component ---
export default function Home() {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(patients.length > 0 ? patients[0].id : null);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || null;

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen">
        <Sidebar variant="sidebar" collapsible="icon">
          <PatientList
            patients={patients}
            selectedPatientId={selectedPatientId}
            onSelectPatient={setSelectedPatientId}
          />
        </Sidebar>
        <SidebarInset>
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-8">
              {selectedPatient ? (
                <PatientDetails patient={selectedPatient} />
              ) : (
                <div className="flex h-[80vh] items-center justify-center rounded-lg border-2 border-dashed">
                  <p className="text-muted-foreground">Select a patient to view details</p>
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
