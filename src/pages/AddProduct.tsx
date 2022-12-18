import React, { useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ShoppingListLayout } from "../components/Layouts";
import Header from "../components/shoppingList/Header";
import ShoppingListMenu from "../components/shoppingList/ShoppingListMenu";
import { dbCreateProduct } from "../database/createProduct";
import { dbUpdateShoppingListLastProductUid } from "../database/updateShoppingListLastProductUid";
import { useScreenSizeType } from "../hooks/useScreenSizeType";
import { useShoppingListContext } from "../hooks/useShoppingListContext";
import Product from "../types/Product";
import styles from "./styles/AddProduct.module.css";

export default function AddProduct() {
  const navigate = useNavigate();
  const shopListContext = useShoppingListContext();
  const screenType = useScreenSizeType();
  const [showMenu, setShowMenu] = useState(false);

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
    // last_product_uid is without modifications
    dbUpdateShoppingListLastProductUid(
      shopListContext!.id,
      shopListContext!.lastProductUid + 1
    );
    shopListContext?.setLastProductUid(shopListContext!.lastProductUid + 1);
    navigate(-1);
  }

  const mainContentBlock = (
    <>
      <Header handleMenuShow={() => setShowMenu(true)} />
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

  const menuBlock =
    screenType === "Desktop" || showMenu ? (
      <ShoppingListMenu handleCloseMenu={() => setShowMenu(false)} />
    ) : (
      <></>
    );

  return (
    <ShoppingListLayout
      mainContent={mainContentBlock}
      actions={actionsBlock}
      menu={menuBlock}
    />
  );
}
