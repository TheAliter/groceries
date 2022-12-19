import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingListLayout } from "../components/Layouts";
import Header from "../components/shoppingList/Header";
import { dbCreateSample } from "../database/createSample";
import { dbUpdateShoppingListLastSampleUid } from "../database/updateShoppingListLastSampleUid";
import { useShoppingListContext } from "../hooks/useShoppingListContext";
import Sample from "../types/Sample";
import styles from "./styles/AddSample.module.css";

export default function AddSample() {
  const navigate = useNavigate();
  const shopListContext = useShoppingListContext();

  const nameField = useRef<HTMLInputElement>(null);
  const amountField = useRef<HTMLInputElement>(null);
  const unitsField = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    const uid = parseInt(
      `${shopListContext!.id}000${shopListContext!.lastSampleUid + 1}`
    );
    const rank =
      shopListContext!.samples.length > 0
        ? shopListContext!.samples[shopListContext!.samples.length - 1].rank +
          100
        : 100;
    const name = nameField.current!.value.trim();
    const amount =
      amountField.current?.value === ""
        ? 0
        : parseInt(amountField.current!.value.trim());
    const units = unitsField.current!.value.trim();

    const sample = new Sample(
      uid,
      rank,
      name,
      amount,
      units,
      shopListContext!.id
    );
    dbCreateSample(sample);
    shopListContext?.addSample(sample);
    dbUpdateShoppingListLastSampleUid(
      shopListContext!.id,
      shopListContext!.lastSampleUid + 1
    );
    shopListContext?.setLastSampleUid(shopListContext!.lastSampleUid + 1);
    navigate(-1);
  }

  const mainContentBlock = (
    <>
      <Header
        title="Pievienot sagatavi"
      />
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
