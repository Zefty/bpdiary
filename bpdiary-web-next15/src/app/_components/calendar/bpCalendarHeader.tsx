import {
  Share,
  Printer,
} from "lucide-react";
import { SidebarTrigger } from "../shadcn/sidebar";
import { Button } from "../shadcn/button";
import { BpEntryContextProvider } from "~/app/_contexts/bpEntryContext";
import AddBpEntry from "../entry/addBpEntry";
import AddBpEntryButton from "./addBpEntryButton";

export default function BpCalendarHeader() {
  return (
    <BpEntryContextProvider>
      <header className="sticky inset-x-0 bottom-0 z-50 mt-auto flex justify-start rounded-md border shadow-sm">
        <nav className="flex w-full items-center justify-start gap-2 p-2">
          <SidebarTrigger variant="outline" className="h-10 w-10"/>
          <AddBpEntryButton />
          <AddBpEntry />
          <Button className="gap-2">
            <Share className="h-4 w-4" /> 
            <span className="hidden xs:flex">Share</span>
          </Button>
          <Button className="gap-2">
            <Printer className="h-4 w-4" /> 
            <span className="hidden xs:flex">Print</span>
          </Button>
        </nav>
      </header>
    </BpEntryContextProvider>
  );
}
