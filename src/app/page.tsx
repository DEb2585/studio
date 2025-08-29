'use client';

import { useState } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { patients } from '@/lib/data';
import PatientList from '@/components/dashboard/patient-list';
import PatientDetails from '@/components/dashboard/patient-details';

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
