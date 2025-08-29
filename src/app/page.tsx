'use client';

import { useState } from 'react';
import Link from 'next/link';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Activity,
  PlusCircle,
  Search,
  Loader2,
  Sparkles,
  Send,
} from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarContent, SidebarFooter, SidebarInput, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, SidebarSeparator } from '@/components/ui/sidebar';
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


// --- Data ---
export type Patient = {
  id: string;
  name: string;
  avatar: string;
  age: number;
  gender: 'Male' | 'Female';
  profile: {
    dob: string;
    bloodType: string;
    allergies: string[];
    lifestyle: {
      smoker: boolean;
      alcohol: string;
      exercise: string;
    };
  };
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    respiratoryRate: number;
  };
  labResults: {
    test: string;
    value: string;
    range: string;
    date: string;
  }[];
  prescriptions: {
    medication: string;
    dosage: string;
    frequency: string;
    startDate: string;
  }[];
  riskScores: {
    cardiovascularDisease: {
      score: number;
      level: 'Low' | 'Medium' | 'High' | 'Critical';
      factors: Record<string, number>;
    };
    diabetes: {
      score: number;
      level: 'Low' | 'Medium' | 'High' | 'Critical';
      factors: Record<string, number>;
    };
    readmission: {
      score: number;
      level: 'Low' | 'Medium' | 'High' | 'Critical';
      factors: Record<string, number>;
    };
  };
};

export const patients: Patient[] = [
  {
    id: 'pat1',
    name: 'John Doe',
    avatar: 'https://picsum.photos/100/100?random=1',
    age: 45,
    gender: 'Male',
    profile: {
      dob: '1979-05-20',
      bloodType: 'O+',
      allergies: ['Penicillin'],
      lifestyle: {
        smoker: true,
        alcohol: 'Socially',
        exercise: '2-3 times a week',
      },
    },
    vitals: {
      heartRate: 85,
      bloodPressure: '140/90',
      temperature: 37.0,
      respiratoryRate: 18,
    },
    labResults: [
      { test: 'Cholesterol', value: '220 mg/dL', range: '125-200 mg/dL', date: '2024-06-15' },
      { test: 'Glucose', value: '110 mg/dL', range: '70-100 mg/dL', date: '2024-06-15' },
      { test: 'Hemoglobin A1c', value: '6.2%', range: '< 5.7%', date: '2024-06-15' },
    ],
    prescriptions: [
      { medication: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', startDate: '2023-01-10' },
      { medication: 'Metformin', dosage: '500mg', frequency: 'Twice daily', startDate: '2023-05-22' },
    ],
    riskScores: {
      cardiovascularDisease: {
        score: 78,
        level: 'High',
        factors: { 'Blood Pressure': 0.4, 'Cholesterol': 0.3, 'Smoker': 0.2, 'Age': 0.1 },
      },
      diabetes: {
        score: 65,
        level: 'Medium',
        factors: { 'Glucose': 0.5, 'Hemoglobin A1c': 0.3, 'BMI': 0.2 },
      },
      readmission: {
        score: 40,
        level: 'Low',
        factors: { 'Previous Admits': 0.6, 'Comorbidities': 0.4 },
      },
    },
  },
  {
    id: 'pat2',
    name: 'Jane Smith',
    avatar: 'https://picsum.photos/100/100?random=2',
    age: 62,
    gender: 'Female',
    profile: {
      dob: '1962-11-01',
      bloodType: 'A-',
      allergies: ['None'],
      lifestyle: {
        smoker: false,
        alcohol: 'Rarely',
        exercise: 'Daily walks',
      },
    },
    vitals: {
      heartRate: 72,
      bloodPressure: '130/85',
      temperature: 36.8,
      respiratoryRate: 16,
    },
    labResults: [
      { test: 'Cholesterol', value: '190 mg/dL', range: '125-200 mg/dL', date: '2024-07-01' },
      { test: 'Glucose', value: '95 mg/dL', range: '70-100 mg/dL', date: '2024-07-01' },
      { test: 'Thyroid (TSH)', value: '2.5 mU/L', range: '0.4-4.0 mU/L', date: '2024-07-01' },
    ],
    prescriptions: [
      { medication: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', startDate: '2022-08-15' },
    ],
    riskScores: {
      cardiovascularDisease: {
        score: 55,
        level: 'Medium',
        factors: { 'Age': 0.4, 'Blood Pressure': 0.3, 'Cholesterol': 0.3 },
      },
      diabetes: {
        score: 25,
        level: 'Low',
        factors: { 'Glucose': 0.6, 'Age': 0.2, 'BMI': 0.2 },
      },
      readmission: {
        score: 30,
        level: 'Low',
        factors: { 'Age': 0.5, 'Comorbidities': 0.5 },
      },
    },
  },
  {
    id: 'pat3',
    name: 'Robert Johnson',
    avatar: 'https://picsum.photos/100/100?random=3',
    age: 71,
    gender: 'Male',
    profile: {
      dob: '1953-02-14',
      bloodType: 'B+',
      allergies: ['Sulfa drugs'],
      lifestyle: {
        smoker: false,
        alcohol: 'None',
        exercise: 'Limited due to arthritis',
      },
    },
    vitals: {
      heartRate: 68,
      bloodPressure: '150/95',
      temperature: 36.9,
      respiratoryRate: 17,
    },
    labResults: [
      { test: 'Creatinine', value: '1.4 mg/dL', range: '0.6-1.2 mg/dL', date: '2024-05-30' },
      { test: 'Potassium', value: '4.8 mEq/L', range: '3.5-5.0 mEq/L', date: '2024-05-30' },
    ],
    prescriptions: [
      { medication: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', startDate: '2020-03-01' },
      { medication: 'Warfarin', dosage: 'Varies', frequency: 'Once daily', startDate: '2021-06-20' },
    ],
    riskScores: {
      cardiovascularDisease: {
        score: 85,
        level: 'Critical',
        factors: { 'Blood Pressure': 0.5, 'Age': 0.4, 'Creatinine': 0.1 },
      },
      diabetes: {
        score: 35,
        level: 'Low',
        factors: { 'Age': 0.5, 'BMI': 0.5 },
      },
      readmission: {
        score: 80,
        level: 'High',
        factors: { 'Age': 0.4, 'Multiple Prescriptions': 0.3, 'Comorbidities': 0.3 },
      },
    },
  },
];


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
  onShowRegister: () => void;
}

function PatientList({
  patients,
  selectedPatientId,
  onSelectPatient,
  onShowRegister
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
                <SidebarMenuButton
                    onClick={onShowRegister}
                    className="justify-start"
                    tooltip="Register New Patient"
                >
                    <PlusCircle />
                    <span className="truncate">New Patient</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarFooter>
    </>
  );
}


// register-patient-page.tsx
const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  age: z.coerce.number().min(0, {
    message: 'Age must be a positive number.',
  }),
  isSmoker: z.enum(['yes', 'no'], {
    required_error: 'You need to select an option.',
  }),
});

function RegisterPatientPage({ onBack }: { onBack: () => void }) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      age: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Form Submitted',
      description: 'Patient data has been logged to the console.',
    });
    form.reset();
  }

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center justify-between">
         <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Register New Patient
          </h1>
          <Button variant="outline" onClick={onBack}>Back to Dashboard</Button>
       </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Patient Registration</CardTitle>
          <CardDescription>Please fill out the form to register a new patient.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormDescription>This is the patient's full name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="45" {...field} />
                    </FormControl>
                    <FormDescription>The patient's age in years.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isSmoker"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Is the patient a smoker?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="yes" />
                          </FormControl>
                          <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Register Patient</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}


// --- Main Page Component ---
export default function Home() {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(patients.length > 0 ? patients[0].id : null);
  const [showRegister, setShowRegister] = useState(false);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || null;

  const handleSelectPatient = (id: string) => {
    setSelectedPatientId(id);
    setShowRegister(false);
  }

  const handleShowRegister = () => {
    setSelectedPatientId(null);
    setShowRegister(true);
  }
  
  const handleBackToDashboard = () => {
    setShowRegister(false);
    if(patients.length > 0) {
        setSelectedPatientId(patients[0].id);
    }
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen">
        <Sidebar variant="sidebar" collapsible="icon">
          <PatientList
            patients={patients}
            selectedPatientId={selectedPatientId}
            onSelectPatient={handleSelectPatient}
            onShowRegister={handleShowRegister}
          />
        </Sidebar>
        <SidebarInset>
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-8">
              {showRegister ? (
                <RegisterPatientPage onBack={handleBackToDashboard} />
              ) : selectedPatient ? (
                <PatientDetails patient={selectedPatient} />
              ) : (
                <div className="flex h-[80vh] items-center justify-center rounded-lg border-2 border-dashed">
                  <p className="text-muted-foreground">Select a patient to view details or register a new one.</p>
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
