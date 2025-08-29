import type { Patient } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PrescriptionsTable({ prescriptions }: { prescriptions: Patient['prescriptions'] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Prescriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Frequency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((prescription, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{prescription.medication}</TableCell>
                  <TableCell>{prescription.dosage}</TableCell>
                  <TableCell className="text-muted-foreground">{prescription.frequency}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
