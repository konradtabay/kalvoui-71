import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    isPositive: boolean
  }
  subtitle?: string
  className?: string
}

export function StatsCard({ title, value, change, subtitle, className }: StatsCardProps) {
  return (
    <Card className={cn(
      "bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-300",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-foreground">{value}</p>
              {change && (
                <div className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  change.isPositive ? "text-success" : "text-destructive"
                )}>
                  {change.isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {Math.abs(change.value)}%
                </div>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}