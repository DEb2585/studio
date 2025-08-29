'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

export default function PrescriptionEditor() {
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
