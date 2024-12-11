import {
  User2,
  ChevronUp,
  ChevronDown,
  Home,
  Calendar,
  Inbox,
  Search,
  Settings,
  HeartPulse,
  ChartLine,
  LogOut,
  CreditCard,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/app/_components/shadcn/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import Link from "next/link";
import { auth } from "~/server/auth";

const items = [
  {
    title: "Home",
    url: "/diary",
    icon: Home,
  },
  {
    title: "Calendar",
    url: "/diary/calendar",
    icon: Calendar,
  },
  {
    title: "Charts",
    url: "/diary/charts",
    icon: ChartLine,
  },
];

export async function BpSidebar() {
  const session = await auth();
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="p-[6px]">
        <SidebarMenu className="p-[6px]">
          <SidebarMenuItem className="flex items-center gap-3">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-lg">
              <HeartPulse />
            </div>
            <span className="whitespace-nowrap text-3xl font-bold group-data-[collapsible=icon]:hidden">
              BP Diary
            </span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="pl-4 h-12 gap-3 group-data-[collapsible=icon]:!size-12 group-data-[collapsible=icon]:!pl-4"
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span className="text-sm group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="pl-4 h-12 gap-3 group-data-[collapsible=icon]:!size-12 group-data-[collapsible=icon]:!pl-4">
                  <User2/>
                  <span className="whitespace-nowrap group-data-[collapsible=icon]:hidden">{session?.user?.name}</span>
                  <ChevronUp className="ml-auto group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <SidebarMenuButton asChild className="pl-4 h-12 group-data-[collapsible=icon]:!size-12 group-data-[collapsible=icon]:!pl-4">
                  <Link href="/diary/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuButton asChild className="pl-4 h-12 group-data-[collapsible=icon]:!size-12 group-data-[collapsible=icon]:!pl-4">
                  <Link href="/diary/billing">
                    <CreditCard />
                    <span>Billing</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuButton asChild className="pl-4 h-12 group-data-[collapsible=icon]:!size-12 group-data-[collapsible=icon]:!pl-4">
                  <Link href="/api/auth/signout">
                    <LogOut />
                    <span>Sign out</span>
                  </Link>
                </SidebarMenuButton>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
