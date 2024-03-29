import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/AddProduct.module.css";
import { useProductsStore, useShoppingListStore } from "../../store/_store";
import { Product } from "../../types/_types";
import { Header } from "../../components/_components";
import { ShoppingListLayout } from "../../layouts/_layouts";
import _ from "lodash";
import ImageUpload from "../../components/shoppingList/ImageUpload";

export function AddProduct() {
  const navigate = useNavigate();
  const productsStore = useProductsStore();
  const shoppingListStore = useShoppingListStore();

  const nameField = useRef<HTMLInputElement>(null);
  const amountField = useRef<HTMLInputElement>(null);
  const unitsField = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    const uid = shoppingListStore.generateNewProductUid();
    const rank =
      productsStore.products.length > 0
        ? productsStore.products[productsStore.products.length - 1].rank + 1
        : 1;

    const imageName = productsStore.productImage
      ? productsStore.productImage.name
      : "";
    const name = nameField.current!.value.trim();
    let amountValue = _.toNumber(amountField.current!.value.trim());
    const amount = isNaN(amountValue) ? 0 : amountValue;
    const units = unitsField.current!.value.trim();

    const product = new Product({
      uid,
      rank,
      imageName,
      name,
      amount,
      units,
      shopListId: shoppingListStore.id,
    });
    productsStore.addProduct(product, { updateDB: true, updateImage: true });
    shoppingListStore.setLastProductUid(shoppingListStore.lastProductUid + 1, {
      updateDB: true,
    });
    navigate(-1);
  }

  const mainContentBlock = (
    <>
      <Header title="Pievienot preci" />
      <div className={styles.form}>
        <span>Bilde</span>
        <ImageUpload type="product" />
        <label>
          <span>Nosaukums</span>
          <input ref={nameField} required></input>
        </label>
        <label>
          <span>Daudzums</span>
          <input ref={amountField} type="number"></input>
        </label>
        <label>
          <span>Mērvienība</span>
          <input ref={unitsField}></input>
        </label>
        <button onClick={handleSubmit}>Apstiprināt</button>
      </div>
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
