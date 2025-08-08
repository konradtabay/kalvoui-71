import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

interface TimePerformanceData {
  day: string
  calls: number
  pickups: number
  bookings: number
}

interface TimePerformanceProps {
  data: TimePerformanceData[]
}

export function TimePerformance({ data }: TimePerformanceProps) {
  const chartConfig = {
    calls: {
      label: "Calls",
      color: "hsl(var(--primary))",
    },
    pickups: {
      label: "Pickups", 
      color: "hsl(var(--success))",
    },
    bookings: {
      label: "Bookings",
      color: "hsl(var(--warning))",
    },
  }

  return (
    <Card className="bg-gradient-card border-0 shadow-custom-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Monthly Performance</CardTitle>
        <p className="text-sm text-muted-foreground">
          Daily activity breakdown by weekday
        </p>
        <p className="text-xs text-muted-foreground">
          Dials this month: <span className="font-medium text-foreground">{data.reduce((sum, item) => sum + item.calls, 0)}</span>
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <LineChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 40, bottom: 40 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              opacity={0.3}
            />
            <XAxis 
              dataKey="day" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={60}
              interval={Math.ceil(data.length / 6)}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickCount={5}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line 
              type="monotone"
              dataKey="calls" 
              name="Calls"
              stroke="var(--color-calls)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line 
              type="monotone"
              dataKey="pickups" 
              name="Pickups"
              stroke="var(--color-pickups)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line 
              type="monotone"
              dataKey="bookings" 
              name="Bookings"
              stroke="var(--color-bookings)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}