import {
  // Box,
  CirclePlus,
  LayoutDashboard,
  Package,
  Search,
  Settings,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useLocation } from "react-router-dom";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "All Orders",
    url: "/all-products",
    icon: Package,
  },
  {
    title: "Add Product",
    url: "/dashboard/addNewProducts",
    icon: CirclePlus,
  },
  {
    title: "All Users",
    url: "/all-users",
    icon: User,
  },
  {
    title: "Find user",
    url: "/search",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation(); // Use location for active menu highlighting

  return (
    <Sidebar aria-label="sidebar">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg m-auto w-full bg-black text-white flex items-center justify-center mb-2">
            Admin Controller
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className={`flex items-center space-x-2 p-2 rounded ${
                        location.pathname === item.url
                          ? "bg-black text-white"
                          : "bg-transparent text-black"
                      }`}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
