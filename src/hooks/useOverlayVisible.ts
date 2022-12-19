import { useState, useEffect, useRef } from "react";

export function useOverlayVisible<T extends HTMLElement>(isVisible: boolean) {
  const [isOverlayVisible, setIsOverlayVisible] = useState(isVisible);
  const ref = useRef<T>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
      setIsOverlayVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return { ref, isOverlayVisible, setIsOverlayVisible };
}

