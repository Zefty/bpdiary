import AddBpEntry from "~/app/_components/add/addBpEntry";
import BackPageButton from "~/app/_components/add/backPageButton";

export default async function AddEntry() {
  return (
    <div className="flex justify-center w-full ">
      <BackPageButton className="my-16"/>
      <AddBpEntry />
    </div>
  );
}
