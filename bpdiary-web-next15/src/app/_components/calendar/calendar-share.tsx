import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../shadcn/dialog";
import { Input } from "../shadcn/input";
import { Label } from "../shadcn/label";
import { Button } from "../shadcn/button";
import { Send } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";

export default function CalendarShare() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Send width="1.5em" height="1.5em" />
          <span className="hidden xs:flex">Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[30rem]">
        <DialogHeader>
          <DialogTitle>Share Diary!</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="name"
              placeholder="Add people you'd like to share your diary with"
              className="col-span-3"
            />
            <Button className="col-span-1 gap-2">
              <Send width="1.5em" height="1.5em" />
              <span className="hidden xs:flex">Invite</span>
            </Button>
          </div>
          <Label htmlFor="username" className="text-left">
            People with access
          </Label>
          <div className="grid h-[5rem] grid-cols-4 items-center gap-4 rounded-md bg-muted"></div>
          <Label htmlFor="username" className="text-left">
            General access
          </Label>
          <div className="grid h-[5rem] grid-cols-4 items-center gap-4 rounded-md bg-muted"></div>
        </div>
        <DialogFooter>
          <Button type="submit">Copy link</Button>
          <Button type="submit">Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
