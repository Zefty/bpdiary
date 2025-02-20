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
  Sun,
  Droplet,
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
import { Separator } from "../shadcn/separator";
import ThemeToggle from "./theme-toggle";
import { cn } from "~/lib/utils";

export default async function AppSidebar() {
  const session = await auth();
  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      resizable
      className="select-none group-data-[side=left]:border-r-[0.15rem]"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="rouded-md flex flex-row items-center gap-4 p-[1.75rem] duration-200 ease-linear group-data-[collapsible=icon]:justify-normal group-data-[collapsible=icon]:px-0">
            <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-12 items-center justify-center rounded-md">
              <Droplet className="h-[1.75rem] w-[1.75rem] fill-white stroke-[2.25]" />
            </div>
            <span className="text-3xl font-bold whitespace-nowrap group-data-[collapsible=icon]:hidden">
              BP Diary
            </span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "group/diary text-muted-foreground h-16 gap-6 pl-8 text-xl font-medium group-data-[collapsible=icon]:size-12! group-data-[collapsible=icon]:pl-[0.75rem]! hover:font-semibold [&>svg]:size-6",
                    "group-data-[pathname=/diary]:bg-muted group-data-[pathname=/diary]:font-semibold group-data-[pathname=/diary]:text-current",
                  )}
                >
                  <Link href="/diary">
                    <Home className="stroke-[2.25] group-hover/diary:stroke-[2.75] group-data-[pathname=/diary]:stroke-[2.75]" />
                    <span className="group-data-[collapsible=icon]:hidden">
                      Home
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "group/calendar text-muted-foreground h-16 gap-6 pl-8 text-xl font-medium group-data-[collapsible=icon]:size-12! group-data-[collapsible=icon]:pl-[0.75rem]! hover:font-semibold [&>svg]:size-6",
                    "group-data-[pathname=/diary/calendar]:bg-muted group-data-[pathname=/diary/calendar]:font-semibold group-data-[pathname=/diary/calendar]:text-current",
                  )}
                >
                  <Link href="/diary/calendar">
                    <Calendar className="stroke-[2.25] group-hover/calendar:stroke-[2.75] group-data-[pathname=/diary/calendar]:stroke-[2.75]" />
                    <span className="group-data-[collapsible=icon]:hidden">
                      Calendar
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "group/settings text-muted-foreground h-16 gap-6 pl-8 text-xl font-medium group-data-[collapsible=icon]:size-12! group-data-[collapsible=icon]:pl-[0.75rem]! hover:font-semibold [&>svg]:size-6",
                    "group-data-[pathname^=/diary/settings]:bg-muted group-data-[pathname^=/diary/settings]:font-semibold group-data-[pathname^=/diary/settings]:text-current",
                  )}
                >
                  <Link href="/diary/settings">
                    <Settings className="stroke-[2.25] group-hover/settings:stroke-[2.75] group-data-[pathname^=/diary/settings]:stroke-[2.75]" />
                    <span className="group-data-[collapsible=icon]:hidden">
                      Settings
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="group-data-[collapsible=icon]: h-16 gap-6 px-8 text-xl font-medium group-data-[collapsible=icon]:size-12! group-data-[collapsible=icon]:pl-[0.75rem]! [&>svg]:size-6">
                  <User2 className="stroke-[2.75]" />
                  <span className="font-semibold whitespace-nowrap group-data-[collapsible=icon]:hidden">
                    {session?.user?.name}
                  </span>
                  <ChevronUp className="ml-auto stroke-[2.75] group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-(--radix-popper-anchor-width) min-w-[230px]"
                align="start"
              >
                {/* <ThemeToggle className="text-muted-foreground h-16 gap-6 pl-8 text-xl font-medium hover:font-semibold [&>svg]:size-6 [&>svg]:stroke-2" /> */}
                {/* <Separator className="m-auto my-1 w-[calc(100%-1rem)]" /> */}
                <SidebarMenuButton
                  asChild
                  className="group/signout text-muted-foreground h-16 gap-6 pl-8 text-xl font-medium hover:font-semibold [&>svg]:size-6"
                >
                  <Link href="/api/auth/signout">
                    <LogOut className="stroke-[2.25] group-hover/signout:stroke-[2.75]" />
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
