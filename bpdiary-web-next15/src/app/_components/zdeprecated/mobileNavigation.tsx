import {
  BookHeart,
  ChartLine,
  ChevronsUpIcon,
  CircleUser,
  HeartPulseIcon,
  LayoutDashboard,
  MountainIcon,
  SquarePlus,
} from "lucide-react";
import { Button } from "../shadcn/button";
import Link, { type LinkProps } from "next/link";
import { cva } from "class-variance-authority";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import { cn } from "~/lib/utils";

export default async function MobileNavigation() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="link"
          size="icon"
          className="h-full focus-visible:ring-0 focus-visible:ring-offset-0 xs:hidden"
        >
          <ChevronsUpIcon className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-screen p-0">
        <div className="grid gap-2 pb-6 pt-4">
          <DropDownMenuLink href="#" className="ml-4 focus:bg-transparent">
            <HeartPulseIcon className="h-8 w-8" />
          </DropDownMenuLink>
          <DropDownMenuLink href="/diary">
            <span className="ml-4">Dashboard</span>
          </DropDownMenuLink>
          <DropDownMenuLink href="/diary">
            <span className="ml-4">Charts</span>
          </DropDownMenuLink>
          <DropDownMenuLink href="/diary/addentry">
            <span className="ml-4">Add Entry</span>
          </DropDownMenuLink>
          <DropDownMenuLink href="/diary/history">
            <span className="ml-4">Diary History</span>
          </DropDownMenuLink>
          <DropDownMenuLink href="/diary">
            <span className="ml-4">Account</span>
          </DropDownMenuLink>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface DropDownMenuLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
}

const DropDownMenuLink = ({
  href,
  className,
  children,
  ...props
}: DropDownMenuLinkProps) => {
  return (
    <DropdownMenuItem asChild>
      <Link
        href={href}
        className={cn(mobileNavigationStyle(), className)}
        {...props}
      >
        {children}
      </Link>
    </DropdownMenuItem>
  );
};

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-lg font-semibold transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-active:bg-accent/50 data-[state=open]:bg-accent/50",
);

const mobileNavigationStyle = cva(
  "flex w-full items-center py-2 text-lg font-semibold",
);
