import { create } from 'zustand'

export interface Patient {
  id: string
  name: string
  email: string
  phone: string
  age: number
  condition: string
  status: 'stable' | 'monitoring' | 'critical'
  room: string
  admissionDate: string
  lastCheckup: string
  vitals: {
    heartRate: number
    bloodPressure: string
    temperature: number
    oxygenLevel: number
  }
  medications: string[]
  allergies: string[]
}

interface PatientState {
  patients: Patient[]
  isLoading: boolean
  error: string | null
  viewType: 'grid' | 'list'
  setPatients: (patients: Patient[]) => void
  addPatient: (patient: Patient) => void
  updatePatient: (id: string, patient: Partial<Patient>) => void
  deletePatient: (id: string) => void
  setViewType: (type: 'grid' | 'list') => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

// Mock patient data
const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Anderson',
    email: 'john.anderson@example.com',
    phone: '+1 (555) 123-4567',
    age: 45,
    condition: 'Type 2 Diabetes',
    status: 'stable',
    room: '301',
    admissionDate: '2024-01-15',
    lastCheckup: '2024-05-03',
    vitals: {
      heartRate: 72,
      bloodPressure: '120/80',
      temperature: 98.6,
      oxygenLevel: 98,
    },
    medications: ['Metformin 500mg', 'Lisinopril 10mg'],
    allergies: ['Penicillin'],
  },
  {
    id: '2',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@example.com',
    phone: '+1 (555) 234-5678',
    age: 38,
    condition: 'Hypertension',
    status: 'monitoring',
    room: '215',
    admissionDate: '2024-02-20',
    lastCheckup: '2024-05-02',
    vitals: {
      heartRate: 78,
      bloodPressure: '145/92',
      temperature: 98.5,
      oxygenLevel: 97,
    },
    medications: ['Amlodipine 5mg', 'Hydrochlorothiazide 25mg'],
    allergies: [],
  },
  {
    id: '3',
    name: 'Robert Davis',
    email: 'robert.davis@example.com',
    phone: '+1 (555) 345-6789',
    age: 62,
    condition: 'Coronary Artery Disease',
    status: 'critical',
    room: '102',
    admissionDate: '2024-03-10',
    lastCheckup: '2024-05-04',
    vitals: {
      heartRate: 92,
      bloodPressure: '155/98',
      temperature: 99.2,
      oxygenLevel: 94,
    },
    medications: ['Atorvastatin 40mg', 'Aspirin 81mg', 'Metoprolol 50mg'],
    allergies: ['Sulfonamides'],
  },
  {
    id: '4',
    name: 'Emily Chen',
    email: 'emily.chen@example.com',
    phone: '+1 (555) 456-7890',
    age: 29,
    condition: 'Anxiety Disorder',
    status: 'stable',
    room: '405',
    admissionDate: '2024-04-05',
    lastCheckup: '2024-05-03',
    vitals: {
      heartRate: 68,
      bloodPressure: '118/76',
      temperature: 98.4,
      oxygenLevel: 99,
    },
    medications: ['Sertraline 50mg', 'Buspirone 7.5mg'],
    allergies: [],
  },
  {
    id: '5',
    name: 'Michael Thompson',
    email: 'michael.thompson@example.com',
    phone: '+1 (555) 567-8901',
    age: 55,
    condition: 'COPD',
    status: 'monitoring',
    room: '201',
    admissionDate: '2024-02-28',
    lastCheckup: '2024-05-04',
    vitals: {
      heartRate: 80,
      bloodPressure: '130/85',
      temperature: 98.7,
      oxygenLevel: 92,
    },
    medications: ['Albuterol inhaler', 'Tiotropium inhaler'],
    allergies: ['NSAIDs'],
  },
]

export const usePatientStore = create<PatientState>((set) => ({
  patients: mockPatients,
  isLoading: false,
  error: null,
  viewType: 'grid',
  setPatients: (patients) => set({ patients }),
  addPatient: (patient) =>
    set((state) => ({
      patients: [...state.patients, patient],
    })),
  updatePatient: (id, updates) =>
    set((state) => ({
      patients: state.patients.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),
  deletePatient: (id) =>
    set((state) => ({
      patients: state.patients.filter((p) => p.id !== id),
    })),
  setViewType: (type) => set({ viewType: type }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))
