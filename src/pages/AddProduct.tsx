import React, { useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
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
      `${shopListContext!.id}000${shopListContext!.lastProductUid}`
    );
    const name = nameField.current!.value;
    const amount =
      amountField.current?.value === ""
        ? 0
        : parseInt(amountField.current!.value);
    const units = unitsField.current!.value;

    const product = new Product(uid, name, amount, units, shopListContext!.id);
    shopListContext?.addProduct(product);
    shopListContext?.setLastProductUid(shopListContext.lastProductUid + 1);
    dbCreateProduct(product);
    dbUpdateShoppingListLastProductUid(
      shopListContext!.id,
      shopListContext!.lastProductUid
    );
    navigate(-1);
  }

  return (
    <div className="shopping-list-base">
      <div className="left">
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
      </div>

      <div className="right">
        <div className="actions">
          <button
            onClick={() => navigate(-1)}
            className={styles["action-button"]}
          >
            Atcelt
          </button>
        </div>
        <div className="spacer"></div>
        {(screenType === "Desktop" || showMenu) && (
          <ShoppingListMenu handleCloseMenu={() => setShowMenu(false)} />
        )}
      </div>
    </div>
  );
}
