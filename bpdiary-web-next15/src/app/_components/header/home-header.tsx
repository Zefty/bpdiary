import { auth } from "~/server/auth";
import LogBpFormProvider from "../log-bp/log-bp-form";
import LogBpFormTrigger from "../log-bp/log-bp-form-trigger";
import BaseHeader from "./base-header";
import { Button } from "../shadcn/button";
import { Bell } from "lucide-react";

export default async function HomeHeader() {
  const session = await auth();
  return (
    <BaseHeader className="flex-col items-start p-0">
      <LogBpFormProvider>
        <div className="flex w-full items-start justify-start gap-4">
          <div className="mr-auto align-middle">
            <h1 className="laptop:text-[2.5rem] text-3xl leading-none font-semibold tracking-tight">
              {Greeting()}, {session?.user?.name?.split(" ")[0]}!
            </h1>
          </div>
          <LogBpFormTrigger />
          <Button>
            <Bell className="h-[1.5rem] w-[1.5rem]" />
          </Button>
        </div>
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
