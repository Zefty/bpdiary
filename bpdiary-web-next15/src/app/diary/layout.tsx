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
      <section className="flex flex-col w-full h-screen max-h-screen">
        <div className="flex-1">{children}</div>
      </section>
    </SidebarProvider>
  );
}
