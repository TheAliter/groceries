import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import dbCreateProduct from "../database/createProduct";
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

    const id = (shopListContext?.products.length ?? 100) + 1;
    const name = nameField.current?.value ?? "";
    const amount = parseInt(amountField.current?.value ?? "0");
    const units = unitsField.current?.value ?? "";

    const product = new Product(id, name, amount, units, shopListContext?.id);
    shopListContext?.addProduct(product);
    dbCreateProduct(product);
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
