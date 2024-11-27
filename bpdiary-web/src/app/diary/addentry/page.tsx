import AddBpEntry from "~/app/_components/addBpEntry";
import BackPageButton from "~/app/_components/backPageButton";

export default async function AddEntry() {
  return (
    <div className="flex w-full flex-col">
      <BackPageButton className="m-3"/>
      <div className="flex justify-center">
        <AddBpEntry />
      </div>
    </div>
  );
}
