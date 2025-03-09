import { Skeleton } from "../shadcn/skeleton";

export default async function LoadingButton() {
    return (
        <Skeleton className="h-12 w-[15rem] rounded-full" />
    )
}