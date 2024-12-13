import { SidebarProvider } from "../_components/shadcn/sidebar";
import { BpSidebar } from "../_components/navigation/sidebar";
import { Toaster } from "../_components/shadcn/toaster";

export default async function DiaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Toaster />
      <BpSidebar />
      <section className="flex flex-col w-full h-screen max-h-screen">
        <div className="flex-1">{children}</div>
      </section>
    </SidebarProvider>
  );
}
