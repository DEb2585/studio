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

export default function LabResultsTable({ labResults }: { labResults: Patient['labResults'] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Lab Results</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Range</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {labResults.map((result, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{result.test}</TableCell>
                  <TableCell>{result.value}</TableCell>
                  <TableCell className="text-muted-foreground">{result.range}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{result.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
