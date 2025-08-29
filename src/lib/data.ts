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
