import type { Patient } from '@/lib/data';
import PatientProfileCard from './patient-profile-card';
import RiskScoresCard from './risk-scores-card';
import PrescriptionEditor from './prescription-editor';

export default function PatientDetails({ patient }: { patient: Patient }) {
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
