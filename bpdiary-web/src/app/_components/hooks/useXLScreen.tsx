import * as React from "react"

const XLScreen_BREAKPOINT = 1280

export function useXLScreen() {
  const [isXLScreen, setIsXLScreen] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${XLScreen_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsXLScreen(window.innerWidth < XLScreen_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsXLScreen(window.innerWidth < XLScreen_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isXLScreen
}