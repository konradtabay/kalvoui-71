import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit3, Save } from "lucide-react"
import { useState, useEffect } from "react"

interface Goal {
  label: string
  current: number
  target: number
  unit: string
}

interface GoalTrackerProps {
  goals: Goal[]
  onUpdateGoals?: (goals: Goal[]) => void
}

export function GoalTracker({ goals, onUpdateGoals }: GoalTrackerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editedGoals, setEditedGoals] = useState<Goal[]>(goals)
  const [animatedValues, setAnimatedValues] = useState<number[]>(goals.map(() => 0))

  // Animate progress bars on mount
  useEffect(() => {
    const timers = goals.map((goal, index) => {
      const targetPercentage = Math.min((goal.current / goal.target) * 100, 100)
      
      return setTimeout(() => {
        const duration = 400 // 0.4 second animation (even faster)
        const steps = 60 // 60 fps
        const increment = targetPercentage / steps
        let currentStep = 0
        
        const interval = setInterval(() => {
          currentStep++
          const newValue = Math.min(increment * currentStep, targetPercentage)
          
          setAnimatedValues(prev => {
            const newValues = [...prev]
            newValues[index] = newValue
            return newValues
          })
          
          if (currentStep >= steps) {
            clearInterval(interval)
          }
        }, duration / steps)
        
        return interval
      }, index * 100) // Stagger each animation by 100ms (even faster)
    })
    
    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [goals])

  const getProgressVariant = (percentage: number) => {
    if (percentage >= 90) return "success"
    if (percentage >= 70) return "warning" 
    return "default"
  }

  const handleSaveGoals = () => {
    onUpdateGoals?.(editedGoals)
    setIsOpen(false)
  }

  const updateGoalTarget = (index: number, newTarget: number) => {
    const updated = [...editedGoals]
    updated[index] = { ...updated[index], target: Math.max(1, newTarget) }
    setEditedGoals(updated)
  }

  return (
    <Card className="bg-gradient-card border-0 shadow-custom-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Weekly Goals</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 hover:bg-primary/10"
              onClick={() => setEditedGoals(goals)}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Weekly Goals</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {editedGoals.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <Label className="text-sm font-medium">
                    {goal.label} Target
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={goal.target}
                      onChange={(e) => updateGoalTarget(index, parseInt(e.target.value) || 1)}
                      className="flex-1"
                      min="1"
                    />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {goal.unit}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Current: {goal.current} {goal.unit}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveGoals}>
                <Save className="h-4 w-4 mr-2" />
                Save Goals
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-6">
        {goals.map((goal, index) => {
          const percentage = Math.min((goal.current / goal.target) * 100, 100)
          const animatedPercentage = animatedValues[index] || 0
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {goal.label}
                </span>
                <span className="text-sm text-muted-foreground">
                  {goal.current} / {goal.target} {goal.unit}
                </span>
              </div>
              <Progress 
                value={animatedPercentage} 
                variant={getProgressVariant(percentage)}
                className="h-2"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {percentage.toFixed(0)}% complete
                </span>
                <span className={cn(
                  "text-xs font-medium",
                  percentage >= 100 ? "text-success" : "text-muted-foreground"
                )}>
                  {percentage >= 100 ? "Goal achieved!" : `${(goal.target - goal.current)} ${goal.unit} remaining`}
                </span>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

function cn(...inputs: (string | undefined)[]) {
  return inputs.filter(Boolean).join(' ')
}