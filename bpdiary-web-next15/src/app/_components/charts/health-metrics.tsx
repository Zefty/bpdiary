import { Activity, Heart, LineChart } from "lucide-react";
import { Card, CardContent } from "../shadcn/card";

function RadialProgress({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 45; // radius is 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative h-24 w-24">
      <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
        <circle
          className="text-gray-200"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          className={`${color} transition-all duration-300 ease-in-out`}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
        {value}
      </div>
    </div>
  );
}

export default function HealthMetrics() {
  return (
    <div className="grid max-w-5xl gap-6 p-4 md:grid-cols-3">
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2">
              <Activity className="h-5 w-5 text-red-500" />
            </div>
            <h3 className="font-medium">Blood Pressure</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">120/70</div>
              <div className="text-muted-foreground">mmHg</div>
            </div>
            <RadialProgress value={120} max={180} color="text-red-500" />
          </div>
          <div className="mt-4 space-y-2">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-muted-foreground">Systolic</span>
                <span className="font-medium">120 mmHg</span>
              </div>
              {/* <Progress
                value={(120 / 180) * 100}
                className="h-2 [&>div]:bg-red-500"
              /> */}
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-muted-foreground">Diastolic</span>
                <span className="font-medium">70 mmHg</span>
              </div>
              {/* <Progress
                value={(70 / 120) * 100}
                className="h-2 [&>div]:bg-red-500"
              /> */}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2">
              <Heart className="h-5 w-5 text-emerald-500" />
            </div>
            <h3 className="font-medium">Heart Rate</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">83</div>
              <div className="text-muted-foreground">bpm</div>
            </div>
            <RadialProgress value={83} max={220} color="text-emerald-500" />
          </div>
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-muted-foreground">Resting Heart Rate</span>
              <span className="font-medium">83 bpm</span>
            </div>
            {/* <Progress
              value={(83 / 220) * 100}
              className="h-2 [&>div]:bg-emerald-500"
            /> */}
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            <span className="font-medium text-emerald-500">Normal</span> range:
            60-100 bpm
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <LineChart className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className="font-medium">Measurements</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">February</div>
              <div className="text-muted-foreground">This Month</div>
            </div>
            <RadialProgress value={5} max={28} color="text-blue-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
