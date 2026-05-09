'use client'

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const data = [
  { time: '00:00', heartRate: 72, bloodOxygen: 98, temperature: 36.8 },
  { time: '04:00', heartRate: 68, bloodOxygen: 97, temperature: 36.7 },
  { time: '08:00', heartRate: 75, bloodOxygen: 98, temperature: 36.9 },
  { time: '12:00', heartRate: 82, bloodOxygen: 97, temperature: 37.1 },
  { time: '16:00', heartRate: 78, bloodOxygen: 98, temperature: 36.8 },
  { time: '20:00', heartRate: 74, bloodOxygen: 99, temperature: 36.7 },
  { time: '24:00', heartRate: 70, bloodOxygen: 98, temperature: 36.6 }
]

export function HealthMetricsChart() {
  return (
    <>
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">Health Metrics</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">24-hour patient vital signs tracking</p>
      </div>
      
      <ResponsiveContainer width="100%" height={250} minWidth={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorHR" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorBO" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="var(--border)" 
            opacity={0.5}
            vertical={false}
          />
          <XAxis 
            dataKey="time" 
            stroke="var(--muted-foreground)"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="var(--muted-foreground)"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
            formatter={(value: number) => value.toFixed(1)}
          />
          <Area 
            type="monotone" 
            dataKey="heartRate" 
            stroke="hsl(var(--primary))" 
            fillOpacity={1} 
            fill="url(#colorHR)"
            strokeWidth={2}
            name="Heart Rate"
          />
          <Area 
            type="monotone" 
            dataKey="bloodOxygen" 
            stroke="hsl(var(--accent))" 
            fillOpacity={1} 
            fill="url(#colorBO)"
            strokeWidth={2}
            name="Blood Oxygen"
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  )
}
