import Footer from "../_components/footer";

export default function DiaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex h-screen w-screen flex-col">
      {children}
      <Footer />
    </section>
  );
}
