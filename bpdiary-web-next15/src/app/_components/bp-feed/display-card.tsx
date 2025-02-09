import { RouterOutputs } from "~/trpc/react";
import { Card, CardContent } from "../shadcn/card";
import DisplayCardEntry from "./display-card-entry";
import EditBpFormProvider from "../log-bp/edit-bp-form";

type BloodPressureDiary = RouterOutputs["feed"]["getInfiniteDiary"]["data"];

export default function DisplayCard({ data = [] as BloodPressureDiary }) {
  if (data.length === 0) return;
  return (
    <EditBpFormProvider>
      <Card className="w-full border-0 shadow-none">
        <CardContent className="flex w-full flex-col p-0">
          {data?.map((entry) => (
            <DisplayCardEntry key={entry.id} entry={entry} />
          ))}
        </CardContent>
      </Card>
    </EditBpFormProvider>
  );
}
