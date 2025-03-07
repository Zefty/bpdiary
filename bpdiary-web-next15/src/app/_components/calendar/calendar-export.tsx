import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../shadcn/dialog";
import { Label } from "../shadcn/label";
import { Button } from "../shadcn/button";
import { Download } from "lucide-react";
import { cn } from "~/lib/utils";

export default function CalendarExport({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled className={cn("hidden gap-2", className)} {...props}>
          <Download width="1.5em" height="1.5em" />
          <span className="xs:flex hidden">Export</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export data</DialogTitle>
          <DialogDescription>
            Choose your preferred data format and save your blood pressure
            information!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label htmlFor="username" className="text-left">
            Choose your preferred format
          </Label>
          <div className="bg-muted grid h-[5rem] grid-cols-4 items-center gap-4 rounded-md"></div>
          <Label htmlFor="username" className="text-left">
            General access
          </Label>
          <div className="bg-muted grid h-[5rem] grid-cols-4 items-center gap-4 rounded-md"></div>
        </div>
        <DialogFooter>
          <Button type="submit">Download</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
