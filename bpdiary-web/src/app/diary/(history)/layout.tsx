import Footer from "../../_components/footer";
import Header from "../../_components/header";
import { SidebarProvider, SidebarTrigger } from "../../_components/shadcn/sidebar";
import { BpSidebar } from "../../_components/sidebar";

export default function DiaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <BpSidebar />
      <section className="w-full flex h-screen max-h-screen flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        {/* <Footer /> */}
      </section>
    </SidebarProvider>
  );
}
