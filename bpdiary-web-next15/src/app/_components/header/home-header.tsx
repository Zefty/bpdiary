import { auth } from "~/server/auth";
import LogBpFormTrigger from "../log-bp/log-bp-form-trigger";
import BaseHeader from "./base-header";
import { Button, buttonVariants } from "../shadcn/button";
import { Bell } from "lucide-react";
import { LogBpFormProvider } from "~/app/_contexts/bpEntryContext";
import { SidebarTrigger } from "../shadcn/sidebar";
import { cn } from "~/lib/utils";

export default async function HomeHeader() {
  const session = await auth();
  return (
    <BaseHeader className="flex-col items-start p-0">
      <LogBpFormProvider>
        <div className="flex w-full items-start justify-start gap-2">
          <SidebarTrigger
            className={cn(
              "desktop:hidden mobile:flex mr-auto",
              buttonVariants({ size: "circular", variant: "muted" }),
            )}
          />
          <h1 className="mobile:hidden desktop:text-[2.5rem] mr-auto align-middle text-3xl leading-none font-semibold tracking-tight">
            {Greeting()}, {session?.user?.name?.split(" ")[0]}!
          </h1>
          <LogBpFormTrigger variant="muted" size="circular" />
          <Button variant="muted" size="circular">
            <Bell className="size-[1.5rem]" />
          </Button>
        </div>
        <h1 className="mobile:text-[1.5rem] desktop:hidden mr-auto pt-4 align-middle text-3xl leading-none font-semibold tracking-tight">
          {Greeting()}, {session?.user?.name?.split(" ")[0]}!
        </h1>
        <span className="text-muted-foreground">{Reminders()}</span>
      </LogBpFormProvider>
    </BaseHeader>
  );
}

const Greeting = () => {
  const hours = new Date().getHours();
  if (hours >= 0 && hours < 6) return "Good night";
  if (hours >= 6 && hours < 12) return "Good morning";
  if (hours >= 12 && hours < 18) return "Good afternoon";
  if (hours >= 18 && hours < 24) return "Good night";
  return "";
};

const Reminders = () => {
  const randomInteger = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const rems = [
    "Have you taken your blood pressure today?",
    "Don't forget to take your medication",
  ];

  const idx = randomInteger(0, rems.length - 1);

  return rems[idx];
};
