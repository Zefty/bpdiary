"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { api, RouterOutputs } from "~/trpc/react";
import { ScrollArea } from "../shadcn/scroll-area";
import React from "react";
import DisplayCard from "./display-card";
import BaseHeader from "../header/base-header";

export default function InfiniteFeed() {
  const viewPortRef = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isPending, isFetching } =
    api.feed.getInfiniteDiary.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const flattenedData = data?.pages.flatMap((page) => page.data);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      console.log(entries)
      if (entries[0]?.isIntersecting) {
        fetchNextPage();
      }
    }, { threshold: 0 });
    if (bottom.current) observer.observe(bottom.current);

    return () => {
      if (bottom.current) {
        observer.unobserve(bottom.current);
      }
    }
  }, [bottom]);

  return (
    <ScrollArea
      className="h-full max-h-screen overflow-y-auto rounded-md border-t"
      ref={viewPortRef}
      onScrollCapture={(event) => {
        sessionStorage.setItem(
          "scrollPosition",
          (event.target as HTMLDivElement).scrollTop.toString(),
        );
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <BaseHeader className="h-14 border-t-0">
          <h1 className="text-2xl font-semibold leading-none tracking-tight">
            Blood Pressure Measurements
          </h1>
        </BaseHeader>
        <DisplayCard data={flattenedData} />
        <div ref={bottom}>
          {(isFetchingNextPage || hasNextPage || isPending || isFetching) ? (
            <span className="text-center">
              Loading more of your diary ...
            </span>
          ) : (
            <span className="text-center">End of diary</span>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
