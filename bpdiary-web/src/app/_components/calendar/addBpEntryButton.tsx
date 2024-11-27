import { CirclePlus } from "lucide-react";
import { UseBpEntryContext } from "~/app/_contexts/bpEntryContext";
import { Button } from "../shadcn/button";

export default function AddBpEntryButton() {
  const context = UseBpEntryContext();
  return (
    <Button
      className="flex items-center justify-between gap-3"
      onClick={() => {
        if (context) {
          context.setOpenSheet(!context.openSheet);
        }
      }}
    >
      <CirclePlus className="h-4 w-4" />
      New Reading
    </Button>
  );
}
