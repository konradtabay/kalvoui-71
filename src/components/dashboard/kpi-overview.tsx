import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatsCard } from "./stats-card"

interface KPIData {
  dials: number
  pickups: number
  pitches: number
  bookings: number
  dialsPerHour: number
  bookingsPerHour: number
  totalTime: string
}

interface KPIOverviewProps {
  dailyKPIs: KPIData
  weeklyKPIs: KPIData
  monthlyKPIs: KPIData
}

export function KPIOverview({ dailyKPIs, weeklyKPIs, monthlyKPIs }: KPIOverviewProps) {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('monthly')
  
  const currentKPIs = {
    daily: dailyKPIs,
    weekly: weeklyKPIs,
    monthly: monthlyKPIs
  }[timeframe]

  const timeframeButtons = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' }
  ] as const

  return (
    <Card className="bg-gradient-card border-0 shadow-custom-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-lg font-semibold">Call Outcomes</CardTitle>
        <div className="flex bg-muted rounded-lg p-1">
          {timeframeButtons.map((button) => (
            <Button
              key={button.key}
              variant={timeframe === button.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeframe(button.key)}
              className={cn(
                "text-xs px-3 py-1.5 h-auto",
                timeframe === button.key 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "hover:bg-background/50"
              )}
            >
              {button.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Dials"
            value={currentKPIs.dials}
            change={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Pickups"
            value={currentKPIs.pickups}
            change={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Pitches"
            value={currentKPIs.pitches}
            change={{ value: 5, isPositive: false }}
          />
          <StatsCard
            title="Bookings"
            value={currentKPIs.bookings}
            change={{ value: 22, isPositive: true }}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Dials per Hour"
            value={currentKPIs.dialsPerHour}
            subtitle="Average rate"
          />
          <StatsCard
            title="Bookings per Hour"
            value={currentKPIs.bookingsPerHour.toFixed(1)}
            subtitle="Conversion rate"
          />
          <StatsCard
            title="Total Time"
            value={currentKPIs.totalTime}
            subtitle={`This ${timeframe.slice(0, -2)}`}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function cn(...inputs: (string | undefined)[]) {
  return inputs.filter(Boolean).join(' ')
}