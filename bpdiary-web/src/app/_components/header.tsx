import MainNavigation from "./mainNavigation";
import MobileNavigation from "./mobileNavigation";
import { SidebarTrigger } from "./shadcn/sidebar";

export default async function Header() {
    return (
        <header className="sticky inset-x-0 bottom-0 z-50 mt-auto flex justify-start border bg-white shadow-sm">
            <nav className="h-20 flex items-center">
                {/* <MainNavigation />
                <MobileNavigation /> */}
                <SidebarTrigger />
            </nav>
        </header>
    )
}
