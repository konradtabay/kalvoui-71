import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface OutcomeData {
  name: string
  value: number
  color: string
}

interface OutcomeChartProps {
  dailyData: OutcomeData[]
  weeklyData: OutcomeData[]
  monthlyData: OutcomeData[]
}

export function OutcomeChart({ dailyData, weeklyData, monthlyData }: OutcomeChartProps) {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('monthly')
  
  const data = {
    daily: dailyData,
    weekly: weeklyData,
    monthly: monthlyData
  }[timeframe]
  
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  const timeframeButtons = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' }
  ] as const

  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const percentage = ((data.value / total) * 100).toFixed(1)
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground">{data.payload.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value} calls ({percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  const renderLegend = (props: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {props.payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  const cn = (...inputs: (string | undefined)[]) => {
    return inputs.filter(Boolean).join(' ')
  }

  return (
    <Card className="bg-gradient-card border-0 shadow-custom-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div>
          <CardTitle className="text-lg font-semibold">KPI Overview</CardTitle>
          <p className="text-sm text-muted-foreground">
            Total calls: <span className="font-medium text-foreground">{total}</span>
          </p>
        </div>
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
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={renderTooltip} />
              <Legend content={renderLegend} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-3 mt-6">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1)
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {item.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-foreground">
                    {item.value}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {percentage}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}