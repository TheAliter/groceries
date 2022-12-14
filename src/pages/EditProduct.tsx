import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dbCreateProduct from "../database/createProduct";
import dbUpdateProduct from "../database/updateProduct";
import { useShoppingListContext } from "../hooks/useShoppingListContext";
import Product from "../types/Product";
import styles from "./styles/AddProduct.module.css";

export default function EditProduct() {
  const navigate = useNavigate();
  const shopListContext = useShoppingListContext();
  const { id } = useParams();
  const product = shopListContext?.products.find(
    (entry) => entry.id === parseInt(id ?? "0")
  );

  const nameField = useRef<HTMLInputElement>(null);
  const amountField = useRef<HTMLInputElement>(null);
  const unitsField = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    const name = nameField.current?.value ?? "";
    const amount = parseInt(amountField.current?.value ?? "0");
    const units = unitsField.current?.value ?? "";

    const product = new Product(
      parseInt(id ?? "0"),
      name,
      amount,
      units,
      shopListContext?.id
    );
    shopListContext?.updateProduct(product);
    dbUpdateProduct(product);
    navigate(-1);
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Nosaukums</span>
          <input ref={nameField} defaultValue={product?.name} required></input>
        </label>
        <label>
          <span>Daudzums</span>
          <input ref={amountField} defaultValue={product?.amount}></input>
        </label>
        <label>
          <span>Mērvienība</span>
          <input ref={unitsField} defaultValue={product?.units}></input>
        </label>
        <button>Labot</button>
      </form>
      <button onClick={() => navigate(-1)}>Atcelt</button>
    </div>
  );
}
