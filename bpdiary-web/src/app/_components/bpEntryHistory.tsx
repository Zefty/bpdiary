"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/shadcn/card";
import { api, type RouterOutputs } from "~/trpc/react";
import { ScrollArea } from "./shadcn/scroll-area";

type BloodPressureDiary =
  RouterOutputs["bloodPressure"]["getInfiniteDiary"];

export default function BpEntryHistory({
  diary,
}: {
  diary?: BloodPressureDiary;
}) {
  const viewPortRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView();
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isPending } = api.bloodPressure.getInfiniteDiary.useInfiniteQuery({}, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    // initialData: {
    //   pages: [diary],
    //   pageParams: [1],
    // }
  });

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
    <ScrollArea className="h-full" ref={viewPortRef} onScrollCapture={(event) => {
      sessionStorage.setItem("scrollPosition", (event.target as HTMLDivElement).scrollTop.toString());
    }}>
      <div className="flex flex-col items-center">
        <h1 className="m-8 text-2xl font-semibold leading-none tracking-tight">
          Blood Pressure History
        </h1>
        <>
          {data?.pages.map((page, pageNum) => (
            <React.Fragment key={`page-${pageNum}`}>
              {page.data.map((entry) => (
                <Card className="w-[300px]" key={entry.id}>
                  <CardHeader>
                    <CardTitle>Measurement</CardTitle>
                    <CardDescription>{`${entry.createdAt.toDateString()}, ${entry.createdAt.toLocaleTimeString("en-us").toUpperCase()}`}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Systolic: {entry.systolic} mmHg</CardDescription>
                    <CardDescription>Diastolic: {entry.diastolic} mmHg</CardDescription>
                    <CardDescription>Pulse: {entry.pulse} bpm</CardDescription>
                    <CardDescription>Notes: {entry.notes}</CardDescription>
                  </CardContent>
                  <CardFooter className="flex justify-between"></CardFooter>
                </Card>
              ))}
            </React.Fragment>
          ))}
          {isFetchingNextPage && hasNextPage || isPending ? (
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
