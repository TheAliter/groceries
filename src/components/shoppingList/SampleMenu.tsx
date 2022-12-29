import React from "react";
import { useNavigate } from "react-router-dom";
import { useOverlayVisible } from "../../hooks/_hooks";
import { useSampleStore, useShoppingListStore } from "../../store/_store";
import styles from "./styles/SampleMenu.module.css";

interface Props {
  uid: number;
}

export default function SampleMenu({ uid }: Props) {
  const { ref, isOverlayVisible, setIsOverlayVisible } =
    useOverlayVisible<HTMLDivElement>(false);
  const navigate = useNavigate();
  const samplesStore = useSampleStore();
  const shoppingListStore = useShoppingListStore();

  function handleClick(e: React.SyntheticEvent) {
    e.stopPropagation();
    setIsOverlayVisible(!isOverlayVisible);
  }

  function handleEdit(e: React.SyntheticEvent) {
    e.stopPropagation();
    navigate(
      "/shopping-list/" + shoppingListStore.accessKey + "/edit-sample/" + uid
    );
  }

  function handleDelete(e: React.SyntheticEvent) {
    e.stopPropagation();
    samplesStore.deleteSample(uid, { updateDB: true });
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
