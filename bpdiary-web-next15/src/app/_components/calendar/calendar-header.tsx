import {
  Share,
  Printer,
} from "lucide-react";
import { SidebarTrigger } from "../shadcn/sidebar";
import { Button } from "../shadcn/button";
import LogBpFormTrigger from "../log-bp/log-bp-form-trigger";
import LogBpFormProvider from "../log-bp/log-bp-form";
import BaseHeader from "../header/base-header";

export default function CalendarHeader() {
  return (
    <BaseHeader>
      <LogBpFormProvider>
        {/* <SidebarTrigger variant="outline" className="h-10 w-10"/> */}
        <LogBpFormTrigger />
        <Button className="gap-2">
          <Share className="h-4 w-4" />
          <span className="hidden xs:flex">Share</span>
        </Button>
        <Button className="gap-2">
          <Printer className="h-4 w-4" />
          <span className="hidden xs:flex">Print</span>
        </Button>
      </LogBpFormProvider>
    </BaseHeader>
  );
}
