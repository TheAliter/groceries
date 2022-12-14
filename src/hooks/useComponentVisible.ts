import React, { useState, useEffect, useRef, ReactElement } from "react";

export default function useComponentVisible<T extends HTMLElement>(
  isVisible: boolean
) {
  const [isComponentVisible, setIsComponentVisible] = useState(isVisible);
  const ref = useRef<T>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return { ref, isComponentVisible, setIsComponentVisible };
}
