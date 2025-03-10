import { Skeleton } from "../shadcn/skeleton";

export default async function LoadingSidebarUser() {
    return (
        <div className="flex flex-row items-center w-full">
            <Skeleton className="h-6 w-full" />
        </div>
    )
}