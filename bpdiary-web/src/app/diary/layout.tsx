import { NavBar } from "../_components/navBar";

export default function DiaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex h-screen flex-col">
      {children}
      <NavBar />
    </section>
  );
}
