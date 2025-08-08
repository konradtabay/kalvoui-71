import { GoalTracker } from "@/components/dashboard/goal-tracker"
import { KPIOverview } from "@/components/dashboard/kpi-overview"
import { OutcomeChart } from "@/components/dashboard/outcome-chart"
import { TimePerformance } from "@/components/dashboard/time-performance"
import { useState } from "react"

// Mock data - in a real app, this would come from your API
const initialGoals = [
  { label: "Dials", current: 156, target: 200, unit: "calls" },
  { label: "Conversations", current: 45, target: 60, unit: "talks" },
  { label: "Bookings", current: 12, target: 15, unit: "meetings" }
]

const mockKPIs = {
  daily: {
    dials: 25,
    pickups: 12,
    pitches: 8,
    bookings: 3,
    dialsPerHour: 6.2,
    bookingsPerHour: 0.7,
    totalTime: "4h 15m"
  },
  weekly: {
    dials: 156,
    pickups: 78,
    pitches: 52,
    bookings: 12,
    dialsPerHour: 5.8,
    bookingsPerHour: 0.6,
    totalTime: "26h 45m"
  },
  monthly: {
    dials: 680,
    pickups: 340,
    pitches: 220,
    bookings: 54,
    dialsPerHour: 6.1,
    bookingsPerHour: 0.7,
    totalTime: "112h 30m"
  }
}

const mockOutcomeData = {
  daily: [
    { name: "Not Interested", value: 8, color: "hsl(var(--destructive))" },
    { name: "Pitched", value: 5, color: "hsl(var(--primary))" },
    { name: "Callback", value: 3, color: "hsl(var(--warning))" },
    { name: "Booked", value: 2, color: "hsl(var(--success))" },
    { name: "No Answer", value: 7, color: "hsl(var(--muted-foreground))" }
  ],
  weekly: [
    { name: "Not Interested", value: 32, color: "hsl(var(--destructive))" },
    { name: "Pitched", value: 25, color: "hsl(var(--primary))" },
    { name: "Callback", value: 15, color: "hsl(var(--warning))" },
    { name: "Booked", value: 8, color: "hsl(var(--success))" },
    { name: "No Answer", value: 20, color: "hsl(var(--muted-foreground))" }
  ],
  monthly: [
    { name: "Not Interested", value: 45, color: "hsl(var(--destructive))" },
    { name: "Pitched", value: 32, color: "hsl(var(--primary))" },
    { name: "Callback", value: 18, color: "hsl(var(--warning))" },
    { name: "Booked", value: 12, color: "hsl(var(--success))" },
    { name: "No Answer", value: 25, color: "hsl(var(--muted-foreground))" }
  ]
}

const mockWeekdayData = [
  { day: "Jan 1", calls: 145, pickups: 72, bookings: 18 },
  { day: "Jan 2", calls: 138, pickups: 69, bookings: 15 },
  { day: "Jan 3", calls: 152, pickups: 81, bookings: 22 },
  { day: "Jan 4", calls: 141, pickups: 75, bookings: 19 },
  { day: "Jan 5", calls: 104, pickups: 43, bookings: 12 },
  { day: "Jan 6", calls: 128, pickups: 58, bookings: 14 },
  { day: "Jan 7", calls: 135, pickups: 65, bookings: 16 },
  { day: "Jan 8", calls: 149, pickups: 73, bookings: 20 },
  { day: "Jan 9", calls: 143, pickups: 71, bookings: 17 },
  { day: "Jan 10", calls: 131, pickups: 62, bookings: 15 },
  { day: "Jan 11", calls: 156, pickups: 78, bookings: 23 },
  { day: "Jan 12", calls: 147, pickups: 74, bookings: 19 },
  { day: "Jan 13", calls: 139, pickups: 67, bookings: 16 },
  { day: "Jan 14", calls: 142, pickups: 70, bookings: 18 },
  { day: "Jan 15", calls: 158, pickups: 82, bookings: 24 },
  { day: "Jan 16", calls: 134, pickups: 64, bookings: 15 },
  { day: "Jan 17", calls: 148, pickups: 76, bookings: 21 },
  { day: "Jan 18", calls: 146, pickups: 72, bookings: 19 },
  { day: "Jan 19", calls: 153, pickups: 79, bookings: 22 },
  { day: "Jan 20", calls: 137, pickups: 66, bookings: 16 },
  { day: "Jan 21", calls: 144, pickups: 71, bookings: 18 },
  { day: "Jan 22", calls: 150, pickups: 77, bookings: 20 },
  { day: "Jan 23", calls: 141, pickups: 68, bookings: 17 },
  { day: "Jan 24", calls: 155, pickups: 81, bookings: 23 },
  { day: "Jan 25", calls: 132, pickups: 63, bookings: 14 },
  { day: "Jan 26", calls: 147, pickups: 73, bookings: 19 },
  { day: "Jan 27", calls: 149, pickups: 75, bookings: 21 },
  { day: "Jan 28", calls: 143, pickups: 70, bookings: 18 },
  { day: "Jan 29", calls: 151, pickups: 78, bookings: 22 },
  { day: "Jan 30", calls: 145, pickups: 72, bookings: 20 }
]

export default function Dashboard() {
  const [goals, setGoals] = useState(initialGoals)

  const handleUpdateGoals = (updatedGoals: typeof initialGoals) => {
    setGoals(updatedGoals)
    // In a real app, you would also save this to your backend
    console.log("Goals updated:", updatedGoals)
  }

  return (
    <div className="flex-1 space-y-6 p-6 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, John! Here's your performance overview.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <GoalTracker 
            goals={goals}
            onUpdateGoals={handleUpdateGoals}
          />
        </div>
        
        <div className="md:col-span-2">
          <KPIOverview 
            dailyKPIs={mockKPIs.daily}
            weeklyKPIs={mockKPIs.weekly}
            monthlyKPIs={mockKPIs.monthly}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <OutcomeChart 
          dailyData={mockOutcomeData.daily}
          weeklyData={mockOutcomeData.weekly}
          monthlyData={mockOutcomeData.monthly}
        />
        <TimePerformance data={mockWeekdayData} />
      </div>
    </div>
  )
}