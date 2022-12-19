import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingListLayout } from "../components/Layouts";
import Header from "../components/shoppingList/Header";
import { dbCreateProduct } from "../database/createProduct";
import { dbUpdateShoppingListLastProductUid } from "../database/updateShoppingListLastProductUid";
import { useScreenSizeType } from "../hooks/useScreenSizeType";
import { useShoppingListContext } from "../hooks/useShoppingListContext";
import Product from "../types/Product";
import styles from "./styles/AddProduct.module.css";

export default function AddProduct() {
  const navigate = useNavigate();
  const shopListContext = useShoppingListContext();

  const nameField = useRef<HTMLInputElement>(null);
  const amountField = useRef<HTMLInputElement>(null);
  const unitsField = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    const uid = parseInt(
      `${shopListContext!.id}000${shopListContext!.lastProductUid + 1}`
    );
    const rank =
      shopListContext!.products.length > 0
        ? shopListContext!.products[shopListContext!.products.length - 1].rank +
          100
        : 100;
    const name = nameField.current!.value.trim();
    const amount =
      amountField.current?.value === ""
        ? 0
        : parseInt(amountField.current!.value.trim());
    const units = unitsField.current!.value.trim();

    const product = new Product(
      uid,
      rank,
      name,
      amount,
      units,
      shopListContext!.id
    );
    dbCreateProduct(product);
    shopListContext?.addProduct(product);
    dbUpdateShoppingListLastProductUid(
      shopListContext!.id,
      shopListContext!.lastProductUid + 1
    );
    shopListContext?.setLastProductUid(shopListContext!.lastProductUid + 1);
    navigate(-1);
  }

  const mainContentBlock = (
    <>
      <Header title="Pievienot preci" />
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          <span>Nosaukums</span>
          <input ref={nameField} required></input>
        </label>
        <label>
          <span>Daudzums</span>
          <input ref={amountField}></input>
        </label>
        <label>
          <span>Mērvienība</span>
          <input ref={unitsField}></input>
        </label>
        <button>Apstiprināt</button>
      </form>
    </>
  );

  const actionsBlock = (
    <button onClick={() => navigate(-1)} className={styles["action-button"]}>
      Atcelt
    </button>
  );

  return (
    <ShoppingListLayout mainContent={mainContentBlock} actions={actionsBlock} />
  );
}
