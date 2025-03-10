import { auth } from "~/server/auth";

export default async function SidebarUser() {
  const session = await auth();
  return (
    <span className="font-semibold whitespace-nowrap group-data-[collapsible=icon]:hidden">
      {session?.user?.name}
    </span>
  );
}
