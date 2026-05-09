import { ProtectedRoute } from '@/components/ProtectedRoute'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { usePatientStore } from '@/lib/stores/patientStore'
import { useNotificationStore } from '@/lib/stores/notificationStore'
import { Users, AlertCircle, TrendingUp, Activity } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const { patients } = usePatientStore()
  const { addNotification } = useNotificationStore()
  const [stats, setStats] = useState({
    totalPatients: 0,
    criticalCases: 0,
    monitoringCases: 0,
    recoveryRate: 0,
  })

  useEffect(() => {
    // Calculate stats
    const critical = patients.filter((p) => p.status === 'critical').length
    const monitoring = patients.filter((p) => p.status === 'monitoring').length
    const stable = patients.filter((p) => p.status === 'stable').length

    setStats({
      totalPatients: patients.length,
      criticalCases: critical,
      monitoringCases: monitoring,
      recoveryRate: stable > 0 ? Math.round((stable / patients.length) * 100) : 0,
    })
  }, [patients])

  const handleSendNotification = (type: 'success' | 'info' | 'warning' | 'error') => {
    addNotification({
      title: `Test ${type} Notification`,
      message: `This is a test ${type} notification from the dashboard.`,
      type,
    })
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome to Dashboard</h1>
            <p className="text-muted-foreground">
              Real-time overview of your healthcare facility
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Patients */}
            <Card className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Total Patients</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalPatients}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">+12% from last month</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </Card>

            {/* Critical Cases */}
            <Card className="p-6 hover:shadow-md transition-shadow border-red-200 dark:border-red-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Critical Cases</p>
                  <p className="text-3xl font-bold mt-2">{stats.criticalCases}</p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">Require attention</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </Card>

            {/* Under Monitoring */}
            <Card className="p-6 hover:shadow-md transition-shadow border-yellow-200 dark:border-yellow-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Under Monitoring</p>
                  <p className="text-3xl font-bold mt-2">{stats.monitoringCases}</p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Active monitoring</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </Card>

            {/* Recovery Rate */}
            <Card className="p-6 hover:shadow-md transition-shadow border-green-200 dark:border-green-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Stable Patients</p>
                  <p className="text-3xl font-bold mt-2">{stats.recoveryRate}%</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">Recovery rate</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div>
                    <p className="font-medium text-sm">New patient admitted</p>
                    <p className="text-xs text-muted-foreground">Room 301 - Acute Care Unit</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <div>
                    <p className="font-medium text-sm">Patient discharged</p>
                    <p className="text-xs text-muted-foreground">Room 215 - Recovery complete</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <div>
                    <p className="font-medium text-sm">Critical alert</p>
                    <p className="text-xs text-muted-foreground">Room 102 - Vital signs abnormal</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Test Notifications */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Test Notifications</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Click below to test notifications system:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleSendNotification('info')}
                >
                  Info
                </Button>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleSendNotification('success')}
                >
                  Success
                </Button>
                <Button
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700"
                  onClick={() => handleSendNotification('warning')}
                >
                  Warning
                </Button>
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => handleSendNotification('error')}
                >
                  Error
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
