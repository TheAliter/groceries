import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./styles/EditProduct.module.css";
import { useProductsStore } from "../../store/_store";
import { Product } from "../../types/_types";
import { Header } from "../../components/_components";
import { ShoppingListLayout } from "../../layouts/_layouts";
import _ from "lodash";
import { getProductImage } from "../../database/_database";
import ImageUpload from "../../components/shoppingList/ImageUpload";

export function EditProduct() {
  const navigate = useNavigate();
  const { uid: productInEditUid } = useParams();
  const productsStore = useProductsStore();
  const productInEdit = productsStore.products.find(
    (product) => product.uid === parseInt(productInEditUid!)
  );

  const [productImage, setProductImage] = useState<{
    data_url: string;
    file: File;
  } | null>(null);
  const nameField = useRef<HTMLInputElement>(null);
  const amountField = useRef<HTMLInputElement>(null);
  const unitsField = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    const imageName = productsStore.productImage
      ? productsStore.productImage.name
      : "";
    const name = nameField.current!.value.trim();
    let amountValue = _.toNumber(amountField.current!.value.trim());
    const amount = isNaN(amountValue) ? 0 : amountValue;
    const units = unitsField.current!.value.trim();

    const updateImage = imageName !== productInEdit?.imageName;

    const updatedProduct = new Product({
      ...productInEdit!,
      imageName,
      name,
      amount,
      units,
    });

    productsStore.updateProduct(updatedProduct, {
      updateDB: true,
      updateImage,
    });

    navigate(-1);
  }

  useEffect(() => {
    if (productInEdit!.imageName) {
      getProductImage(productInEdit!.imageName).then((res) => {
        var file = new File([res!], productInEdit!.imageName);

        productsStore.productImage = file

        setProductImage({
          data_url: URL.createObjectURL(res!),
          file,
        });
      });
    }
  }, []);

  const mainContentBlock = (
    <>
      <Header title="Rediģēt preci" />

      <div className={styles.form}>
        <span>Bilde</span>

        <ImageUpload type="product" image={productImage} />

        {/* Nosaukums */}
        <label>
          <span>Nosaukums</span>

          <input
            ref={nameField}
            defaultValue={productInEdit!.name}
            required
          ></input>
        </label>

        {/* Daudzums */}
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

        {/* Mērvienība */}
        <label>
          <span>Mērvienība</span>

          <input ref={unitsField} defaultValue={productInEdit!.units}></input>
        </label>

        <button onClick={handleSubmit}>Saglabāt</button>
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
