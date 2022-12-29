import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./styles/EditSample.module.css";
import { useSampleStore } from "../../store/_store";
import { Sample } from "../../types/_types";
import { Header } from "../../components/_components";
import { ShoppingListLayout } from "../../layouts/_layouts";
import _ from "lodash";

export default function EditSample() {
  const navigate = useNavigate();
  const { uid: sampleInEditUid } = useParams();
  const samplesStore = useSampleStore();
  const sampleInEdit = samplesStore.samples.find(
    (sample) => sample.uid === parseInt(sampleInEditUid!)
  );

  const nameField = useRef<HTMLInputElement>(null);
  const amountField = useRef<HTMLInputElement>(null);
  const unitsField = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    const name = nameField.current?.value.trim() ?? "";
    let amountValue = _.toNumber(amountField.current!.value.trim());
    const amount = isNaN(amountValue) ? 0 : amountValue;
    const units = unitsField.current?.value.trim() ?? "";

    const updatedSample = new Sample({
      ...sampleInEdit!,
      name,
      amount,
      units,
    });
    samplesStore.updateSample(updatedSample, { updateDB: true });
    navigate(-1);
  }

  const mainContentBlock = (
    <>
      <Header title="Rediģēt sagatavi" />
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
            type="number"
            defaultValue={
              sampleInEdit!.amount === 0 ? "" : sampleInEdit!.amount
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
