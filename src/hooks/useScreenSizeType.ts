import { useEffect, useState } from "react";

export enum ScreenType {
  TABLET,
  DESKTOP,
}

export function useScreenSizeType() {
  const [sizeType, setSizeType] = useState(
    window.innerWidth < 960 ? ScreenType.TABLET : ScreenType.DESKTOP
  );

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 960) {
        setSizeType(ScreenType.TABLET);
      } else {
        setSizeType(ScreenType.DESKTOP);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return sizeType;
}
