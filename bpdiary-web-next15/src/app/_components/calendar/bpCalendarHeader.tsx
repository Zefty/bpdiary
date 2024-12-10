import {
  Share,
  Printer,
} from "lucide-react";
import { SidebarTrigger } from "../shadcn/sidebar";
import { Button } from "../shadcn/button";
import { BpEntryContextProvider } from "~/app/_contexts/bpEntryContext";
import AddBpEntry from "../entry/addBpEntry";
import AddBpEntryButton from "./addBpEntryButton";
import { useIsMobile } from "~/app/_hooks/use-mobile";

export default function BpCalendarHeader() {
  const isMobile = useIsMobile();
  return (
    <BpEntryContextProvider>
      <header className="sticky inset-x-0 bottom-0 z-50 mt-auto flex justify-start rounded-md border bg-white shadow-sm">
        <nav className="flex w-full items-center justify-start gap-3 p-3">
          <SidebarTrigger variant="outline" className="h-10 w-10"/>
          <AddBpEntryButton />
          <AddBpEntry />
          <Button className="gap-3">
            <Share className="h-4 w-4" /> {!isMobile && "Share"}
          </Button>
          <Button className="gap-3">
            <Printer className="h-4 w-4" /> {!isMobile && "Print"}
          </Button>
        </nav>
      </header>
    </BpEntryContextProvider>
  );
}
