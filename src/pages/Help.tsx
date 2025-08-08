import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { 
  HelpCircle, 
  Search, 
  Phone, 
  Users, 
  Settings, 
  FileText, 
  MessageCircle, 
  Mail, 
  ExternalLink,
  Book,
  Video,
  Lightbulb,
  Zap,
  Shield,
  PhoneCall,
  Target,
  BarChart3,
  Clock,
  CheckCircle
} from "lucide-react"

// Help content data
const faqData = [
  {
    category: "Getting Started",
    items: [
      {
        question: "How do I set up my first dialing session?",
        answer: "Navigate to the Dialer page and click 'Start Multi-Line Dialer'. Make sure you have configured your phone numbers in Settings > Phone Lines first."
      },
      {
        question: "How do I import leads?",
        answer: "Go to Lead Manager and click 'Import Leads'. You can upload a CSV file or connect your Google Sheets via Settings > Google Sheets integration."
      },
      {
        question: "What phone number formats are supported?",
        answer: "We support all standard formats: +1 (555) 123-4567, +15551234567, (555) 123-4567, and 555-123-4567."
      }
    ]
  },
  {
    category: "Dialer Features",
    items: [
      {
        question: "How many lines can I dial simultaneously?",
        answer: "You can dial up to 5 lines simultaneously. The number of active lines depends on your phone number configuration in Settings."
      },
      {
        question: "How do I handle call outcomes?",
        answer: "When a call ends, you'll see outcome options like 'Booked', 'Call Back', 'Not Interested', etc. Select the appropriate outcome and add notes if needed."
      },
      {
        question: "Can I schedule callbacks?",
        answer: "Yes! When marking a call outcome as 'Call Back', you can set a specific date and time for the follow-up call."
      }
    ]
  },
  {
    category: "Lead Management",
    items: [
      {
        question: "How do I organize my leads?",
        answer: "Use the Lead Manager to filter by status, search by name/company, and organize leads into different categories. You can also export filtered results."
      },
      {
        question: "What lead statuses are available?",
        answer: "Available statuses include: Not Called, Pitched, Booked, Call Back, Email, and Not Interested. Each status helps track your lead progression."
      },
      {
        question: "Can I add custom notes to leads?",
        answer: "Yes! Each lead has a notes field where you can add custom information, follow-up reminders, or conversation details."
      }
    ]
  },
  {
    category: "Settings & Configuration",
    items: [
      {
        question: "How do I add more phone numbers?",
        answer: "Go to Settings > Phone Lines and click 'Add Phone Number'. You can add multiple lines and set which ones are active for dialing."
      },
      {
        question: "How do I connect Google Sheets?",
        answer: "In Settings > Google Sheets, enter your Sheet ID, sheet name, and configure which columns contain names and phone numbers. Use 'Preview Data' to verify the setup."
      },
      {
        question: "What are debug logs for?",
        answer: "Debug logs in Settings > Advanced help troubleshoot issues. When enabled, they show detailed information about dialer operations and state changes."
      }
    ]
  }
]

const quickActions = [
  { title: "Start Dialing", description: "Begin your first dialing session", icon: Phone, action: "Go to Dialer", href: "/dialer" },
  { title: "Import Leads", description: "Upload your lead list", icon: Users, action: "Go to Lead Manager", href: "/leads" },
  { title: "Configure Settings", description: "Set up phone numbers and integrations", icon: Settings, action: "Go to Settings", href: "/settings" },
  { title: "View Dashboard", description: "Check your performance metrics", icon: BarChart3, action: "Go to Dashboard", href: "/" }
]

const videoTutorials = [
  { title: "Getting Started with Kalvo", duration: "5:23", thumbnail: "📺", description: "Complete setup walkthrough" },
  { title: "Multi-Line Dialing Tutorial", duration: "8:15", thumbnail: "📞", description: "How to use the dialer effectively" },
  { title: "Lead Management Best Practices", duration: "6:41", thumbnail: "👥", description: "Organize and track your leads" },
  { title: "Google Sheets Integration", duration: "4:32", thumbnail: "📊", description: "Connect your spreadsheets" }
]

const supportOptions = [
  { 
    title: "Email Support", 
    description: "Get help via email", 
    icon: Mail, 
    contact: "support@kalvo.com",
    availability: ""
  }
]

export default function Help() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Filter FAQ based on search term
  const filteredFAQ = faqData
    .map(category => ({
      ...category,
      items: category.items.filter(item => 
        (selectedCategory === "all" || category.category === selectedCategory) &&
        (searchTerm === "" || 
         item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.answer.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }))
    .filter(category => category.items.length > 0)

  // Filter quick actions based on search term
  const filteredQuickActions = quickActions.filter(action =>
    searchTerm === "" ||
    action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    action.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Filter video tutorials based on search term
  const filteredVideoTutorials = videoTutorials.filter(video =>
    searchTerm === "" ||
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex-1 space-y-6 p-6 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Help Center</h1>
          <p className="text-muted-foreground">Where you end up after clicking everything else first</p>
        </div>
        <HelpCircle className="h-8 w-8 text-muted-foreground" />
      </div>

      {/* Search Bar */}
      <Card className="bg-gradient-card border-0 shadow-custom-md">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search help articles, tutorials, and FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="quick-start" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="quick-start">Quick Start</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        {/* Show search results across all tabs when searching */}
        {searchTerm && (
          <div className="space-y-6">
            <Card className="bg-gradient-card border-0 shadow-custom-md">
              <CardHeader>
                <CardTitle>Search Results for "{searchTerm}"</CardTitle>
                <CardDescription>Found results across all help sections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Actions Results */}
                {filteredQuickActions.length > 0 && (
                  <div>
                    <h3 className="font-medium text-foreground mb-3">Quick Actions</h3>
                    <div className="space-y-3">
                      {filteredQuickActions.map((action, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/30">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                              <action.icon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{action.title}</div>
                              <div className="text-sm text-muted-foreground">{action.description}</div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => window.location.href = action.href}>
                            {action.action}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAQ Results */}
                {filteredFAQ.length > 0 && (
                  <div>
                    <h3 className="font-medium text-foreground mb-3">FAQ</h3>
                    <div className="space-y-3">
                      {filteredFAQ.map((category, categoryIndex) => (
                        <div key={categoryIndex}>
                          {category.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="p-4 bg-background/50 rounded-lg border border-border/30">
                              <div className="font-medium text-foreground mb-2">{item.question}</div>
                              <div className="text-sm text-muted-foreground">{item.answer}</div>
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mt-2">
                                {category.category}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video Tutorial Results */}
                {filteredVideoTutorials.length > 0 && (
                  <div>
                    <h3 className="font-medium text-foreground mb-3">Video Tutorials</h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      {filteredVideoTutorials.map((video, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border border-border/30 cursor-pointer">
                          <div className="w-12 h-9 bg-gradient-primary rounded-lg flex items-center justify-center text-lg">
                            {video.thumbnail}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-foreground">{video.title}</div>
                            <div className="text-sm text-muted-foreground">{video.description}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{video.duration}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No results found */}
                {filteredQuickActions.length === 0 && filteredFAQ.length === 0 && filteredVideoTutorials.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No results found for "{searchTerm}". Try different keywords or check the spelling.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Regular tab content - only show when not searching */}
        {!searchTerm && (
          <>
            {/* Quick Start Tab */}
            <TabsContent value="quick-start" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Quick Actions */}
            <Card className="bg-gradient-card border-0 shadow-custom-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Get started with these essential features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredQuickActions.map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/30 hover:shadow-custom-md transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <action.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{action.title}</div>
                        <div className="text-sm text-muted-foreground">{action.description}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = action.href}>
                      {action.action}
                    </Button>
                  </div>
                ))}
                {filteredQuickActions.length === 0 && searchTerm && (
                  <div className="text-center py-8 text-muted-foreground">
                    No quick actions found for "{searchTerm}"
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips & Best Practices */}
            <Card className="bg-gradient-card border-0 shadow-custom-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-warning" />
                  Tips & Best Practices
                </CardTitle>
                <CardDescription>
                  Pro tips to maximize your success
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                    <div>
                      <div className="font-medium text-foreground">Set Weekly Goals</div>
                      <div className="text-sm text-muted-foreground">Use the dashboard to track and achieve your weekly call targets</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                    <div>
                      <div className="font-medium text-foreground">Use Multiple Phone Lines</div>
                      <div className="text-sm text-muted-foreground">Activate 3-5 lines simultaneously for maximum efficiency</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                    <div>
                      <div className="font-medium text-foreground">Track Everything</div>
                      <div className="text-sm text-muted-foreground">Add detailed notes to each call for better follow-ups</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card className="bg-gradient-card border-0 shadow-custom-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Find answers to common questions about using Kalvo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredFAQ.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {category.category}
                      </Badge>
                      <Separator className="flex-1" />
                    </div>
                    <Accordion type="single" collapsible className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <AccordionItem key={itemIndex} value={`${categoryIndex}-${itemIndex}`} className="border border-border/30 rounded-lg px-4">
                          <AccordionTrigger className="text-left hover:no-underline">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground pb-4">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
                {filteredFAQ.length === 0 && searchTerm && (
                  <div className="text-center py-8 text-muted-foreground">
                    No FAQ items found for "{searchTerm}"
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tutorials Tab */}
        <TabsContent value="tutorials" className="space-y-6">
          <Card className="bg-gradient-card border-0 shadow-custom-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Video Tutorials
              </CardTitle>
              <CardDescription>
                Step-by-step video guides to master Kalvo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {filteredVideoTutorials.map((video, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-background/50 rounded-lg border border-border/30 hover:shadow-custom-md transition-all duration-200 cursor-pointer">
                    <div className="w-16 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-2xl">
                      {video.thumbnail}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{video.title}</div>
                      <div className="text-sm text-muted-foreground">{video.description}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{video.duration}</span>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
                {filteredVideoTutorials.length === 0 && searchTerm && (
                  <div className="text-center py-8 text-muted-foreground col-span-2">
                    No video tutorials found for "{searchTerm}"
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-custom-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-warning" />
                Documentation
              </CardTitle>
              <CardDescription>
                Detailed guides and API references
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  <span>User Guide</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Settings className="h-6 w-6" />
                  <span>Setup Guide</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Shield className="h-6 w-6" />
                  <span>Security Guide</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {supportOptions.map((option, index) => (
              <Card key={index} className="bg-gradient-card border-0 shadow-custom-md">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <option.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <div>
                    <div className="font-medium text-foreground">{option.contact}</div>
                    <div className="text-sm text-muted-foreground">{option.availability}</div>
                  </div>
                  <Button className="w-full">
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-card border-0 shadow-custom-md">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current status of all Kalvo services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Dialer Service</span>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Lead Management</span>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Google Sheets Integration</span>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Authentication</span>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Operational
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}