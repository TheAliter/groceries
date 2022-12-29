import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./styles/EditProduct.module.css";
import { useProductsStore } from "../../store/_store";
import { Product } from "../../types/_types";
import { Header } from "../../components/_components";
import { ShoppingListLayout } from "../../layouts/_layouts";
import _ from "lodash";

export default function EditProduct() {
  const navigate = useNavigate();
  const { uid: productInEditUid } = useParams();
  const productsStore = useProductsStore();
  const productInEdit = productsStore.products.find(
    (product) => product.uid === parseInt(productInEditUid!)
  );

  const nameField = useRef<HTMLInputElement>(null);
  const amountField = useRef<HTMLInputElement>(null);
  const unitsField = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    const name = nameField.current!.value.trim();
    let amountValue = _.toNumber(amountField.current!.value.trim());
    const amount = isNaN(amountValue) ? 0 : amountValue;
    const units = unitsField.current!.value.trim();

    const updatedProduct = new Product({
      ...productInEdit!,
      name,
      amount,
      units,
    });
    productsStore.updateProduct(updatedProduct, { updateDB: true });
    navigate(-1);
  }

  const mainContentBlock = (
    <>
      <Header title="Rediģēt preci" />
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          <span>Nosaukums</span>
          <input
            ref={nameField}
            defaultValue={productInEdit!.name}
            required
          ></input>
        </label>
        <label>
          <span>Daudzums</span>
          <input
            ref={amountField}
            type="number"
            defaultValue={
              productInEdit!.amount === 0 ? "" : productInEdit!.amount
            }
          ></input>
        </label>
        <label>
          <span>Mērvienība</span>
          <input ref={unitsField} defaultValue={productInEdit!.units}></input>
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

  return (
    <ShoppingListLayout mainContent={mainContentBlock} actions={actionsBlock} />
  );
}
