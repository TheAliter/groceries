import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/AddSample.module.css";
import { useSampleStore, useShoppingListStore } from "../../store/_store";
import { Sample } from "../../types/_types";
import { Header } from "../../components/_components";
import { ShoppingListLayout } from "../../layouts/_layouts";
import _ from "lodash";
import ImageUpload from "../../components/shoppingList/ImageUpload";

export function AddSample() {
  const navigate = useNavigate();
  const samplesStore = useSampleStore();
  const shoppingListStore = useShoppingListStore();

  const nameField = useRef<HTMLInputElement>(null);
  const amountField = useRef<HTMLInputElement>(null);
  const unitsField = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    const uid = shoppingListStore.generateNewSampleUid();
    const rank =
      samplesStore.samples.length > 0
        ? samplesStore.samples[samplesStore.samples.length - 1].rank + 1
        : 1;
    const imageName = samplesStore.sampleImage
      ? samplesStore.sampleImage.name
      : "";
    const name = nameField.current!.value.trim();
    let amountValue = _.toNumber(amountField.current!.value.trim());
    const amount = isNaN(amountValue) ? 0 : amountValue;
    const units = unitsField.current!.value.trim();

    const sample = new Sample({
      uid,
      rank,
      imageName,
      name,
      amount,
      units,
      shopListId: shoppingListStore.id,
    });
    samplesStore.addSample(sample, { updateDB: true });
    shoppingListStore.setLastSampleUid(shoppingListStore.lastSampleUid + 1, {
      updateDB: true,
    });
    navigate(-1);
  }

  const mainContentBlock = (
    <>
      <Header title="Pievienot sagatavi" />
      <div className={styles.form}>
        <span>Bilde</span>
        <ImageUpload type="sample" />
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
