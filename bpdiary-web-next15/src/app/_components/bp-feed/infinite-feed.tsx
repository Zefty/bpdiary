"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { api, RouterOutputs } from "~/trpc/react";
import { ScrollArea } from "../shadcn/scroll-area";
import React from "react";
import DisplayCard from "./display-card";

export default function InfiniteFeed() {
  const viewPortRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView();

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isPending } =
    api.bloodPressure.getInfiniteDiary.useInfiniteQuery(
      {
        limit: 10
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const flattenedData = data?.pages.flatMap((page) => page.data)

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
          Blood Pressure Measurements
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
