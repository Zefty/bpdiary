import { notFound } from "next/navigation";
import BpEntryHistory from "~/app/_components/bpEntryHistory";
import { PaginationDiary } from "~/app/_components/pagination";
import { ScrollArea } from "~/app/_components/shadcn/scroll-area";
import { api } from "~/trpc/server";

export default async function History({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page =
    searchParams.page === undefined ? 1 : parseInt(searchParams.page as string);

  if (page < 1) {
    notFound();
  }

  const diaries = await api.bloodPressure.getPaginatedDiary({
    page: page,
    limit: 5,
  });
  const maxPages = await api.bloodPressure.getMaxDiaryPages({ limit: 5 });
  return (
    <>
      <ScrollArea className="h-full">
        <div className="flex flex-col items-center">
          <h1 className="m-8 text-2xl font-semibold leading-none tracking-tight">
            Blood Pressure History
          </h1>
          {diaries.map((entry) => (
            <BpEntryHistory key={entry.id} entry={entry} />
          ))}
        </div>
      </ScrollArea>
      <PaginationDiary currentPage={page} maxPages={maxPages?.pages} />
    </>
  );
}
