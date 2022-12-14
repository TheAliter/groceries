import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dbDeleteProduct from "../../database/deleteProduct";
import useComponentVisible from "../../hooks/useComponentVisible";
import { useShoppingListContext } from "../../hooks/useShoppingListContext";
import styles from "./styles/ProductMenu.module.css";

interface Props {
  id: number;
}

export default function ProductMenu({ id }: Props) {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible<HTMLDivElement>(false);
  const shopListContext = useShoppingListContext();
  const navigate = useNavigate();

  function handleClick() {
    setIsComponentVisible(!isComponentVisible);
  }

  function handleDelete() {
    shopListContext?.deleteProduct(id);
    dbDeleteProduct(shopListContext?.id ?? 0, id);
  }

  function handleEdit() {
    navigate(
      "/shopping-list/" + shopListContext?.accessKey + "/edit-product/" + id
    );
  }

  return (
    <div ref={ref} className={styles.container}>
      <span onClick={handleClick} className="material-icons">
        more_vert
      </span>
      {isComponentVisible && (
        <ul className={styles.menu}>
          <li onClick={handleEdit}>Rediģēt</li>
          <li onClick={handleDelete}>Izdzēst</li>
        </ul>
      )}
    </div>
  );
}
