import * as React from "react";

const XLScreen_BREAKPOINT = 1472;

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${XLScreen_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsTablet(window.innerWidth < XLScreen_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsTablet(window.innerWidth < XLScreen_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isTablet;
}
