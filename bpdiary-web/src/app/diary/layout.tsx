import Footer from "../_components/footer";

export default function DiaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col h-screen max-h-screen">
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </section>
  );
}
