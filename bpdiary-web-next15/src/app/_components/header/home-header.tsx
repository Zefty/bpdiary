import { auth } from "~/server/auth";
import LogBpFormProvider from "../log-bp/log-bp-form";
import LogBpFormTrigger from "../log-bp/log-bp-form-trigger";
import BaseHeader from "./base-header";
import { Separator } from "../shadcn/separator";

export default async function HomeHeader() {
  const session = await auth();
  return (
    <BaseHeader>
      <LogBpFormProvider>
        <LogBpFormTrigger />
        <Separator
          orientation="vertical"
          className="m-1 h-[calc(100%-0.125rem)]"
        />
        <h1 className="mr-auto text-2xl font-semibold leading-none tracking-tight">
          <span>
            {Greeting()}, {session?.user?.name}!
          </span>
        </h1>
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
