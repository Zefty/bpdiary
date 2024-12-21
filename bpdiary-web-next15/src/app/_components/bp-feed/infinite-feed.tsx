"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { BpEntryContextProvider } from "~/app/_contexts/bpEntryContext";
import { api, RouterOutputs } from "~/trpc/react";
import { ScrollArea } from "../shadcn/scroll-area";
import EditBpEntry from "../log-bp/edit-bp-form";
import React from "react";
import DailyDiaryHistoryCard from "../zdeprecated/dailyDiaryHistoryCard";
import DisplayCard from "./display-card";

type BloodPressureDiary = RouterOutputs["bloodPressure"]["getInfiniteDiary"];

export default function InfiniteFeed() {
  const viewPortRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView();

  const [openEditBpEntry, setOpenEditBpEntry] = useState(false);
  const [bpEntryData, setBpEntryData] =
    useState<BloodPressureDiary["data"][0]>();

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isPending } =
    api.bloodPressure.getInfiniteDiary.useInfiniteQuery(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const flattenedData = data?.pages.flatMap((page) => page.data)

  console.log(data)

  useEffect(() => {
    if (inView) {
      void fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  useLayoutEffect(() => {
    if (viewPortRef.current) {
      const scrollPosition = sessionStorage.getItem("scrollPosition");
      viewPortRef.current.scrollTop = Number(scrollPosition) ?? 0;
    }
  });

  return (
    <ScrollArea
      className="h-full max-h-screen overflow-y-auto rounded-md border"
      ref={viewPortRef}
      onScrollCapture={(event) => {
        sessionStorage.setItem(
          "scrollPosition",
          (event.target as HTMLDivElement).scrollTop.toString(),
        );
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <h1 className="m-8 text-2xl font-semibold leading-none tracking-tight">
          Blood Pressure History
        </h1>
        <>
          <DisplayCard data={flattenedData} />
          {(isFetchingNextPage && hasNextPage) || isPending ? (
            <span className="text-center">
              Loading more of your diary ...
            </span>
          ) : (
            <span className="text-center">End of diary.</span>
          )}
          <div ref={ref} />
        </>
      </div>
    </ScrollArea>
  );
}
