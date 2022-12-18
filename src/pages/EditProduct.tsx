import React, { useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { ShoppingListLayout } from "../components/Layouts";
import Header from "../components/shoppingList/Header";
import ShoppingListMenu from "../components/shoppingList/ShoppingListMenu";
import { dbUpdateProduct } from "../database/updateProduct";
import { useScreenSizeType } from "../hooks/useScreenSizeType";
import { useShoppingListContext } from "../hooks/useShoppingListContext";
import Product from "../types/Product";
import styles from "./styles/EditProduct.module.css";

export default function EditProduct() {
  const navigate = useNavigate();
  const shopListContext = useShoppingListContext();
  const screenType = useScreenSizeType();
  const { uid: productInEditUid } = useParams();
  const [showMenu, setShowMenu] = useState(false);
  const productInEdit = shopListContext?.products.find(
    (product) => product.uid === parseInt(productInEditUid!)
  );

  const nameField = useRef<HTMLInputElement>(null);
  const amountField = useRef<HTMLInputElement>(null);
  const unitsField = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    const name = nameField.current?.value.trim() ?? "";
    const amount = parseInt(amountField.current?.value.trim() ?? "0");
    const units = unitsField.current?.value.trim() ?? "";

    const updatedProduct = new Product(
      productInEdit!.uid,
      productInEdit!.rank,
      name,
      amount,
      units,
      shopListContext!.id
    );
    shopListContext?.updateProduct(updatedProduct);
    dbUpdateProduct(updatedProduct);
    navigate(-1);
  }

  const mainContentBlock = (
    <>
      <Header handleMenuShow={() => setShowMenu(true)} />
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          <span>Nosaukums</span>
          <input
            ref={nameField}
            defaultValue={productInEdit?.name}
            required
          ></input>
        </label>
        <label>
          <span>Daudzums</span>
          <input
            ref={amountField}
            defaultValue={
              productInEdit!.amount !== 0 ? productInEdit?.amount : ""
            }
          ></input>
        </label>
        <label>
          <span>Mērvienība</span>
          <input ref={unitsField} defaultValue={productInEdit?.units}></input>
        </label>
        <button>Labot</button>
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
      <ShoppingListMenu
        handleCloseMenu={() => setShowMenu(false)}
      ></ShoppingListMenu>
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
