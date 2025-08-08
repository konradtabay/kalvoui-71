import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { 
  Phone, 
  PhoneCall, 
  Play, 
  Square, 
  Clock, 
  Target, 
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  Timer,
  Activity,
  PhoneIncoming,
  Calendar,
  Mail,
  MessageSquare,
  FileText,
  Edit3,
  TestTube,
  Send,
  X
} from "lucide-react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

// Mock data
const mockStats = {
  callsMade: 47,
  leadsInQueue: 9,
  sessionTime: "02:34:12",
  status: "Active",
  pickupRate: 68,
  conversionRate: 12,
  callsPerHour: 18,
  targetCalls: 200,
  todayProgress: 24,
  activeLines: 3,
  maxLines: 5
}

const mockLeads = [
  { 
    id: 1, 
    name: "Jonathan Minerick", 
    phone: "+14167288572", 
    lastContact: "Never",
    tags: []
  },
  { 
    id: 2, 
    name: "Sean Stanfield", 
    phone: "+16473269469", 
    lastContact: "2 days ago",
    tags: ["Call back"]
  },
  { 
    id: 3, 
    name: "Alex Thompson", 
    phone: "+14167288573", 
    lastContact: "1 week ago",
    tags: []
  },
  { 
    id: 4, 
    name: "Maria Garcia", 
    phone: "+16473269470", 
    lastContact: "Never",
    tags: ["Abort"]
  },
  { 
    id: 5, 
    name: "David Chen", 
    phone: "+14167288574", 
    lastContact: "3 days ago",
    tags: []
  }
]

const mockActiveDialsRinging = [
  {
    id: 1,
    name: "Sean Stanfield",
    phone: "+16473269469",
    from: "+19567073865",
    status: "Ringing",
    duration: "00:34",
    attempt: 1,
    lineNumber: 1,
    leadStatus: "Call back"
  },
  {
    id: 2,
    name: "Jonathan Minerick",
    phone: "+14167288572",
    from: "+19567073866",
    status: "Ringing",
    duration: "00:21",
    attempt: 1,
    lineNumber: 2,
    leadStatus: null
  },
  {
    id: 3,
    name: "Maria Garcia",
    phone: "+14167288573",
    from: "+19567073867",
    status: "Ringing",
    duration: "00:12",
    attempt: 1,
    lineNumber: 3,
    leadStatus: "Abort"
  }
]

const mockConnectedCall = {
  id: 1,
  name: "Sean Stanfield",
  phone: "+16473269469",
  from: "+19567073865",
  status: "Connected",
  duration: "02:34",
  attempt: 1,
  lineNumber: 1
}

const mockRecentResults = [
  { name: "Mike Johnson", result: "Booked", time: "2 min ago" },
  { name: "Sarah Wilson", result: "No Answer", time: "5 min ago" },
  { name: "Tom Brown", result: "Not Interested", time: "8 min ago" },
]

export default function Dialer() {
  const [testState, setTestState] = useState<'idle' | 'ringing' | 'connected' | 'call-outcome'>('idle')
  const [notes, setNotes] = useState('')
  const [email, setEmail] = useState('')
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [callbackDialogOpen, setCallbackDialogOpen] = useState(false)
  const progressPercentage = (mockStats.callsMade / mockStats.targetCalls) * 100
  const [animatedProgress, setAnimatedProgress] = useState(0)
  
  // Debug settings - in a real app, this would come from a settings context/store
  const [debugLogsEnabled, setDebugLogsEnabled] = useState(false)
  const [debugLogs, setDebugLogs] = useState([
    { timestamp: new Date().toISOString(), level: 'info', message: 'Dialer initialized' },
    { timestamp: new Date().toISOString(), level: 'debug', message: 'Loading lead queue...' },
    { timestamp: new Date().toISOString(), level: 'success', message: '9 leads loaded into queue' },
  ])

  // Animate progress bar on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 500 // 0.5 second animation
      const steps = 60 // 60 fps
      const increment = progressPercentage / steps
      let currentStep = 0
      
      const interval = setInterval(() => {
        currentStep++
        const newValue = Math.min(increment * currentStep, progressPercentage)
        
        setAnimatedProgress(newValue)
        
        if (currentStep >= steps) {
          clearInterval(interval)
        }
      }, duration / steps)
      
      return interval
    }, 200) // Small delay before starting animation
    
    return () => clearTimeout(timer)
  }, [progressPercentage])

  const addDebugLog = (level: 'info' | 'debug' | 'success' | 'warning' | 'error', message: string) => {
    if (!debugLogsEnabled) return
    
    const newLog = {
      timestamp: new Date().toISOString(),
      level,
      message
    }
    
    setDebugLogs(prev => [newLog, ...prev.slice(0, 49)]) // Keep last 50 logs
  }

  const getNextTestState = () => {
    switch (testState) {
      case 'idle': return 'ringing'
      case 'ringing': return 'connected'
      case 'connected': return 'call-outcome'
      case 'call-outcome': return 'idle'
    }
  }

  const getTestStateLabel = () => {
    switch (testState) {
      case 'idle': return 'Idle State'
      case 'ringing': return 'Ringing State'
      case 'connected': return 'Connected State'
      case 'call-outcome': return 'Call Outcome State'
    }
  }

  // Enhanced test state handler with debug logging
  const handleTestStateChange = () => {
    const nextState = getNextTestState()
    addDebugLog('info', `State transition: ${testState} → ${nextState}`)
    setTestState(nextState)
  }

  return (
    <div className="flex-1 space-y-6 p-6 pt-6">
      {/* Header with Session Overview */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dialer
          </h1>
          <p className="text-muted-foreground">
            {mockStats.activeLines} phones active
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Test State Button */}
          <Card className="bg-gradient-card border-0 shadow-custom-md">
            <CardContent className="p-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestStateChange}
                className="flex items-center space-x-2"
              >
                <TestTube className="h-4 w-4" />
                <span className="text-xs">
                  Test: {getTestStateLabel()}
                </span>
              </Button>
            </CardContent>
          </Card>
          
          <div className="relative group">
            <Badge 
              variant={testState !== 'idle' ? "default" : "secondary"} 
              className={`px-3 py-1 cursor-pointer transition-all duration-500 hover:bg-primary/80 ${
                testState !== 'idle' 
                  ? 'bg-purple-600 hover:bg-purple-700 animate-[pulse_1s_ease-in-out_2]' 
                  : 'hover:bg-secondary/80'
              }`}
            >
              <Activity className={`w-3 h-3 mr-1 transition-all duration-500 ${
                testState !== 'idle' ? 'text-white' : ''
              }`} />
              <span className={`transition-all duration-500 ${
                testState !== 'idle' ? 'text-white' : ''
              }`}>
                {testState === 'idle' ? 'Idle' : 'Active'}
              </span>
            </Badge>
            
            {/* Hover Controls */}
            {testState !== 'idle' && (
              <div className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-10">
                <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg p-2 flex space-x-2 min-w-max">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs bg-background/50 hover:bg-background/70"
                  >
                    <PhoneIncoming className="h-3 w-3 mr-1" />
                    Next Lead
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="h-8 text-xs"
                  >
                    <Square className="h-3 w-3 mr-1" />
                    Stop
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">{mockStats.sessionTime}</div>
            <div className="text-xs text-muted-foreground">Session time</div>
          </div>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-card border-0 shadow-custom-md">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-primary" />
              <div>
                <div className="text-2xl font-bold text-foreground">{mockStats.callsMade}</div>
                <div className="text-xs text-muted-foreground">Calls Made</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-0 shadow-custom-md">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-warning" />
              <div>
                <div className="text-2xl font-bold text-foreground">{mockStats.leadsInQueue}</div>
                <div className="text-xs text-muted-foreground">In Queue</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-0 shadow-custom-md">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <div>
                <div className="text-2xl font-bold text-foreground">{mockStats.pickupRate}%</div>
                <div className="text-xs text-muted-foreground">Pickup Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-0 shadow-custom-md">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-primary" />
              <div>
                <div className="text-2xl font-bold text-foreground">{mockStats.conversionRate}%</div>
                <div className="text-xs text-muted-foreground">Booking</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-0 shadow-custom-md">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold text-foreground">{mockStats.callsPerHour}</div>
                <div className="text-xs text-muted-foreground">Calls/Hour</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
      </div>

      {/* Daily Progress */}
      <Card className="bg-gradient-card border-0 shadow-custom-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Daily Progress - {Math.round(progressPercentage)}%</span>
            <span className="text-sm text-muted-foreground">{mockStats.callsMade} / {mockStats.targetCalls} calls</span>
          </div>
          <Progress value={animatedProgress} className="h-2" />
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Idle State - Prominent Start Button */}
        {testState === 'idle' && (
          <div className="lg:col-span-5 flex flex-col items-center justify-center py-16 space-y-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500/20 to-primary/20 rounded-full flex items-center justify-center">
                <Play className="h-10 w-10 text-purple-500" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Ready to Start Dialing</h2>
              <p className="text-muted-foreground max-w-md">
                Click below to begin your multi-line dialing session. The system will automatically dial leads from your queue.
              </p>
            </div>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white h-16 px-12 text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 relative overflow-hidden group active:animate-[scale-out_0.8s_ease-in-out_forwards]"
              size="lg"
              onClick={handleTestStateChange}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center group-active:animate-[fade-out_0.6s_ease-in-out_forwards]">
                <Play className="h-8 w-8 mr-4" />
                Start Multi-Line Dialer
              </div>
              {/* Absorption effect - particles moving towards top-right */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-purple-300/60 rounded-full opacity-0 group-active:opacity-100 group-active:animate-[slide-out-right_0.8s_ease-in-out_forwards] group-active:scale-0"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-purple-200/80 rounded-full opacity-0 group-active:opacity-100 group-active:animate-[slide-out-right_0.9s_ease-in-out_0.1s_forwards] group-active:scale-0"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-purple-100 rounded-full opacity-0 group-active:opacity-100 group-active:animate-[slide-out-right_1s_ease-in-out_0.2s_forwards] group-active:scale-0"></div>
            </Button>
          </div>
        )}

        {/* Ringing State - Show 3 ringing calls */}
        {testState === 'ringing' && (
          <Card className="lg:col-span-5 bg-gradient-to-r from-warning/5 to-primary/5 border border-warning/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <PhoneCall className="h-5 w-5 text-warning animate-pulse" />
                  <CardTitle className="text-lg">Ringing Calls</CardTitle>
                </div>
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 font-semibold text-base">
                  {mockActiveDialsRinging.length} Ringing
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActiveDialsRinging.map((call) => (
                  <div key={call.id} className="bg-background/50 rounded-lg p-4 border border-border/30">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-warning/20 text-warning rounded-full flex items-center justify-center text-sm font-medium animate-pulse">
                            {call.lineNumber}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-base text-foreground">{call.name}</h4>
                              {call.leadStatus && (
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    call.leadStatus === "Call back" 
                                      ? "bg-blue-50 text-blue-700 border-blue-200" 
                                      : call.leadStatus === "Abort"
                                      ? "bg-red-50 text-red-700 border-red-200"
                                      : "bg-gray-50 text-gray-700 border-gray-200"
                                  }`}
                                >
                                  {call.leadStatus}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{call.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                          <span>Duration: {call.duration}</span>
                          <span>Line {call.lineNumber}</span>
                          <span>From: {call.from}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="destructive" size="sm">
                          <Square className="h-3 w-3 mr-1" />
                          End
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Connected State - Show single connected call + Live Notes */}
        {testState === 'connected' && (
          <Card className="lg:col-span-5 bg-gradient-to-r from-success/5 to-primary/5 border border-success/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <PhoneCall className="h-5 w-5 text-success" />
                  <CardTitle className="text-lg">Connected Call</CardTitle>
                </div>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  Connected
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Connected Call Display */}
                <div className="bg-success/5 rounded-lg p-6 border border-success/30">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-success/20 text-success rounded-full flex items-center justify-center text-lg font-bold">
                          <PhoneCall className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-foreground">{mockConnectedCall.name}</h3>
                          <p className="text-success font-medium">Connected</p>
                          <p className="text-sm text-muted-foreground">{mockConnectedCall.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 mt-3 text-sm">
                        <Badge className="bg-success/10 text-success border-success/20">
                          Duration: {mockConnectedCall.duration}
                        </Badge>
                        <span className="text-muted-foreground">Line {mockConnectedCall.lineNumber}</span>
                        <span className="text-muted-foreground">From: {mockConnectedCall.from}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="destructive" size="sm">
                        <Square className="h-4 w-4 mr-1" />
                        End Call
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Live Notes Section */}
                <div className="bg-background/50 rounded-lg p-4 border border-border/30">
                  <div className="flex items-center space-x-2 mb-3">
                    <Edit3 className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold text-foreground">Notes</h4>
                  </div>
                  <Textarea
                    placeholder="Take notes during your call..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Call Outcome State */}
        {testState === 'call-outcome' && (
          <Card className="lg:col-span-5 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Call Outcome</CardTitle>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  Post-Call
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 h-96">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Contact Info */}
                  <div className="bg-background/50 rounded-lg p-4 border border-border/30">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center text-lg font-bold">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-foreground">{mockConnectedCall.name}</h3>
                        <p className="text-sm text-muted-foreground">{mockConnectedCall.phone}</p>
                        <p className="text-xs text-muted-foreground">Call ended - Duration: {mockConnectedCall.duration}</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2 hover:bg-purple-50 hover:border-purple-300 transition-colors">
                      <Target className="h-6 w-6 text-purple-600" />
                      <span className="text-sm font-medium">Pitched</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2 hover:bg-red-50 hover:border-red-300 transition-colors">
                      <XCircle className="h-6 w-6 text-destructive" />
                      <span className="text-sm font-medium">Not Interested</span>
                    </Button>
                  </div>

                  {/* Communication Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="h-14 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 hover:border-blue-300 transition-colors">
                          <Mail className="h-5 w-5 text-primary" />
                          <span className="text-sm font-medium">Save Email</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Save Email for {mockConnectedCall.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Input
                              id="email"
                              type="email"
                              placeholder="Enter email address..."
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={() => {
                              // Handle email sending
                              setEmailDialogOpen(false)
                              setEmail('')
                            }}>
                              <Send className="h-4 w-4 mr-2" />
                              Save Email
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={callbackDialogOpen} onOpenChange={setCallbackDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="h-14 flex flex-col items-center justify-center space-y-2 hover:bg-yellow-50 hover:border-yellow-300 transition-colors">
                          <Calendar className="h-5 w-5 text-warning" />
                          <span className="text-sm font-medium">Call Back</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Schedule Callback for {mockConnectedCall.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" onClick={() => setCallbackDialogOpen(false)} className="hover:bg-gray-50 transition-colors">
                              <Clock className="h-4 w-4 mr-2" />
                              15 minutes
                            </Button>
                            <Button variant="outline" onClick={() => setCallbackDialogOpen(false)} className="hover:bg-gray-50 transition-colors">
                              <Clock className="h-4 w-4 mr-2" />
                              30 minutes
                            </Button>
                            <Button variant="outline" onClick={() => setCallbackDialogOpen(false)} className="hover:bg-gray-50 transition-colors">
                              <Clock className="h-4 w-4 mr-2" />
                              1 hour
                            </Button>
                            <Button variant="outline" onClick={() => setCallbackDialogOpen(false)} className="hover:bg-gray-50 transition-colors">
                              <Clock className="h-4 w-4 mr-2" />
                              2 hours
                            </Button>
                            <Button variant="outline" onClick={() => setCallbackDialogOpen(false)} className="hover:bg-gray-50 transition-colors">
                              <Calendar className="h-4 w-4 mr-2" />
                              Tomorrow
                            </Button>
                            <Button variant="outline" onClick={() => setCallbackDialogOpen(false)} className="hover:bg-gray-50 transition-colors">
                              <Calendar className="h-4 w-4 mr-2" />
                              Custom Time
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Wide Booked Button */}
                  <div className="mt-4">
                    <Button className="w-full h-16 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold transition-colors">
                      <CheckCircle className="h-6 w-6 mr-3" />
                      Booked
                    </Button>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Final Notes */}
                  <div className="bg-background/50 rounded-lg p-4 border border-border/30 h-full">
                    <div className="flex items-center space-x-2 mb-3">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <h4 className="font-semibold text-foreground">Notes</h4>
                    </div>
                    <Textarea
                      placeholder="Add any final notes about this call..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[280px] resize-none"
                    />
                    
                    {/* Action Button */}
                    <div className="flex justify-end mt-4">
                      <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
                        Next Lead
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lead Queue - Always visible, adjusts width based on state */}
        <Card className={`${testState === 'idle' ? 'lg:col-span-2' : 'lg:col-span-2'} bg-gradient-card border-0 shadow-custom-md`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-lg font-semibold">Lead Queue</CardTitle>
              </div>
              <Badge variant="secondary">{mockLeads.length} leads</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {mockLeads.map((lead, index) => {
              const isNextUp = index < mockStats.activeLines;
              return (
                <Card 
                  key={lead.id} 
                  className={`${
                    isNextUp 
                      ? "bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20" 
                      : "bg-background/50 border border-border/50 hover:bg-background/70"
                  } transition-colors`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 ${
                            isNextUp ? "bg-purple-500/20 text-purple-500" : "bg-primary/10 text-primary"
                          } rounded-full flex items-center justify-center text-sm font-medium`}>
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{lead.name}</h4>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>{lead.phone}</span>
                          <span>Last: {lead.lastContact}</span>
                          {isNextUp && (
                            <Badge variant="outline" className="text-xs text-purple-500 border-purple-500/30">
                              Next Up
                            </Badge>
                          )}
                        </div>
                        {/* Lead Tags */}
                        {lead.tags.length > 0 && (
                          <div className="mt-2 flex items-center space-x-2">
                             {lead.tags.map((tag, tagIndex) => (
                               <Badge 
                                 key={tagIndex}
                                 variant="outline"
                                 className={`text-xs ${
                                   tag === "Call back" 
                                     ? "bg-blue-50 text-blue-700 border-blue-200" 
                                     : tag === "Abort"
                                     ? "bg-red-50 text-red-700 border-red-200"
                                     : "bg-gray-50 text-gray-700 border-gray-200"
                                 }`}
                               >
                                 {tag}
                               </Badge>
                             ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>

      </div>

      {/* Debug Window - Only visible when debug is enabled */}
      {debugLogsEnabled && (
        <Card className="bg-gradient-card border-0 shadow-custom-md border-warning/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <TestTube className="h-5 w-5" />
              Debug Console
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black/90 text-green-400 font-mono text-sm rounded-lg p-4 h-64 overflow-y-auto">
              {debugLogs.map((log, index) => (
                <div key={index} className="mb-1">
                  <span className="text-gray-500">
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>{" "}
                  <span className={
                    log.level === 'error' ? 'text-red-400' :
                    log.level === 'warning' ? 'text-yellow-400' :
                    log.level === 'success' ? 'text-green-400' :
                    log.level === 'debug' ? 'text-blue-400' :
                    'text-white'
                  }>
                    [{log.level.toUpperCase()}]
                  </span>{" "}
                  <span className="text-green-400">{log.message}</span>
                </div>
              ))}
              {debugLogs.length === 0 && (
                <div className="text-gray-500 italic">Debug console ready...</div>
              )}
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="text-xs text-muted-foreground">
                {debugLogs.length} log entries
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setDebugLogs([])}
                className="gap-2"
              >
                <X className="h-3 w-3" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}