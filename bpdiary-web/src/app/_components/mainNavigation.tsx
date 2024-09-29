import { cva } from "class-variance-authority";
import { LayoutDashboard, ChartLine, SquarePlus, BookHeart, CircleUser } from "lucide-react";
import Link from "next/link";

export default async function MainNavigation() {
    return (
        <div className="hidden sm:flex">
            <Link href="/diary" className={navigationMenuTriggerStyle()}>
                <>
                    <LayoutDashboard />
                    Dashboard
                </>
            </Link>
            <Link href="/diary" className={navigationMenuTriggerStyle()}>
                <>
                    <ChartLine />
                    Charts
                </>

            </Link>
            <Link href="/diary/addentry" className={navigationMenuTriggerStyle()}>
                <>
                    <SquarePlus />
                    Add Entry
                </>
            </Link>
            <Link href="/diary/history" className={navigationMenuTriggerStyle()}>
                <>
                    <BookHeart />
                    Diary History
                </>
            </Link>
            <Link href="/diary" className={navigationMenuTriggerStyle()}>
                <>
                    <CircleUser />
                    Account
                </>
            </Link>
        </div>
    )
}

const navigationMenuTriggerStyle = cva(
    "group inline-flex flex-col w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
);