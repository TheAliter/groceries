import { useEffect, useState } from "react";

export function useScreenSizeType() {
  const [sizeType, setSizeType] = useState(
    window.innerWidth < 960 ? "Tablet" : "Desktop"
  );

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 960) {
        setSizeType("Tablet");
      } else {
        setSizeType("Desktop");
      }
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return sizeType;
}
