import Footer from "../_components/footer";

export default function DiaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col h-screen max-h-screen">
      {children}
      <Footer />
    </section>
  );
}
