import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./styles/EditSample.module.css";
import { useSampleStore } from "../../store/_store";
import { Sample } from "../../types/_types";
import { Header } from "../../components/_components";
import { ShoppingListLayout } from "../../layouts/_layouts";
import _ from "lodash";
import ImageUpload from "../../components/shoppingList/ImageUpload";
import { getProductImage } from "../../database/_database";

export function EditSample() {
  const navigate = useNavigate();
  const { uid: sampleInEditUid } = useParams();
  const samplesStore = useSampleStore();
  const sampleInEdit = samplesStore.samples.find(
    (sample) => sample.uid === parseInt(sampleInEditUid!)
  );

  const [sampleImage, setSampleImage] = useState<{
    data_url: string;
    file: File;
  } | null>(null);

  const nameField = useRef<HTMLInputElement>(null);
  const amountField = useRef<HTMLInputElement>(null);
  const unitsField = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const imageName = samplesStore.sampleImage
      ? samplesStore.sampleImage.name
      : "";

    const name = nameField.current?.value.trim() ?? "";
    let amountValue = _.toNumber(amountField.current!.value.trim());
    const amount = isNaN(amountValue) ? 0 : amountValue;
    const units = unitsField.current?.value.trim() ?? "";

    const updateImage = imageName !== sampleInEdit?.imageName;

    const updatedSample = new Sample({
      ...sampleInEdit!,
      imageName,
      name,
      amount,
      units,
    });
    samplesStore.updateSample(updatedSample, { updateDB: true, updateImage });
    navigate(-1);
  }

  const mainContentBlock = (
    <>
      <Header title="Rediģēt sagatavi" />
      <div className={styles.form}>
        <span>Bilde</span>
        <ImageUpload type="sample" image={sampleImage} />
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
        <button onClick={handleSubmit}>Saglabāt</button>
      </div>
    </>
  );

  const actionsBlock = (
    <button onClick={() => navigate(-1)} className={styles["action-button"]}>
      Atcelt
    </button>
  );

  useEffect(() => {
    if (sampleInEdit!.imageName) {
      getProductImage(sampleInEdit!.imageName).then((res) => {
        var file = new File([res!], sampleInEdit!.imageName);
        setSampleImage({
          data_url: URL.createObjectURL(res!),
          file,
        });
      });
    }
  }, []);

  return (
    <ShoppingListLayout mainContent={mainContentBlock} actions={actionsBlock} />
  );
}
