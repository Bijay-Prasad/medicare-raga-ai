'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MoreVertical, Phone, MessageSquare } from 'lucide-react'

interface Patient {
  id: string
  name: string
  initials: string
  condition: string
  status: 'stable' | 'critical' | 'monitoring'
  nextCheckup: string
  room: string
}

const patients: Patient[] = [
  {
    id: '1',
    name: 'John Patterson',
    initials: 'JP',
    condition: 'Post-Surgery Recovery',
    status: 'stable',
    nextCheckup: '2 hours',
    room: '302'
  },
  {
    id: '2',
    name: 'Sarah Mitchell',
    initials: 'SM',
    condition: 'Hypertension Monitoring',
    status: 'monitoring',
    nextCheckup: '4 hours',
    room: '215'
  },
  {
    id: '3',
    name: 'Michael Chen',
    initials: 'MC',
    condition: 'Cardiology Consultation',
    status: 'stable',
    nextCheckup: '1 hour',
    room: '412'
  },
  {
    id: '4',
    name: 'Emma Thompson',
    initials: 'ET',
    condition: 'Respiratory Support',
    status: 'critical',
    nextCheckup: 'Immediate',
    room: '501'
  },
  {
    id: '5',
    name: 'David Rodriguez',
    initials: 'DR',
    condition: 'Routine Checkup',
    status: 'stable',
    nextCheckup: '3 hours',
    room: '118'
  }
]

export function PatientList() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'
      case 'critical':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
      case 'monitoring':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
      default:
        return 'bg-gray-500/10 text-gray-600'
    }
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block border border-border/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 overflow-hidden rounded-lg">
        <div className="p-4 sm:p-6 border-b border-border">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1">Active Patients</h3>
          <p className="text-sm text-muted-foreground">Monitor and manage patient cases</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr className="border-b border-border">
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Patient</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Condition</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Room</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Next Checkup</th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {patients.map((patient) => (
                <tr 
                  key={patient.id}
                  className="hover:bg-muted/20 transition-colors duration-200"
                >
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Avatar className="h-8 w-8 border-2 border-primary/20 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs font-semibold">
                          {patient.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{patient.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <p className="text-sm text-muted-foreground truncate">{patient.condition}</p>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <Badge 
                      variant="outline"
                      className={`${getStatusColor(patient.status)} text-xs`}
                    >
                      {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <p className="text-sm font-medium text-foreground">#{patient.room}</p>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <p className="text-sm text-muted-foreground">{patient.nextCheckup}</p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 sm:gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 sm:px-6 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10">
          <p className="text-sm text-muted-foreground">Showing {patients.length} active patients</p>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3 sm:space-y-4">
        {patients.map((patient) => (
          <Card 
            key={patient.id}
            className="p-4 border border-border/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
          >
            <div className="space-y-3">
              {/* Header with Patient Info */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-10 w-10 border-2 border-primary/20 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-semibold text-xs">
                      {patient.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{patient.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{patient.condition}</p>
                  </div>
                </div>
                <Badge 
                  variant="outline"
                  className={`${getStatusColor(patient.status)} text-xs flex-shrink-0`}
                >
                  {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                </Badge>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-border/30">
                <div>
                  <p className="text-xs text-muted-foreground">Room</p>
                  <p className="text-sm font-semibold text-foreground">#{patient.room}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Next Checkup</p>
                  <p className="text-sm font-semibold text-foreground">{patient.nextCheckup}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        <div className="flex items-center justify-center pt-2">
          <Button variant="outline" size="sm" className="w-full">
            View All Patients
          </Button>
        </div>
      </div>
    </>
  )
}
