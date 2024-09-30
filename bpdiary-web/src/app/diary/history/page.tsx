import { notFound } from "next/navigation";
import BpDiaryHistory from "~/app/_components/bpDiaryHistory";
import { ScrollArea } from "~/app/_components/shadcn/scroll-area";
import { api, HydrateClient } from "~/trpc/server";

export default async function History({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const page =
    searchParams.page === undefined ? 1 : parseInt(searchParams.page as string);

  if (page < 1) {
    notFound();
  }

  await api.bloodPressure.getInfiniteDiary.prefetchInfinite({});
  return (
    <HydrateClient>
      <BpDiaryHistory />
      {/* <PaginationDiary currentPage={page} maxPages={maxPages?.pages} /> */}
    </HydrateClient>
  );
}
