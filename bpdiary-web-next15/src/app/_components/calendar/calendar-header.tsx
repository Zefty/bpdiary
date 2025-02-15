import { Download, Send } from "lucide-react";
import { Button } from "../shadcn/button";
import LogBpFormTrigger from "../log-bp/log-bp-form-trigger";
import LogBpFormProvider from "../log-bp/log-bp-form";
import BaseHeader from "../header/base-header";
import CalendarShare from "./calendar-share";
import CalendarExport from "./calendar-export";

export default function CalendarHeader() {
  return (
    <BaseHeader className="rounded-md border shadow-xs">
      <LogBpFormProvider>
        <LogBpFormTrigger />
        <CalendarShare />
        <CalendarExport />
      </LogBpFormProvider>
    </BaseHeader>
  );
}
