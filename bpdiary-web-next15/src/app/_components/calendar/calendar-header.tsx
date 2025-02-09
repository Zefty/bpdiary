import { Share, Printer } from "lucide-react";
import { SidebarTrigger } from "../shadcn/sidebar";
import { Button } from "../shadcn/button";
import LogBpFormTrigger from "../log-bp/log-bp-form-trigger";
import LogBpFormProvider from "../log-bp/log-bp-form";
import BaseHeader from "../header/base-header";

export default function CalendarHeader() {
  return (
    <BaseHeader>
      <LogBpFormProvider>
        <LogBpFormTrigger />
        <Button className="gap-2">
          <Share width="1.5em" height="1.5em" />
          <span className="hidden xs:flex">Share</span>
        </Button>
        <Button className="gap-2">
          <Printer width="1.5em" height="1.5em" />
          <span className="hidden xs:flex">Print</span>
        </Button>
      </LogBpFormProvider>
    </BaseHeader>
  );
}
