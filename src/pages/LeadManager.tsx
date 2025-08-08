import { useState } from "react"
import { 
  Download, 
  Upload, 
  Search, 
  Filter, 
  Plus,
  Phone,
  Mail,
  Calendar,
  User,
  StickyNote,
  Target
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock data for demonstration
const mockLeads = [
  {
    id: 1,
    name: "John Smith",
    company: "Tech Corp",
    phone: "+1 (555) 123-4567",
    email: "john@techcorp.com",
    status: "Booked",
    lastCalled: "2024-01-15",
    notes: "Follow up next week for demo",
    source: "Website",
    emailStatus: "Emailed"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    company: "Design Studio",
    phone: "+1 (555) 987-6543",
    email: "sarah@designstudio.com",
    status: "Call Back",
    lastCalled: "2024-01-14",
    notes: "Left voicemail, try again tomorrow",
    source: "Referral",
    emailStatus: "Not Emailed"
  },
  {
    id: 3,
    name: "Mike Wilson",
    company: "Marketing Inc",
    phone: "+1 (555) 456-7890",
    email: "mike@marketinginc.com",
    status: "Not Called",
    lastCalled: null,
    notes: "New lead from LinkedIn",
    source: "LinkedIn",
    emailStatus: "Emailed"
  },
  {
    id: 4,
    name: "Emily Davis",
    company: "Consulting LLC",
    phone: "+1 (555) 321-0987",
    email: "emily@consulting.com",
    status: "Pitched",
    lastCalled: "2024-01-13",
    notes: "Demo scheduled for Friday",
    source: "Cold Call",
    emailStatus: "Not Emailed"
  }
]

const statusColors = {
  "Booked": "bg-success/10 text-success border-success/20",
  "Call Back": "bg-warning/10 text-warning border-warning/20",
  "Email": "bg-info/10 text-info border-info/20",
  "Not Interested": "bg-destructive/10 text-destructive border-destructive/20",
  "Pitched": "bg-primary/10 text-primary border-primary/20",
  "Not Called": "bg-muted/20 text-muted-foreground border-muted/40"
}


const LeadManager = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedLeads, setSelectedLeads] = useState<number[]>([])

  const notEmailedLeads = mockLeads.filter(lead => lead.emailStatus === "Not Emailed")
  
  const filteredLeads = mockLeads
    .filter(lead => lead.emailStatus === "Emailed")
    .filter(lead => 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(lead => statusFilter === "all" || lead.status === statusFilter)

  const markAsEmailed = (leadId: number) => {
    // In a real app, this would update the backend
    const leadIndex = mockLeads.findIndex(lead => lead.id === leadId)
    if (leadIndex !== -1) {
      mockLeads[leadIndex].emailStatus = "Emailed"
    }
  }

  const handleExportCSV = () => {
    const headers = ["Name", "Company", "Phone", "Email", "Status", "Last Called", "Notes", "Source"]
    const csvContent = [
      headers.join(","),
      ...filteredLeads.map(lead => 
        [
          `"${lead.name}"`,
          `"${lead.company}"`,
          `"${lead.phone}"`,
          `"${lead.email}"`,
          `"${lead.status}"`,
          `"${lead.lastCalled || ''}"`,
          `"${lead.notes}"`,
          `"${lead.source}"`
        ].join(",")
      )
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "leads.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleBulkAction = (action: string) => {
    // In a real app, this would update the backend
    console.log(`Bulk action: ${action} for leads:`, selectedLeads)
    setSelectedLeads([])
  }

  return (
    <div className="flex-1 space-y-6 p-6 pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lead Manager</h1>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2 bg-gradient-primary hover:shadow-glow transition-all duration-200">
            <Upload className="w-4 h-4" />
            Import Leads
          </Button>
          <Button onClick={handleExportCSV} variant="secondary" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Warning Section for Not Emailed Leads */}
      {notEmailedLeads.length > 0 && (
        <Card className="border-warning bg-gradient-card shadow-custom-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <Mail className="w-5 h-5" />
              Leads Not Emailed ({notEmailedLeads.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notEmailedLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-3 bg-gradient-card rounded-lg border border-border/50 hover:shadow-custom-md transition-all duration-200">
                  <div>
                    <div className="font-medium">{lead.name} - {lead.company}</div>
                    <div className="text-sm text-muted-foreground">{lead.email}</div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => markAsEmailed(lead.id)}
                    className="gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Mark as Emailed
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Bulk Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search leads by name, company, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Booked">Booked</SelectItem>
            <SelectItem value="Call Back">Call Back</SelectItem>
            <SelectItem value="Email">Email</SelectItem>
            <SelectItem value="Not Interested">Not Interested</SelectItem>
            <SelectItem value="Pitched">Pitched</SelectItem>
            <SelectItem value="Not Called">Not Called</SelectItem>
          </SelectContent>
        </Select>

        {selectedLeads.length > 0 && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleBulkAction("delete")}
              className="gap-2"
            >
              Delete ({selectedLeads.length})
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleBulkAction("export")}
              className="gap-2"
            >
              Export ({selectedLeads.length})
            </Button>
          </div>
        )}
      </div>

      {/* Leads Table */}
      <Card className="bg-gradient-card border-0 shadow-custom-lg">
        <CardHeader className="border-b border-border/50 bg-gradient-subtle rounded-t-lg">
          <CardTitle className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">
            Leads ({filteredLeads.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                 <TableRow className="border-border/50 hover:bg-muted/30">
                   <TableHead className="w-12">
                     <input 
                       type="checkbox" 
                       checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                       onChange={(e) => {
                         if (e.target.checked) {
                           setSelectedLeads(filteredLeads.map(lead => lead.id))
                         } else {
                           setSelectedLeads([])
                         }
                       }}
                        className="rounded"
                     />
                   </TableHead>
                   <TableHead className="font-semibold text-foreground">Lead</TableHead>
                   <TableHead className="font-semibold text-foreground">Contact</TableHead>
                   <TableHead className="font-semibold text-foreground">Status</TableHead>
                   <TableHead className="font-semibold text-foreground">Last Called</TableHead>
                   <TableHead className="font-semibold text-foreground">Notes</TableHead>
                 </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead, index) => (
                   <TableRow 
                    key={lead.id} 
                    className="border-border/30 hover:bg-muted/20 group"
                  >
                    <TableCell>
                      <input 
                        type="checkbox" 
                        checked={selectedLeads.includes(lead.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLeads([...selectedLeads, lead.id])
                          } else {
                            setSelectedLeads(selectedLeads.filter(id => id !== lead.id))
                          }
                        }}
                        className="rounded"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">{lead.name}</div>
                        <div className="text-sm text-muted-foreground">{lead.company}</div>
                        <div className="text-xs text-muted-foreground/80">Source: {lead.source}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                         <div className="flex items-center gap-2 text-sm text-foreground">
                           <Phone className="w-3 h-3" />
                           {lead.phone}
                         </div>
                         <div className="flex items-center gap-2 text-sm text-foreground">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                       <Badge 
                        variant="outline" 
                        className={statusColors[lead.status]}
                      >
                        {lead.status}
                      </Badge>
                    </TableCell>
                    
                     <TableCell>
                       {lead.lastCalled ? (
                         <div className="flex items-center gap-2 text-foreground">
                           <Calendar className="w-4 h-4 text-muted-foreground" />
                           {lead.lastCalled}
                         </div>
                       ) : (
                         <span className="text-muted-foreground">Never</span>
                       )}
                     </TableCell>
                     
                     <TableCell>
                       <div className="flex items-start gap-2 max-w-64">
                         <StickyNote className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                         <span className="text-sm text-foreground">{lead.notes}</span>
                       </div>
                     </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

export default LeadManager