import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dbDeleteProduct } from "../../database/deleteProduct";
import { useOverlayVisible } from "../../hooks/useOverlayVisible";
import { useShoppingListContext } from "../../hooks/useShoppingListContext";
import styles from "./styles/ProductMenu.module.css";

interface Props {
  uid: number;
}

export default function ProductMenu({ uid }: Props) {
  const { ref, isOverlayVisible, setIsOverlayVisible } =
    useOverlayVisible<HTMLDivElement>(false);
  const shopListContext = useShoppingListContext();
  const navigate = useNavigate();

  function handleClick() {
    setIsOverlayVisible(!isOverlayVisible);
  }

  function handleDelete() {
    shopListContext?.deleteProduct(uid);
    dbDeleteProduct(shopListContext!.id, uid);
  }

  function handleEdit() {
    navigate(
      "/shopping-list/" + shopListContext?.accessKey + "/edit-product/" + uid
    );
  }

  return (
    <div ref={ref} className={styles.container}>
      <span onClick={handleClick} className="material-icons">
        more_vert
      </span>
      {isOverlayVisible && (
        <ul className={styles.menu}>
          <li onClick={handleEdit}>Rediģēt</li>
          <li onClick={handleDelete}>Izdzēst</li>
        </ul>
      )}
    </div>
  );
}
