import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    if (!globalThis.window?.matchMedia) {
      setIsMobile(false);
      return;
    }

    const mql = globalThis.window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(globalThis.window.innerWidth < MOBILE_BREAKPOINT);
    };

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange);
    } else if (typeof (mql as any).addListener === "function") {
      (mql as any).addListener(onChange);
    }

    setIsMobile(globalThis.window.innerWidth < MOBILE_BREAKPOINT);

    return () => {
      if (typeof mql.removeEventListener === "function") {
        mql.removeEventListener("change", onChange);
      } else if (typeof (mql as any).removeListener === "function") {
        (mql as any).removeListener(onChange);
      }
    };
  }, []);

  return !!isMobile;
}
