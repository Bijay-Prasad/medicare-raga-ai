import { ProtectedRoute } from '@/components/ProtectedRoute'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { usePatientStore } from '@/lib/stores/patientStore'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, AlertCircle, Heart, Droplet, Thermometer, Wind } from 'lucide-react'
import { toast } from 'sonner'

export default function PatientDetailsPage() {
  const navigate = useNavigate()
  const { id: patientId } = useParams<{ id: string }>()
  const { patients } = usePatientStore()

  const patient = patients.find((p) => p.id === patientId)

  if (!patient) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Card className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Patient not found</p>
            </Card>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100'
      case 'monitoring':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100'
      default:
        return 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100'
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>

          {/* Patient Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{patient.name}</h1>
                <p className="text-muted-foreground">{patient.email}</p>
              </div>
              <div className={`px-4 py-2 rounded-lg font-semibold capitalize ${getStatusColor(patient.status)}`}>
                {patient.status}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Full Name</p>
                  <p className="font-medium">{patient.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{patient.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{patient.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Age</p>
                  <p className="font-medium">{patient.age} years</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Medical Information</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Condition</p>
                  <p className="font-medium">{patient.condition}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Room Number</p>
                  <p className="font-medium">{patient.room}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Admission Date</p>
                  <p className="font-medium">{new Date(patient.admissionDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Checkup</p>
                  <p className="font-medium">{new Date(patient.lastCheckup).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Vital Signs */}
          <Card className="p-6 mb-8">
            <h2 className="text-lg font-semibold mb-6">Current Vital Signs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Heart Rate */}
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <p className="text-sm text-muted-foreground">Heart Rate</p>
                </div>
                <p className="text-2xl font-bold">{patient.vitals.heartRate}</p>
                <p className="text-xs text-muted-foreground mt-1">beats per minute</p>
              </div>

              {/* Blood Pressure */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Droplet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm text-muted-foreground">Blood Pressure</p>
                </div>
                <p className="text-2xl font-bold">{patient.vitals.bloodPressure}</p>
                <p className="text-xs text-muted-foreground mt-1">mmHg</p>
              </div>

              {/* Temperature */}
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  <p className="text-sm text-muted-foreground">Temperature</p>
                </div>
                <p className="text-2xl font-bold">{patient.vitals.temperature}°F</p>
                <p className="text-xs text-muted-foreground mt-1">Fahrenheit</p>
              </div>

              {/* Oxygen Level */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <p className="text-sm text-muted-foreground">Oxygen Level</p>
                </div>
                <p className="text-2xl font-bold">{patient.vitals.oxygenLevel}%</p>
                <p className="text-xs text-muted-foreground mt-1">SpO₂</p>
              </div>
            </div>
          </Card>

          {/* Medications & Allergies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Medications */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Current Medications</h2>
              <div className="space-y-2">
                {patient.medications.length > 0 ? (
                  patient.medications.map((med, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 mt-2 shrink-0" />
                      <p className="text-sm">{med}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No medications recorded</p>
                )}
              </div>
            </Card>

            {/* Allergies */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Known Allergies</h2>
              <div className="space-y-2">
                {patient.allergies.length > 0 ? (
                  patient.allergies.map((allergy, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-1 shrink-0" />
                      <p className="text-sm font-medium">{allergy}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No known allergies</p>
                )}
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Edit Patient Information
            </Button>
            <Button variant="outline">
              Print Report
            </Button>
            <Button
              variant="destructive"
              onClick={() => toast.error('Delete functionality not implemented in demo')}
            >
              Delete Patient
            </Button>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
