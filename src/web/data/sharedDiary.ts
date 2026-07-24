import { infiniteQueryOptions } from "@tanstack/react-query";
import type { SharedDiaryCursor } from "@/core/sharing/diaryShare";
import { getSharedDiary } from "@/server/sharing/diaryShares";

export const sharedDiaryQuery = (token: string) =>
	infiniteQueryOptions({
		queryKey: ["shared-diary", token],
		queryFn: ({ pageParam }) =>
			getSharedDiary({ data: { token, cursor: pageParam } }),
		initialPageParam: null as SharedDiaryCursor | null,
		getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
		staleTime: 0,
	});
