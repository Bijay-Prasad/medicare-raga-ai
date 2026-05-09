import { ProtectedRoute } from '@/components/ProtectedRoute'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePatientStore, Patient } from '@/lib/stores/patientStore'
import { Grid3x3, List, Search, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

function getStatusColor(status: string) {
  switch (status) {
    case 'critical':
      return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
    case 'monitoring':
      return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
    default:
      return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'critical':
      return <AlertCircle className="w-4 h-4" />
    case 'monitoring':
      return <Clock className="w-4 h-4" />
    default:
      return <CheckCircle className="w-4 h-4" />
  }
}

export default function PatientsPage() {
  const { patients, viewType, setViewType } = usePatientStore()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPatients = useMemo(
    () =>
      patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [patients, searchTerm]
  )

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Patient Management</h1>
              <p className="text-muted-foreground">
                Manage and monitor all patients in your facility
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewType === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewType('grid')}
                title="Grid View"
              >
                <Grid3x3 className="w-5 h-5" />
              </Button>
              <Button
                variant={viewType === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewType('list')}
                title="List View"
              >
                <List className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 text-sm text-muted-foreground">
            {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''} found
          </div>

          {/* Grid View */}
          {viewType === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPatients.map((patient) => (
                <Link key={patient.id} to={`/patients/${patient.id}`}>
                  <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{patient.name}</h3>
                        <p className="text-xs text-muted-foreground">{patient.email}</p>
                      </div>
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                          patient.status
                        )}`}
                      >
                        {getStatusIcon(patient.status)}
                        <span className="capitalize">{patient.status}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-medium">Condition:</span> {patient.condition}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium">Room:</span> {patient.room}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium">Age:</span> {patient.age} years
                      </p>
                    </div>

                    <div className="mt-auto pt-4 border-t border-border">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Heart Rate</p>
                          <p className="font-semibold">{patient.vitals.heartRate} bpm</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">O₂ Level</p>
                          <p className="font-semibold">{patient.vitals.oxygenLevel}%</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* List View */}
          {viewType === 'list' && (
            <div className="space-y-2">
              {filteredPatients.map((patient) => (
                <Link key={patient.id} to={`/patients/${patient.id}`}>
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <h3 className="font-semibold">{patient.name}</h3>
                            <p className="text-sm text-muted-foreground">{patient.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
                        <div className="text-muted-foreground">
                          <span className="font-medium">{patient.condition}</span>
                          {' | '}
                          <span>Room {patient.room}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">HR: {patient.vitals.heartRate}</span>
                          <span className="text-muted-foreground">O₂: {patient.vitals.oxygenLevel}%</span>
                        </div>

                        <div
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            patient.status
                          )}`}
                        >
                          {getStatusIcon(patient.status)}
                          <span className="capitalize">{patient.status}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {filteredPatients.length === 0 && (
            <Card className="p-12 text-center">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No patients found matching your search.</p>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
