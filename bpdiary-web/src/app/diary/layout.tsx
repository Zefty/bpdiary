import Footer from "../_components/footer";
import Header from "../_components/header";
import { SidebarProvider, SidebarTrigger } from "../_components/shadcn/sidebar";
import { BpSidebar } from "../_components/sidebar";

export default function DiaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex h-screen max-h-screen flex-col">
      <SidebarProvider>
        <BpSidebar />
        <main className="">
          <Header />
          <SidebarTrigger />
          <Footer />
        </main>
      </SidebarProvider>
      {/* <div className="flex-1">{children}</div> */}
      
    </section>
  );
}
