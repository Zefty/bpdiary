export default function BaseHeader({ children }: { children?: React.ReactNode }) {
    return (
        <header className="w-full sticky inset-x-0 bottom-0 z-50 flex justify-start rounded-md border shadow-sm">
            <nav className="flex w-full items-center justify-start gap-2 p-2">
                {children}
            </nav>
        </header>
    )
}