import { SidebarProvider } from "../_components/shadcn/sidebar";
import { AppSidebar } from "../_components/navigation/app-sidebar";
import { Toaster } from "../_components/shadcn/toaster";

export default async function DiaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Toaster />
      <AppSidebar />
      <section className="max-h-dvh w-full">{children}</section>
    </SidebarProvider>
  );
}
