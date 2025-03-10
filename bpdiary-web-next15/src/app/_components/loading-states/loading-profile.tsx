import { Skeleton } from "../shadcn/skeleton";

export default async function LoadingProfile() {
  return (
    <>
      <div className="tablet:grid tablet:grid-cols-2 flex flex-col space-y-8">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-8 rounded-md" />
          <Skeleton className="h-12 w-[17.375rem] rounded-md" />
          <Skeleton className="h-4 w-[26rem] rounded-md" />
        </div>
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-8 rounded-md" />
          <Skeleton className="h-12 w-[17.375rem] rounded-md" />
          <Skeleton className="h-4 w-[10rem] rounded-md" />
        </div>
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-18 rounded-md" />
          <Skeleton className="h-12 w-[17.375rem] rounded-md" />
          <Skeleton className="h-4 w-[22rem] rounded-md" />
        </div>
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-14 rounded-md" />
          <Skeleton className="h-12 w-[17.375rem] rounded-md" />
          <Skeleton className="h-4 w-[30rem] rounded-md" />
        </div>
      </div>
      <Skeleton className="h-12 w-[12rem] rounded-full" />
    </>
  );
}
