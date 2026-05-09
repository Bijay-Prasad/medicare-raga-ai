import { ProtectedRoute } from '@/components/ProtectedRoute'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Card } from '@/components/ui/card'
import { usePatientStore } from '@/lib/stores/patientStore'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function AnalyticsPage() {
  const { patients } = usePatientStore()

  // Patient Status Distribution
  const statusData = [
    {
      name: 'Stable',
      value: patients.filter((p) => p.status === 'stable').length,
      color: '#10b981',
    },
    {
      name: 'Monitoring',
      value: patients.filter((p) => p.status === 'monitoring').length,
      color: '#f59e0b',
    },
    {
      name: 'Critical',
      value: patients.filter((p) => p.status === 'critical').length,
      color: '#ef4444',
    },
  ]

  // Age Distribution
  const ageGroups = [
    { range: '18-30', count: patients.filter((p) => p.age >= 18 && p.age <= 30).length },
    { range: '31-45', count: patients.filter((p) => p.age >= 31 && p.age <= 45).length },
    { range: '46-60', count: patients.filter((p) => p.age >= 46 && p.age <= 60).length },
    { range: '60+', count: patients.filter((p) => p.age > 60).length },
  ]

  // Heart Rate Distribution
  const heartRateData = [
    { name: 'Low (<60)', count: patients.filter((p) => p.vitals.heartRate < 60).length },
    { name: 'Normal (60-100)', count: patients.filter((p) => p.vitals.heartRate >= 60 && p.vitals.heartRate <= 100).length },
    { name: 'High (>100)', count: patients.filter((p) => p.vitals.heartRate > 100).length },
  ]

  // Vital Signs Average
  const avgHeartRate = Math.round(
    patients.reduce((sum, p) => sum + p.vitals.heartRate, 0) / patients.length
  )
  const avgTemp = (
    patients.reduce((sum, p) => sum + p.vitals.temperature, 0) / patients.length
  ).toFixed(1)
  const avgO2 = Math.round(
    patients.reduce((sum, p) => sum + p.vitals.oxygenLevel, 0) / patients.length
  )

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Analytics &amp; Reports</h1>
            <p className="text-muted-foreground">
              Comprehensive data visualization and insights
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="p-6">
              <p className="text-muted-foreground text-sm">Average Heart Rate</p>
              <p className="text-3xl font-bold mt-2">{avgHeartRate}</p>
              <p className="text-xs text-muted-foreground mt-1">beats per minute</p>
            </Card>
            <Card className="p-6">
              <p className="text-muted-foreground text-sm">Average Temperature</p>
              <p className="text-3xl font-bold mt-2">{avgTemp}°F</p>
              <p className="text-xs text-muted-foreground mt-1">Fahrenheit</p>
            </Card>
            <Card className="p-6">
              <p className="text-muted-foreground text-sm">Average O₂ Level</p>
              <p className="text-3xl font-bold mt-2">{avgO2}%</p>
              <p className="text-xs text-muted-foreground mt-1">SpO₂ percentage</p>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Patient Status Distribution */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Patient Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Age Distribution */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Age Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ageGroups}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Heart Rate Categories */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Heart Rate Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={heartRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
