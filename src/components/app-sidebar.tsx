import { useState } from "react"
import { 
  BarChart3, 
  Phone, 
  Users, 
  Settings, 
  HelpCircle, 
  ChevronRight 
} from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import logoIcon from "@/assets/logo-icon.png"

const menuItems = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Dialer", url: "/dialer", icon: Phone },
  { title: "Lead Manager", url: "/leads", icon: Users },
]

const bottomMenuItems = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Help", url: "/help", icon: HelpCircle },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const isActive = (path: string) => currentPath === path
  const getNavClasses = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"

  return (
    <Sidebar
      className={cn(
        "border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
      collapsible="icon"
    >
      <SidebarContent className="bg-gradient-subtle">
        {/* Logo Section */}
        <div className={cn(
          "flex items-center gap-3 p-4 border-b border-border",
          collapsed && "justify-center"
        )}>
          <img 
            src={logoIcon} 
            alt="Kalvo" 
            className="w-8 h-8 flex-shrink-0"
          />
          {!collapsed && (
            <span className="text-lg font-semibold text-foreground">
              Kalvo
            </span>
          )}
        </div>

        <SidebarGroup className="pt-6">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end
                      className={({ isActive }) => cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                        getNavClasses({ isActive }),
                        collapsed && "justify-center px-2"
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">{item.title}</span>
                          {isActive(item.url) && (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom Section with User Info and Bottom Menu */}
        <div className="mt-auto">
          <Separator className="my-4" />
          
          {/* User Info */}
          <div className={cn(
            "flex items-center gap-3 p-4",
            collapsed && "justify-center"
          )}>
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary">JD</span>
            </div>
            {!collapsed && (
              <div>
                <div className="text-sm font-medium text-foreground">John Doe</div>
                <div className="text-xs text-muted-foreground">john@example.com</div>
              </div>
            )}
          </div>

          {/* Bottom Menu Items */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {bottomMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end
                        className={({ isActive }) => cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                          getNavClasses({ isActive }),
                          collapsed && "justify-center px-2"
                        )}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-left">{item.title}</span>
                            {isActive(item.url) && (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}

function cn(...inputs: (string | undefined)[]) {
  return inputs.filter(Boolean).join(' ')
}