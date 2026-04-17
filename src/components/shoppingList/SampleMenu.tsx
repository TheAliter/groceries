import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useOverlayVisible } from "../../hooks/_hooks";
import { useShoppingListStore } from "../../store/_store";
import styles from "./styles/SampleMenu.module.css";

interface Props {
  uid: number;
  onRequestDeleteSample: (uid: number) => void;
}

export default function SampleMenu({ uid, onRequestDeleteSample }: Props) {
  const menuReference = useRef<HTMLUListElement>(null);
  const { ref, isOverlayVisible, setIsOverlayVisible } =
    useOverlayVisible<HTMLDivElement>(false, menuReference);
  const navigate = useNavigate();
  const shoppingListStore = useShoppingListStore();
  const [menuFixedPosition, setMenuFixedPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);

  useLayoutEffect(() => {
    if (!isOverlayVisible || !ref.current) {
      setMenuFixedPosition(null);
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    setMenuFixedPosition({
      top: rect.bottom + 4,
      right: window.innerWidth - rect.right,
    });
  }, [isOverlayVisible]);

  useEffect(() => {
    if (!isOverlayVisible) {
      return;
    }
    function handleCloseOverlay() {
      setIsOverlayVisible(false);
    }
    window.addEventListener("scroll", handleCloseOverlay, true);
    window.addEventListener("resize", handleCloseOverlay);
    return () => {
      window.removeEventListener("scroll", handleCloseOverlay, true);
      window.removeEventListener("resize", handleCloseOverlay);
    };
  }, [isOverlayVisible, setIsOverlayVisible]);

  function handleTriggerPointerDown(e: React.SyntheticEvent) {
    e.stopPropagation();
  }

  function handleClick(e: React.SyntheticEvent) {
    e.stopPropagation();
    setIsOverlayVisible(!isOverlayVisible);
  }

  function handleEdit(e: React.SyntheticEvent) {
    e.stopPropagation();
    setIsOverlayVisible(false);
    navigate(
      "/shopping-list/" + shoppingListStore.accessKey + "/edit-sample/" + uid
    );
  }

  function handleDelete(e: React.SyntheticEvent) {
    e.stopPropagation();
    setIsOverlayVisible(false);
    onRequestDeleteSample(uid);
  }

  const menuPortal =
    isOverlayVisible &&
    menuFixedPosition &&
    createPortal(
      <ul
        ref={menuReference}
        className={styles.menu}
        style={{
          position: "fixed",
          top: menuFixedPosition.top,
          right: menuFixedPosition.right,
          zIndex: 1400,
        }}
      >
        <li onClick={handleEdit}>Rediģēt</li>
        <span></span>
        <li onClick={handleDelete}>Izdzēst</li>
      </ul>,
      document.body
    );

  return (
    <>
      <div
        ref={ref}
        className={styles.container}
        onMouseDown={handleTriggerPointerDown}
        onTouchStart={handleTriggerPointerDown}
      >
        <span onClick={handleClick} className="material-icons">
          more_vert
        </span>
      </div>
      {menuPortal}
    </>
  );
}
