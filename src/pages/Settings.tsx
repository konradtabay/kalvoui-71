import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { 
  Phone, 
  Plus, 
  X, 
  Settings as SettingsIcon, 
  FileSpreadsheet, 
  Eye, 
  Save, 
  RotateCcw,
  Trash2,
  Bug,
  CheckCircle,
  XCircle,
  AlertTriangle,
  GripVertical,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for phone numbers
const mockPhoneNumbers = [
  { id: 1, number: "+19567073865", label: "Line 1", isActive: true, order: 1 },
  { id: 2, number: "+19567073866", label: "Line 2", isActive: true, order: 2 },
  { id: 3, number: "+19567073867", label: "Line 3", isActive: false, order: 3 },
]

// Mock Google Sheets preview data
const mockSheetData = [
  { name: "John Smith", phone: "+1-555-123-4567", email: "john@example.com", company: "Tech Corp" },
  { name: "Sarah Johnson", phone: "(555) 987-6543", email: "sarah@design.com", company: "Design Studio" },
  { name: "Mike Wilson", phone: "555.456.7890", email: "mike@marketing.com", company: "Marketing Inc" },
]

export default function Settings() {
  const { toast } = useToast()
  const [phoneNumbers, setPhoneNumbers] = useState(mockPhoneNumbers)
  const [newPhoneNumber, setNewPhoneNumber] = useState("")
  const [newPhoneLabel, setNewPhoneLabel] = useState("")
  const [addPhoneDialogOpen, setAddPhoneDialogOpen] = useState(false)
  const [draggedPhone, setDraggedPhone] = useState<number | null>(null)
  
  // Google Sheets config
  const [googleSheetId, setGoogleSheetId] = useState("1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms")
  const [sheetName, setSheetName] = useState("Class Data")
  const [nameColumn, setNameColumn] = useState("Student Name")
  const [phoneColumn, setPhoneColumn] = useState("Phone Number")
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  
  // Advanced settings
  const [debugLogsEnabled, setDebugLogsEnabled] = useState(false)

  const addPhoneNumber = () => {
    if (!newPhoneNumber.trim()) return
    
    const newPhone = {
      id: Math.max(...phoneNumbers.map(p => p.id)) + 1,
      number: newPhoneNumber,
      label: `Line ${phoneNumbers.length + 1}`,
      isActive: true,
      order: phoneNumbers.length + 1
    }
    
    setPhoneNumbers([...phoneNumbers, newPhone])
    setNewPhoneNumber("")
    setNewPhoneLabel("")
    setAddPhoneDialogOpen(false)
    
    toast({
      title: "Phone number added",
      description: `${newPhone.label} has been added to your phone lines.`,
    })
  }

  const handleDragStart = (e: React.DragEvent, phoneId: number) => {
    setDraggedPhone(phoneId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, dropTargetId: number) => {
    e.preventDefault()
    
    if (draggedPhone === null || draggedPhone === dropTargetId) return
    
    const draggedIndex = phoneNumbers.findIndex(p => p.id === draggedPhone)
    const dropTargetIndex = phoneNumbers.findIndex(p => p.id === dropTargetId)
    
    if (draggedIndex === -1 || dropTargetIndex === -1) return
    
    const newPhoneNumbers = [...phoneNumbers]
    const [draggedItem] = newPhoneNumbers.splice(draggedIndex, 1)
    newPhoneNumbers.splice(dropTargetIndex, 0, draggedItem)
    
    // Update orders and labels
    const updatedPhoneNumbers = newPhoneNumbers.map((phone, index) => ({
      ...phone,
      order: index + 1,
      label: `Line ${index + 1}`
    }))
    
    setPhoneNumbers(updatedPhoneNumbers)
    setDraggedPhone(null)
  }

  const togglePhoneActive = (id: number) => {
    setPhoneNumbers(prev => 
      prev.map(phone => 
        phone.id === id ? { ...phone, isActive: !phone.isActive } : phone
      )
    )
  }

  const removePhoneNumber = (id: number) => {
    setPhoneNumbers(prev => prev.filter(phone => phone.id !== id))
    toast({
      title: "Phone number removed",
      description: "The phone number has been removed from your configuration.",
    })
  }

  const saveGoogleSheetsConfig = () => {
    toast({
      title: "Configuration saved",
      description: "Google Sheets integration has been updated successfully.",
    })
  }

  const handleResetLeads = () => {
    toast({
      title: "Leads reset",
      description: "All lead data has been cleared and reset to default.",
    })
  }

  const handleResetDialer = () => {
    toast({
      title: "Dialer reset",
      description: "Dialer settings and session data have been reset.",
    })
  }

  const activePhoneCount = phoneNumbers.filter(p => p.isActive).length

  return (
    <div className="flex-1 space-y-6 p-6 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure your dialer and application settings</p>
        </div>
        <SettingsIcon className="h-8 w-8 text-muted-foreground" />
      </div>

      <Tabs defaultValue="phone-lines" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="phone-lines">Phone Lines</TabsTrigger>
          <TabsTrigger value="google-sheets">Google Sheets</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* Phone Lines Tab */}
        <TabsContent value="phone-lines" className="space-y-6">
          <Card className="bg-gradient-card border-0 shadow-custom-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Phone Configuration
                  </CardTitle>
                  <CardDescription>
                    Manage your dialer phone numbers and set which lines are active
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {activePhoneCount} Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Total: {phoneNumbers.length} lines • Active: {activePhoneCount} lines
                </div>
                <Dialog open={addPhoneDialogOpen} onOpenChange={setAddPhoneDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Phone Number
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Phone Number</DialogTitle>
                      <DialogDescription>
                        Add a new phone line to your dialer configuration.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="+1 (555) 123-4567"
                          value={newPhoneNumber}
                          onChange={(e) => setNewPhoneNumber(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="label">Label (Optional)</Label>
                        <Input
                          id="label"
                          placeholder="e.g. Main Line, Secondary"
                          value={newPhoneLabel}
                          onChange={(e) => setNewPhoneLabel(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAddPhoneDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addPhoneNumber}>Add Phone Number</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {phoneNumbers.map((phone, index) => (
                  <div 
                    key={phone.id} 
                    className={`flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/30 cursor-move transition-all duration-200 ${
                      draggedPhone === phone.id ? 'opacity-50 scale-95' : 'hover:bg-background/70'
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, phone.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, phone.id)}
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                      <div className={`w-3 h-3 rounded-full ${phone.isActive ? 'bg-success' : 'bg-muted'}`} />
                      <div>
                        <div className="font-medium text-foreground">{phone.number}</div>
                        <div className="text-sm text-muted-foreground">{phone.label}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={phone.isActive}
                        onCheckedChange={() => togglePhoneActive(phone.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePhoneNumber(phone.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Google Sheets Tab */}
        <TabsContent value="google-sheets" className="space-y-6">
          <Card className="bg-gradient-card border-0 shadow-custom-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                Google Sheets Integration
              </CardTitle>
              <CardDescription>
                Connect to Google Sheets to automatically import leads
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sheet-id">Google Sheet ID</Label>
                  <Input
                    id="sheet-id"
                    value={googleSheetId}
                    onChange={(e) => setGoogleSheetId(e.target.value)}
                    placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Found in the Google Sheets URL between /d/ and /edit
                  </div>
                </div>
                <div>
                  <Label htmlFor="sheet-name">Sheet Name</Label>
                  <Input
                    id="sheet-name"
                    value={sheetName}
                    onChange={(e) => setSheetName(e.target.value)}
                    placeholder="Sheet1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name-column">Name Column</Label>
                  <Select value={nameColumn} onValueChange={setNameColumn}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select name column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Student Name">Student Name</SelectItem>
                      <SelectItem value="Name">Name</SelectItem>
                      <SelectItem value="Full Name">Full Name</SelectItem>
                      <SelectItem value="Contact Name">Contact Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="phone-column">Phone Column</Label>
                  <Select value={phoneColumn} onValueChange={setPhoneColumn}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select phone column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Phone Number">Phone Number</SelectItem>
                      <SelectItem value="Phone">Phone</SelectItem>
                      <SelectItem value="Mobile">Mobile</SelectItem>
                      <SelectItem value="Contact Number">Contact Number</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Eye className="h-4 w-4" />
                      Preview Data
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Sheet Data Preview</DialogTitle>
                      <DialogDescription>
                        Preview of how your data will be imported from the configured columns
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Showing sample data from "{sheetName}" sheet
                      </div>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-muted">
                            <tr>
                              <th className="text-left p-3 font-medium">Name ({nameColumn})</th>
                              <th className="text-left p-3 font-medium">Phone ({phoneColumn})</th>
                              <th className="text-left p-3 font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockSheetData.map((row, index) => (
                              <tr key={index} className="border-t">
                                <td className="p-3">{row.name}</td>
                                <td className="p-3">{row.phone}</td>
                                <td className="p-3">
                                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Valid
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button onClick={saveGoogleSheetsConfig} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card className="bg-gradient-card border-0 shadow-custom-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5" />
                Debug Settings
              </CardTitle>
              <CardDescription>
                Enable debugging features for troubleshooting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Debug Logs</div>
                  <div className="text-sm text-muted-foreground">
                    Show detailed debug information in the dialer interface
                  </div>
                </div>
                <Switch
                  checked={debugLogsEnabled}
                  onCheckedChange={setDebugLogsEnabled}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-custom-md border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Reset Operations
              </CardTitle>
              <CardDescription>
                Dangerous operations that will permanently delete data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="font-medium">Reset Leads</div>
                  <div className="text-sm text-muted-foreground">
                    Clear all lead data and reset to default state
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Reset Leads
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete all
                          lead data including call history, notes, and progress.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResetLeads} className="bg-destructive hover:bg-destructive/90">
                          Yes, reset leads
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <div className="space-y-2">
                  <div className="font-medium">Reset Dialer</div>
                  <div className="text-sm text-muted-foreground">
                    Reset all dialer settings and session data
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="gap-2">
                        <RotateCcw className="h-4 w-4" />
                        Reset Dialer
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reset Dialer Configuration?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will reset all dialer settings, clear the current session,
                          and return to default configuration. Your phone numbers will be preserved.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResetDialer} className="bg-destructive hover:bg-destructive/90">
                          Yes, reset dialer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}