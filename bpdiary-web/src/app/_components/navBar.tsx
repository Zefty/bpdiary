import {
  BookHeart,
  ChartLine,
  CircleUser,
  LayoutDashboard,
  SquarePlus,
} from "lucide-react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/app/_components/shadcn/navigation-menu";

export function NavBar() {
  return (
    <div className="sticky inset-x-0 bottom-0 z-50 mt-auto flex h-20 justify-center border bg-white shadow-sm">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/diary" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <div className="flex flex-col items-center">
                  <LayoutDashboard />
                  Dashboard
                </div>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/diary" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <div className="flex flex-col items-center">
                  <ChartLine />
                  Charts
                </div>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/diary/addentry" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <div className="flex flex-col items-center">
                  <SquarePlus />
                  Add Entry
                </div>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/diary/history" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <div className="flex flex-col items-center">
                  <BookHeart />
                  Diary History
                </div>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/diary" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <div className="flex flex-col items-center">
                  <CircleUser />
                  Account
                </div>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
