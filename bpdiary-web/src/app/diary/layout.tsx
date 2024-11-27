import { SidebarProvider } from "../_components/shadcn/sidebar";
import { BpSidebar } from "../_components/navigation/sidebar";

export default function DiaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <BpSidebar />
      <section className="flex flex-col w-full h-screen max-h-screen">
        <div className="flex-1">{children}</div>
      </section>
    </SidebarProvider>
  );
}
