import { auth } from "~/server/auth";

export default async function SidebarUser() {
    const session = await auth();
    const waitMs = Math.floor(Math.random() * 5000) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    return (
        <span className="font-semibold whitespace-nowrap group-data-[collapsible=icon]:hidden">
            {session?.user?.name}
        </span>
    )
}