"use client";

import { useEffect, useRef } from "react";
import { api } from "~/trpc/react";
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

  const [
    { pages },
    query,
    // isFetchingNextPage,
    // hasNextPage,
    // isPending,
    // isFetching,
  ] = api.feed.getInfiniteDiary.useSuspenseInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  const { isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } = query;

  const flattenedData = pages.flatMap((page) => page.data);

  useEffect(() => {
    const bottomCurrent = bottom.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void fetchNextPage();
        }
      },
      { threshold: 0 },
    );
    if (bottomCurrent) observer.observe(bottomCurrent);

    return () => {
      if (bottomCurrent) {
        observer.unobserve(bottomCurrent);
      }
    };
  }, [bottom, fetchNextPage]);

  return (
    <ScrollArea
      className="h-full max-h-screen overflow-y-auto border-l-[0.15rem]"
      ref={viewPortRef}
      onScrollCapture={(event) => {
        sessionStorage.setItem(
          "scrollPosition",
          (event.target as HTMLDivElement).scrollTop.toString(),
        );
      }}
    >
      <div className="flex flex-col items-center">
        <BaseHeader className="my-10 h-10 justify-center border-none shadow-none">
          <h1 className="text-3xl leading-none font-semibold tracking-tight">
            Measurements
          </h1>
        </BaseHeader>
        <DisplayCard data={flattenedData} />
        <div
          ref={bottom}
          className="relative flex h-[6rem] w-full items-center justify-center gap-2 px-2 pb-2"
        >
          {isFetchingNextPage || isFetching ? (
            <HeartLoader variant="pulse" className="flex w-12 justify-center" />
          ) : (
            <>
              <span className="text-muted-foreground text-center">
                End of diary ...
              </span>
              {viewPortRef.current && viewPortRef.current?.scrollTop > 0 && (
                <Button
                  className="bg-background hover:bg-muted absolute right-2 flex h-[2.5rem] w-[2.5gitrem] items-center justify-center rounded-md"
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
              )}
            </>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
