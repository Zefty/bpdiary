import Footer from "../_components/footer";
import Header from "../_components/bpCalendarHeader";
import { SidebarProvider, SidebarTrigger } from "../_components/shadcn/sidebar";
import { BpSidebar } from "../_components/sidebar";

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
        {/* <Footer /> */}
      </section>
    </SidebarProvider>
  );
}
