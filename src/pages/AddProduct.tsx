import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { dbCreateProduct } from "../database/createProduct";
import { dbUpdateShoppingListLastProductUid } from "../database/updateShoppingListLastProductUid";
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
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
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
      <button onClick={() => navigate(-1)}>Atcelt</button>
    </div>
  );
}
