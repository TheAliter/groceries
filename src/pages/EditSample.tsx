import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShoppingListLayout } from "../components/Layouts";
import Header from "../components/shoppingList/Header";
import { dbUpdateSample } from "../database/updateSample";
import { useShoppingListContext } from "../hooks/useShoppingListContext";
import Sample from "../types/Sample";
import styles from "./styles/EditSample.module.css";

export default function EditSample() {
  const navigate = useNavigate();
  const shopListContext = useShoppingListContext();
  const { uid: sampleInEditUid } = useParams();
  const sampleInEdit = shopListContext?.samples.find(
    (sample) => sample.uid === parseInt(sampleInEditUid!)
  );

  const nameField = useRef<HTMLInputElement>(null);
  const amountField = useRef<HTMLInputElement>(null);
  const unitsField = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    const name = nameField.current?.value.trim() ?? "";
    const amount = parseInt(amountField.current?.value.trim() ?? "0");
    const units = unitsField.current?.value.trim() ?? "";

    const updatedSample = new Sample(
      sampleInEdit!.uid,
      sampleInEdit!.rank,
      name,
      amount,
      units,
      shopListContext!.id
    );
    shopListContext?.updateSample(updatedSample);
    dbUpdateSample(updatedSample);
    navigate(-1);
  }

  const mainContentBlock = (
    <>
      <Header
        title="Rediģēt sagatavi"
      />
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          <span>Nosaukums</span>
          <input
            ref={nameField}
            defaultValue={sampleInEdit?.name}
            required
          ></input>
        </label>
        <label>
          <span>Daudzums</span>
          <input
            ref={amountField}
            defaultValue={
              sampleInEdit!.amount !== 0 ? sampleInEdit?.amount : ""
            }
          ></input>
        </label>
        <label>
          <span>Mērvienība</span>
          <input ref={unitsField} defaultValue={sampleInEdit?.units}></input>
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
