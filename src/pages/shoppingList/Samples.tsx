import { useNavigate } from "react-router-dom";
import styles from "./styles/Samples.module.css";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import Snackbar from "@mui/material/Snackbar";
import React, { useState } from "react";
import { Alert } from "@mui/material";
import { SnackbarCloseReason } from "@mui/base";
import {
  useProductsStore,
  useSampleStore,
  useShoppingListStore,
} from "../../store/_store";
import {
  ScreenType,
  useReorderNewRank,
  useScreenSizeType,
} from "../../hooks/_hooks";
import { Product, Sample } from "../../types/_types";
import { Header, SampleMenu } from "../../components/_components";
import { ShoppingListLayout } from "../../layouts/_layouts";

export default function Samples() {
  const navigate = useNavigate();
  const screenType = useScreenSizeType();
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [isSuccessfulAdd, setIsSuccessfulAdd] = useState(true);
  const [snackbarKey, setSnackbarKey] = useState(
    Math.floor(Math.random() * 1000000)
  );
  const productsStore = useProductsStore();
  const samplesStore = useSampleStore();
  const shoppingListStore = useShoppingListStore();

  function handleDragEnd(result: DropResult) {
    const { destination, source } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const activeSample = Sample.fromMap(
      samplesStore.samples[source.index].toMap()
    );
    activeSample.rank = useReorderNewRank(
      source.index,
      destination.index,
      samplesStore.samples
    );
    samplesStore.updateSample(activeSample, { updateDB: true });
  }

  function handleSampleClick(sample: Sample) {
    setSnackbarKey(Math.floor(Math.random() * 1000000));

    if (productsStore.products.some((product) => product.sameAs(sample))) {
      setIsSuccessfulAdd(false);
    } else {
      setIsSuccessfulAdd(true);
      const uid = shoppingListStore.generateNewProductUid();
      const newProduct = Product.fromMap({ ...sample.toMap(), uid });
      productsStore.addProduct(newProduct, { updateDB: true });
      shoppingListStore.setLastProductUid(
        shoppingListStore.lastProductUid + 1,
        { updateDB: true }
      );
    }
    setShowSnackBar(true);
  }

  function handleSnackBarClose(
    e: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) {
    setShowSnackBar(false);
  }

  function handleNavigateToAddSample() {
    navigate("/shopping-list/" + shoppingListStore.accessKey + "/add-sample");
  }

  function handleShowProducts() {
    navigate("/shopping-list/" + shoppingListStore.accessKey + "/");
  }
  const mainContentBlock = (
    <>
      <Header title="Sagataves" showProductsIcon={true} />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="0">
          {(provided) => (
            <ul
              className={styles.samples}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {samplesStore.samples.length === 0 ? (
                <div className={styles["empty-list"]}>
                  Sagatavju saraksts ir tukšs
                </div>
              ) : (
                samplesStore.samples
                  .sort((a, b) => a.rank - b.rank)
                  .map((sample, index) => (
                    <Draggable
                      key={sample.uid.toString()}
                      draggableId={sample.uid.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          onClick={() => handleSampleClick(sample)}
                          ref={provided.innerRef}
                          className={styles.sample}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <span>{sample.name} </span>
                          <span className={styles.dots}></span>
                          <span>
                            {sample.amount > 0 && sample.amount}{" "}
                            {sample.units !== "" && sample.units}
                          </span>
                          <SampleMenu uid={sample.uid}></SampleMenu>
                        </li>
                      )}
                    </Draggable>
                  ))
              )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );

  const actionsBlock = (
    <div className={styles["actions-block"]}>
      <button
        onClick={handleNavigateToAddSample}
        className={styles["main-action-btn"]}
      >
        Pievienot sagatavi
      </button>
      {screenType === ScreenType.DESKTOP && (
        <button
          onClick={handleShowProducts}
          className={styles["main-action-btn"]}
        >
          Iepirkumu saraksts
        </button>
      )}
    </div>
  );

  return (
    <>
      <ShoppingListLayout
        mainContent={mainContentBlock}
        actions={actionsBlock}
      />
      <Snackbar
        key={snackbarKey}
        open={showSnackBar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={2000}
        onClose={handleSnackBarClose}
      >
        {isSuccessfulAdd ? (
          <Alert severity="success" onClose={handleSnackBarClose}>
            Prece pievienota iepirkuma sarakstam
          </Alert>
        ) : (
          <Alert severity="error" onClose={handleSnackBarClose}>
            Šāda prece jau ir iepirkuma sarakstā
          </Alert>
        )}
      </Snackbar>
    </>
  );
}
