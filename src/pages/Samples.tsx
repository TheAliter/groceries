import { useNavigate } from "react-router-dom";
import { useScreenSizeType } from "../hooks/useScreenSizeType";
import { useShoppingListContext } from "../hooks/useShoppingListContext";
import { ShoppingListLayout } from "../components/Layouts";
import Header from "../components/shoppingList/Header";
import SampleMenu from "../components/shoppingList/SampleMenu";
import styles from "./styles/Samples.module.css";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { dbUpdateSample } from "../database/updateSample";
import Sample from "../types/Sample";
import Product from "../types/Product";
import { dbCreateProduct } from "../database/createProduct";
import Snackbar from "@mui/material/Snackbar";
import React, { useState } from "react";
import { dbUpdateShoppingListLastProductUid } from "../database/updateShoppingListLastProductUid";
import { Alert } from "@mui/material";
import { SnackbarCloseReason } from "@mui/base";

export default function Samples() {
  const navigate = useNavigate();
  const shopListContext = useShoppingListContext();
  const screenType = useScreenSizeType();
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [isSuccessfulAdd, setIsSuccessfulAdd] = useState(true);
  const [snackbarKey, setSnackbarKey] = useState(
    Math.floor(Math.random() * 1000000)
  );

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
      shopListContext!.samples[source.index].toMap()
    );

    if (source.index > destination.index) {
      activeSample.rank = shopListContext!.samples[destination.index].rank - 1;
    } else {
      activeSample.rank = shopListContext!.samples[destination.index].rank + 1;
    }
    shopListContext?.updateSample(activeSample);
    dbUpdateSample(activeSample);
  }

  function handleSampleClick(sample: Sample) {
    setSnackbarKey(Math.floor(Math.random() * 1000000));

    if (
      shopListContext?.products.some(
        (product) =>
          product.name === sample.name &&
          product.amount === sample.amount &&
          product.units === sample.units
      )
    ) {
      setIsSuccessfulAdd(false);
    } else {
      setIsSuccessfulAdd(true);
      const uid = parseInt(
        `${shopListContext!.id}000${shopListContext!.lastProductUid + 1}`
      );
      dbCreateProduct(Product.fromSampleMap(sample.toMap(), uid));
      dbUpdateShoppingListLastProductUid(
        shopListContext!.id,
        shopListContext!.lastProductUid + 1
      );
      shopListContext?.addProduct(Product.fromSampleMap(sample.toMap(), uid));
      shopListContext?.setLastProductUid(shopListContext!.lastProductUid + 1);
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
    navigate("/shopping-list/" + shopListContext?.accessKey + "/add-sample");
  }

  function handleShowProducts() {
    navigate("/shopping-list/" + shopListContext?.accessKey + "/");
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
              {shopListContext?.samples.length === 0 ? (
                <div className={styles["empty-list"]}>
                  Sagatavju saraksts ir tukšs
                </div>
              ) : (
                shopListContext?.samples
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
      {screenType === "Desktop" && (
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
