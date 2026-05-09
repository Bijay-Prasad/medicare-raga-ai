'use client'

import { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  icon: ReactNode
  title: string
  value: string | ReactNode
  change: string
  positive: boolean
  color: string
}

export function StatsCard({
  icon,
  title,
  value,
  change,
  positive,
  color
}: StatsCardProps) {
  return (
    <Card className="relative overflow-hidden border border-border/50 backdrop-blur-sm p-4 sm:p-6 group hover:border-primary/30 hover:shadow-lg transition-all duration-300">
      {/* Gradient background */}
      <div className={`absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-300`}></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
            {icon}
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold whitespace-nowrap">
            {positive ? (
              <>
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                <span className="text-green-600 dark:text-green-400">{change}</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 flex-shrink-0" />
                <span className="text-orange-600 dark:text-orange-400">{change}</span>
              </>
            )}
          </div>
        </div>
        
        <p className="text-xs sm:text-sm text-muted-foreground mb-2">{title}</p>
        <p className="text-2xl sm:text-3xl font-bold text-foreground">{value}</p>
      </div>
    </Card>
  )
}
