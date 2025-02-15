import MainNavigation from "./mainNavigation";
import MobileNavigation from "./mobileNavigation";

export default async function Footer() {
  return (
    <footer className="sticky inset-x-0 bottom-0 z-50 mt-auto flex justify-center border bg-white shadow-xs">
      <nav className="flex h-20 items-center">
        <MainNavigation />
        <MobileNavigation />
      </nav>
    </footer>
  );
}
