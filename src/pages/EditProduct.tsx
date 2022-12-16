import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dbUpdateProduct } from "../database/updateProduct";
import { useShoppingListContext } from "../hooks/useShoppingListContext";
import Product from "../types/Product";
import styles from "./styles/AddProduct.module.css";

export default function EditProduct() {
  const navigate = useNavigate();
  const shopListContext = useShoppingListContext();
  const { uid: productInEditUid } = useParams();
  const productInEdit = shopListContext?.products.find(
    (product) => product.uid === parseInt(productInEditUid!)
  );

  const nameField = useRef<HTMLInputElement>(null);
  const amountField = useRef<HTMLInputElement>(null);
  const unitsField = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    const name = nameField.current?.value ?? "";
    const amount = parseInt(amountField.current?.value ?? "0");
    const units = unitsField.current?.value ?? "";

    const updatedProduct = new Product(
      productInEdit!.uid,
      name,
      amount,
      units,
      shopListContext!.id
    );
    shopListContext?.updateProduct(updatedProduct);
    dbUpdateProduct(updatedProduct);
    navigate(-1);
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
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
      <button onClick={() => navigate(-1)}>Atcelt</button>
    </div>
  );
}
