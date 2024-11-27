import MainNavigation from "./mainNavigation";
import MobileNavigation from "./mobileNavigation";

export default async function Footer() {
    return (
        <footer className="sticky inset-x-0 bottom-0 z-50 mt-auto flex justify-center border bg-white shadow-sm">
            <nav className="h-20 flex items-center">
                <MainNavigation />
                <MobileNavigation />
            </nav>
        </footer>
    )
}
