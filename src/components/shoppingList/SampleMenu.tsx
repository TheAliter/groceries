import React from "react";
import { useNavigate } from "react-router-dom";
import { dbDeleteSample } from "../../database/deleteSample";
import { useOverlayVisible } from "../../hooks/useOverlayVisible";
import { useShoppingListContext } from "../../hooks/useShoppingListContext";
import styles from "./styles/SampleMenu.module.css";

interface Props {
  uid: number;
}

export default function SampleMenu({ uid }: Props) {
  const { ref, isOverlayVisible, setIsOverlayVisible } =
    useOverlayVisible<HTMLDivElement>(false);
  const shopListContext = useShoppingListContext();
  const navigate = useNavigate();

  function handleClick(e: React.SyntheticEvent) {
    e.stopPropagation();
    setIsOverlayVisible(!isOverlayVisible);
  }

  function handleEdit(e: React.SyntheticEvent) {
    e.stopPropagation();
    navigate(
      "/shopping-list/" + shopListContext?.accessKey + "/edit-sample/" + uid
    );
  }

  function handleDelete(e: React.SyntheticEvent) {
    e.stopPropagation();
    shopListContext?.deleteSample(uid);
    dbDeleteSample(shopListContext!.id, uid);
  }

  return (
    <div ref={ref} className={styles.container}>
      <span onClick={handleClick} className="material-icons">
        more_vert
      </span>
      {isOverlayVisible && (
        <ul className={styles.menu}>
          <li onClick={handleEdit}>Rediģēt</li>
          <span></span>
          <li onClick={handleDelete}>Izdzēst</li>
        </ul>
      )}
    </div>
  );
}
