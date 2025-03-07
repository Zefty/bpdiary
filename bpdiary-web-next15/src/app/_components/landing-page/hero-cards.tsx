import { Button, buttonVariants } from "../shadcn/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../shadcn/card";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/avatar";
import { Check, Github, Linkedin } from "lucide-react";
import { Badge } from "../shadcn/badge";
import SignIn from "../navigation/sign-in";
import { auth } from "~/server/auth";

export const HeroCards = async () => {
  const session = await auth();
  return (
    <div className="desktop:flex relative hidden h-[31.25rem] w-[43.75rem] flex-row flex-wrap gap-8">
      {/* Testimonial */}
      <Card className="absolute -top-[1.5rem] w-[21.25rem] rounded-3xl shadow-black/10 drop-shadow-xl dark:shadow-white/10">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar>
            <AvatarImage alt="" src="https://github.com/shadcn.png" />
            <AvatarFallback>SH</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <CardTitle className="text-lg">duckie</CardTitle>
            <CardDescription></CardDescription>
          </div>
        </CardHeader>

        <CardContent className="text-muted-foreground text-sm">
          "Simple, accurate, and easy to use—this app makes tracking blood
          pressure effortless!"
        </CardContent>
      </Card>

      {/* Team */}
      <Card className="absolute top-4 right-[1.25rem] flex w-80 flex-col items-center justify-center rounded-3xl shadow-black/10 drop-shadow-xl dark:shadow-white/10">
        <CardHeader className="mt-8 flex items-center justify-center pb-2">
          <img
            src="https://images.aiscribbles.com/1d14b9ba76144261ba3bce1b22b3631a.png?v=e6c995"
            alt="user avatar"
            className="absolute -top-12 aspect-square h-24 w-24 rounded-full object-cover grayscale-[0%]"
          />
          <CardTitle className="text-center">Contact</CardTitle>
          <CardDescription className="text-primary font-normal">
            Reach out to us!
          </CardDescription>
        </CardHeader>

        <CardContent className="text-muted-foreground pb-2 text-center text-sm">
          <p>
            If you have any questions, feedback, or suggestions, please feel
            free to contact us.
          </p>
        </CardContent>

        <CardFooter>
          <div>
            <a
              rel="noreferrer noopener"
              href="https://github.com/zefty"
              target="_blank"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              <span className="sr-only">X icon</span>
              <Github size="20" />
            </a>

            <a
              rel="noreferrer noopener"
              href="https://www.linkedin.com/in/jwu153/"
              target="_blank"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              <span className="sr-only">Linkedin icon</span>
              <Linkedin size="20" />
            </a>
          </div>
        </CardFooter>
      </Card>

      {/* Pricing */}
      <Card className="absolute top-[9.375rem] left-[3.125rem] w-72 rounded-3xl shadow-black/10 drop-shadow-xl dark:shadow-white/10">
        <CardHeader>
          <CardTitle className="item-center flex justify-between">
            Free
            <Badge
              variant="secondary"
              className="text-primary rounded-full text-sm"
            >
              Sign up now!
            </Badge>
          </CardTitle>
          <div>
            <span className="text-3xl font-bold">$0</span>
            <span className="text-muted-foreground"> /month</span>
          </div>

          <CardDescription>
            The app is free for all! Future features may need a subscription.
          </CardDescription>
        </CardHeader>

        <CardContent>{!session && <SignIn>Sign up</SignIn>}</CardContent>

        <hr className="m-auto mb-4 w-4/5" />

        <CardFooter className="flex">
          <div className="space-y-4">
            {["Calendar View", "Reminders", "Simple Charts"].map(
              (benefit: string) => (
                <span key={benefit} className="flex">
                  <Check className="text-green-500" />{" "}
                  <h3 className="ml-2">{benefit}</h3>
                </span>
              ),
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Service */}
      <Card className="absolute -right-[0.625rem] bottom-[2.5rem] w-[21.875rem] rounded-3xl shadow-black/10 drop-shadow-xl dark:shadow-white/10">
        <CardHeader className="flex items-start justify-start gap-4 space-y-1 md:flex-row">
          <div>
            <CardTitle>Responsive & Optimised!</CardTitle>
            <CardDescription className="text-muted-foreground mt-2 text-sm">
              BP Diary is responsive and optimised across all devices, including
              mobile, tablet, and desktop.
              <br />
              There is also seamless light and dark mode support!
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};
