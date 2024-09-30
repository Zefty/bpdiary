"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { api, type RouterOutputs } from "~/trpc/react";
import { ScrollArea } from "./shadcn/scroll-area";
import DiaryEntryCard from "./diaryEntryCard";

type BloodPressureDiary = RouterOutputs["bloodPressure"]["getInfiniteDiary"];

export default function BpDiaryHistory({
  diary,
}: {
  diary?: BloodPressureDiary;
}) {
  const viewPortRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView();
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isPending } =
    api.bloodPressure.getInfiniteDiary.useInfiniteQuery(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        // initialData: {
        //   pages: [diary],
        //   pageParams: [1],
        // }
      },
    );

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
      className="h-full"
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
          {data?.pages.map((page, pageNum) => (
            <React.Fragment key={`page-${pageNum}`}>
              {page.data.map((entry) => (
                <DiaryEntryCard key={entry.id} entry={entry} />
              ))}
            </React.Fragment>
          ))}
          {(isFetchingNextPage && hasNextPage) || isPending ? (
            <span className="text-center">Loading more of your diary ...</span>
          ) : (
            <span className="text-center">End of diary.</span>
          )}
          <div ref={ref} />
        </>
      </div>
    </ScrollArea>
  );
}
