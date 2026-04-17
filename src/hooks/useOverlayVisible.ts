import { useState, useEffect, useRef, RefObject } from "react";

export function useOverlayVisible<T extends HTMLElement>(
  isVisible: boolean,
  extraInsideRef?: RefObject<HTMLElement | null>
) {
  const [isOverlayVisible, setIsOverlayVisible] = useState(isVisible);
  const ref = useRef<T>(null);

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    if (ref.current?.contains(target)) {
      return;
    }
    if (extraInsideRef?.current?.contains(target)) {
      return;
    }
    setIsOverlayVisible(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return { ref, isOverlayVisible, setIsOverlayVisible };
}

