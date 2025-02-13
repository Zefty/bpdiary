import { cn } from "~/lib/utils";

export default function BaseHeader({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className="sticky inset-x-0 bottom-0 flex w-full justify-start">
      <nav
        className={cn(
          "flex w-full items-center justify-start gap-2 p-2",
          className,
        )}
      >
        {children}
      </nav>
    </header>
  );
}
