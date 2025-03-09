import { BellRing, CalendarHeart, ChartSpline } from "lucide-react";
import { Badge } from "../shadcn/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../shadcn/card";

const features = [
  {
    title: "Calendar View",
    description:
      "All you blood pressure readings are displayed in a calendar view for easy access and management.",
    image: "image4",
    icon: CalendarHeart,
  },
  {
    title: "Reminders",
    description:
      "Set reminders to never forget your readings or take your medications.",
    image: "image3",
    icon: BellRing,
  },
  {
    title: "Simple Charts",
    description:
      "Visualise your blood pressure readings with simple and easy to understand charts in a simple dashboard.",
    image: "image",
    icon: ChartSpline,
  },
];

const featureList: string[] = [
  "Dark/Light theme",
  "Responsive design",
  "Simple ui",
  "Free to use",
  "Adjustable timezones",
  "More features coming soon",
];

export const Features = () => {
  return (
    <section id="features" className="laptop:py-32 container space-y-8">
      <h2 className="text-3xl font-bold md:text-center lg:text-4xl">
        Many{" "}
        <span className="from-primary/60 to-primary bg-gradient-to-b bg-clip-text text-transparent">
          Great Features
        </span>
      </h2>

      <div className="flex flex-wrap gap-4 md:justify-center">
        {featureList.map((feature: string) => (
          <div key={feature}>
            <Badge variant="secondary" className="rounded-full text-sm">
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="rounded-3xl">
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>

            <CardContent className="h-[6rem]">
              {feature.description}
            </CardContent>

            <CardFooter>
              <feature.icon className="text-primary mx-auto h-[5rem] w-[5rem]" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
