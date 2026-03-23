"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, ListIcon, FolderIcon, UsersIcon, CommandIcon, DollarSignIcon } from "lucide-react"

const data = {
  user: {
    name: "eder luis mestra",
    email: "eder_mestra@cun.edu.co",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Clientes",
      url: "/clientes",
      icon: (
        <UsersIcon />
      ),
    },
    {
      title: "Entrenadores",
      url: "/entrenadores",
      icon: (
        <ListIcon />
      ),
    },
    {
      title: "Planes",
      url: "/planes",
      icon: (
        <FolderIcon />
      ),
    },
    {
      title: "Pagos",
      url: "/pagos",
      icon: (
        <DollarSignIcon />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Remastering Gym.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
