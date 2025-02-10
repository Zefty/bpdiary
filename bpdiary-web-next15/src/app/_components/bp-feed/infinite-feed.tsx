"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { api, RouterOutputs } from "~/trpc/react";
import { ScrollArea } from "../shadcn/scroll-area";
import React from "react";
import DisplayCard from "./display-card";
import BaseHeader from "../header/base-header";
import HeartLoader from "../navigation/heart-loader";
import { ChevronsUp } from "lucide-react";
import { Button } from "../shadcn/button";

export default function InfiniteFeed() {
  const viewPortRef = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isPending,
    isFetching,
  } = api.feed.getInfiniteDiary.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const flattenedData = data?.pages.flatMap((page) => page.data);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        console.log(entries);
        if (entries[0]?.isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0 },
    );
    if (bottom.current) observer.observe(bottom.current);

    return () => {
      if (bottom.current) {
        observer.unobserve(bottom.current);
      }
    };
  }, [bottom]);

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
        <BaseHeader className="h-14 justify-center border-none shadow-none">
          <h1 className="text-2xl font-semibold leading-none tracking-tight">
            Blood Pressure Measurements
          </h1>
        </BaseHeader>
        <DisplayCard data={flattenedData} />
        <div
          ref={bottom}
          className="relative flex h-[3rem] w-full items-center justify-center gap-2 px-2 pb-2"
        >
          {isFetchingNextPage || hasNextPage || isPending || isFetching ? (
            <HeartLoader variant="pulse" className="flex w-8 justify-center" />
          ) : (
            <>
              <span className="text-center text-muted-foreground">
                End of diary ...
              </span>
              <Button
                className="absolute right-2 flex h-[2.5rem] w-[2.5gitrem] items-center justify-center rounded-md bg-background hover:bg-muted"
                onClick={() => {
                  if (viewPortRef.current) {
                    viewPortRef.current.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }
                }}
              >
                <ChevronsUp className="text-primary" />
              </Button>
            </>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
