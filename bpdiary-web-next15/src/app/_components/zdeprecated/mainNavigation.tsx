import { cva } from "class-variance-authority";
import {
  LayoutDashboard,
  ChartLine,
  SquarePlus,
  BookHeart,
  CircleUser,
} from "lucide-react";
import Link from "next/link";
import LinkTab from "./linkTab";

export default async function MainNavigation() {
  return (
    <div className="hidden xs:flex">
      <Link href="/diary" className={navigationMenuTriggerStyle()}>
        <LinkTab path="/diary">
          <LayoutDashboard />
          Dashboard
        </LinkTab>
      </Link>
      <Link href="/diary/charts" className={navigationMenuTriggerStyle()}>
        <LinkTab path="/diary/charts">
          <ChartLine />
          Charts
        </LinkTab>
      </Link>
      <Link href="/diary/addentry" className={navigationMenuTriggerStyle()}>
        <LinkTab path="/diary/addentry">
          <SquarePlus />
          Add Entry
        </LinkTab>
      </Link>
      <Link href="/diary/history" className={navigationMenuTriggerStyle()}>
        <LinkTab path="/diary/history">
          <BookHeart />
          Diary History
        </LinkTab>
      </Link>
      <Link href="/diary/account" className={navigationMenuTriggerStyle()}>
        <LinkTab path="/diary/account">
          <CircleUser />
          Account
        </LinkTab>
      </Link>
    </div>
  );
}

const navigationMenuTriggerStyle = cva(
  "group inline-flex flex-col w-max items-center justify-center rounded-md bg-background px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors hover:bg-accent",
);
