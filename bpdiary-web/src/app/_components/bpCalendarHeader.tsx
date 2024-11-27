import { CirclePlus, ChevronLeft, ChevronRight, Share, Printer } from "lucide-react";
import { SidebarTrigger } from "./shadcn/sidebar";
import { Button } from "./shadcn/button";
import Link from "next/link";

export default function BpCalendarHeader() {
  return (
    <header className="sticky inset-x-0 bottom-0 z-50 mt-auto flex justify-start rounded-md border bg-white shadow-sm">
      <nav className="flex w-full items-center justify-start gap-3 p-3">
        <SidebarTrigger />
        <Button>
          <Link href={"/diary/addentry"} className="flex items-center justify-between gap-3">
            <CirclePlus className="h-4 w-4" />
            New Reading
          </Link>
        </Button>
        <Button className="gap-3" ><Share className="h-4 w-4" /> Share</Button>
        <Button className="gap-3" ><Printer className="h-4 w-4" /> Print</Button>
      </nav>
    </header>
  );
}
