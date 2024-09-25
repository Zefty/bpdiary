import { NavBar } from "../_components/navBar";

export default function DiaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {children}
      <NavBar />
    </section>
  );
}
