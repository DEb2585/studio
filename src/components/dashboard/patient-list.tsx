"use client";

import * as React from "react";
import {
  Activity,
  Search,
  User,
} from "lucide-react";
import type { Patient } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarHeader,
  SidebarContent,
  SidebarInput,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface PatientListProps {
  patients: Patient[];
  selectedPatientId: string | null;
  onSelectPatient: (id: string) => void;
}

export default function PatientList({
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
            Health Insights
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
    </>
  );
}
