import { useNavigate } from "react-router-dom";
import styles from "./styles/Samples.module.css";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import Snackbar from "@mui/material/Snackbar";
import React, { ChangeEvent, ChangeEventHandler, useEffect, useRef, useState } from "react";
import { Alert, Button } from "@mui/material";
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
import { useShowCheckmark } from "../../hooks/samples/useShowCheckmark";

function OnListCheckIndicator() {
  return (
    <span className={styles.onListCheckWrap} aria-hidden="true">
      <svg
        className={styles.onListCheckSvg}
        viewBox="0 0 24 24"
        focusable="false"
      >
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    </span>
  );
}

export function Samples() {
  const navigate = useNavigate();
  const screenType = useScreenSizeType();
  const [showSearch, setShowSearch] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [isSuccessfulAdd, setIsSuccessfulAdd] = useState(true);
  const [lastAddedProductUid, setLastAddedProductUid] = useState<number | null>(
    null
  );
  const [snackbarKey, setSnackbarKey] = useState(
    Math.floor(Math.random() * 1000000)
  );

  const [showDeleteSampleSnackbar, setShowDeleteSampleSnackbar] =
    useState(false);
  const [deleteSampleSnackbarKey, setDeleteSampleSnackbarKey] = useState(0);
  const [deletedSampleSnapshot, setDeletedSampleSnapshot] =
    useState<Sample | null>(null);

  const [filteredSamples, setFilteredSamples] = useState<Sample[]>([]);
  const productsStore = useProductsStore();
  const samplesStore = useSampleStore();
  const shoppingListStore = useShoppingListStore();
  const showCheckmark = useShowCheckmark();
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputReference = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const filtered = samplesStore.samples.filter((sample) =>
        sample.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSamples(filtered);
  }, [samplesStore.samples, searchTerm]);

  useEffect(() => {
    if (showSearch) {
      searchInputReference.current?.focus();
    }
  }, [showSearch]);

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
    samplesStore.updateSample(activeSample, {
      updateDB: true,
      updateImage: false,
    });
  }

  function handleSampleClick(sample: Sample) {
    setSnackbarKey(Math.floor(Math.random() * 1000000));

    if (productsStore.products.some((product) => product.sameAs(sample))) {
      setIsSuccessfulAdd(false);
      setLastAddedProductUid(null);
    } else {
      setIsSuccessfulAdd(true);
      const uid = shoppingListStore.generateNewProductUid();
      setLastAddedProductUid(uid);
      const newProduct = Product.fromMap({ ...sample.toMap(), uid });
      productsStore.addProduct(newProduct, {
        updateDB: true,
        updateImage: false,
      });
      shoppingListStore.setLastProductUid(
        shoppingListStore.lastProductUid + 1,
        { updateDB: true }
      );
    }
    setShowSnackBar(true);
  }

  function handleCancelSuccessfulAdd() {
    if (lastAddedProductUid !== null) {
      productsStore.deleteProduct(lastAddedProductUid, { updateDB: true });
      const revertedLastProductUid = Math.max(
        0,
        shoppingListStore.lastProductUid - 1
      );
      shoppingListStore.setLastProductUid(revertedLastProductUid, {
        updateDB: true,
      });
    }
    setLastAddedProductUid(null);
    setShowSnackBar(false);
  }

  function handleSnackBarClose(
    e: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) {
    setLastAddedProductUid(null);
    setShowSnackBar(false);
  }

  function handleRequestDeleteSample(sampleUid: number) {
    const sampleToDelete = samplesStore.samples.find(
      (sample) => sample.uid === sampleUid
    );
    if (!sampleToDelete) {
      return;
    }
    const snapshot = Sample.fromMap(sampleToDelete.toMap());
    setDeletedSampleSnapshot(snapshot);
    setDeleteSampleSnackbarKey((key) => key + 1);
    samplesStore.deleteSample(sampleUid, { updateDB: true });
    setShowDeleteSampleSnackbar(true);
  }

  function handleUndoDeleteSample() {
    if (!deletedSampleSnapshot) {
      return;
    }
    samplesStore.addSample(deletedSampleSnapshot, {
      updateDB: true,
      updateImage: false,
    });
    setDeletedSampleSnapshot(null);
    setShowDeleteSampleSnackbar(false);
  }

  function handleDeleteSampleSnackbarClose(
    _event: React.SyntheticEvent | Event,
    _reason?: SnackbarCloseReason
  ) {
    setShowDeleteSampleSnackbar(false);
    setDeletedSampleSnapshot(null);
  }

  function toggleSearch() {
    setShowSearch(!showSearch)
    setSearchTerm('')
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setSearchTerm(value);
  }

  function handleSearchClear() {
    setSearchTerm('');
  }

  function handleNavigateToAddSample() {
    navigate("/shopping-list/" + shoppingListStore.accessKey + "/add-sample");
  }

  function handleShowProducts() {
    navigate("/shopping-list/" + shoppingListStore.accessKey + "/");
  }
  const mainContentBlock = (
    <>
        <Header 
            title="Sagataves" 
            showSearchIcon={true}
            toggleSearch={toggleSearch}
            showProductsIcon={true} 
        />

        {showSearch && (
            <div className={styles["search-field-row"]}>
                <input
                    ref={searchInputReference}
                    className={`${styles["search-input"]}${
                      searchTerm ? ` ${styles["search-input-with-clear"]}` : ""
                    }`}
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Preces nosaukums"
                />
                {searchTerm ? (
                    <button
                        type="button"
                        className={styles["search-clear-button"]}
                        onClick={handleSearchClear}
                        aria-label="Notīrīt meklēšanu"
                    >
                        <span className="material-icons" aria-hidden="true">
                            close
                        </span>
                    </button>
                ) : null}
            </div>
        )}

        { searchTerm ?
          (<ul
            className={styles.samples}
          >
            {filteredSamples.length === 0 ? (
              <div className={styles["empty-list"]}>
                Nav atrasta neviena sagatave
              </div>
            ) : (
              filteredSamples
                .sort((a, b) => a.rank - b.rank)
                .map((sample) => {
                  const isOnShoppingList = showCheckmark(sample);
                  return (
                    <li
                        key={sample.uid}
                        onClick={() => handleSampleClick(sample)}
                        className={`${styles.sample}${
                          isOnShoppingList
                            ? ` ${styles.sampleOnShoppingList}`
                            : ""
                        }`}
                    >
                        {sample.imageName ? (
                          <span
                            className={styles.imageBookmark}
                            role="img"
                            aria-label="Sagatavai ir attēls"
                          />
                        ) : null}

                        {isOnShoppingList ? <OnListCheckIndicator /> : null}

                        <span>{sample.name} </span>

                        <span className={styles.dots}></span>

                        <span>
                            {sample.amount > 0 && sample.amount}{" "}
                            {sample.units !== "" && sample.units}
                        </span>
                        
                        <SampleMenu
                          uid={sample.uid}
                          onRequestDeleteSample={handleRequestDeleteSample}
                        ></SampleMenu>
                    </li>
                  );
                })
            )}
          </ul>)
      : (<DragDropContext onDragEnd={handleDragEnd}>
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
                      {(provided) => {
                        const isOnShoppingList = showCheckmark(sample);
                        return (
                        <li
                          onClick={() => handleSampleClick(sample)}
                          ref={provided.innerRef}
                          className={`${styles.sample}${
                            isOnShoppingList
                              ? ` ${styles.sampleOnShoppingList}`
                              : ""
                          }`}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {sample.imageName ? (
                            <span
                              className={styles.imageBookmark}
                              role="img"
                              aria-label="Sagatavai ir attēls"
                            />
                          ) : null}

                          {isOnShoppingList ? <OnListCheckIndicator /> : null}
                          <span>{sample.name} </span>
                          <span className={styles.dots}></span>
                          <span>
                            {sample.amount > 0 && sample.amount}{" "}
                            {sample.units !== "" && sample.units}
                          </span>
                          <SampleMenu
                            uid={sample.uid}
                            onRequestDeleteSample={handleRequestDeleteSample}
                          ></SampleMenu>
                        </li>
                        );
                      }}
                    </Draggable>
                  ))
              )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>)}
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
          <Alert
            className={styles.snackbarAlert}
            severity="success"
            action={
              <Button
                className={styles.snackbarDismissOnSuccess}
                size="small"
                variant="outlined"
                color="inherit"
                disableElevation
                onClick={handleCancelSuccessfulAdd}
              >
                Atcelt
              </Button>
            }
          >
            Prece pievienota iepirkuma sarakstam
          </Alert>
        ) : (
          <Alert
            className={styles.snackbarAlert}
            severity="error"
            onClose={handleSnackBarClose}
          >
            Šāda prece jau ir iepirkuma sarakstā
          </Alert>
        )}
      </Snackbar>
      <Snackbar
        key={deleteSampleSnackbarKey}
        open={showDeleteSampleSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={2000}
        onClose={handleDeleteSampleSnackbarClose}
      >
        <Alert
          className={styles.deleteSnackbarDanger}
          severity="error"
          icon={
            <span
              className={`material-icons ${styles.deleteSnackbarAlertIcon}`}
              aria-hidden="true"
            >
              priority_high
            </span>
          }
          action={
            <Button
              className={styles.snackbarActionButton}
              size="small"
              variant="outlined"
              color="inherit"
              disableElevation
              onClick={handleUndoDeleteSample}
            >
              Atcelt
            </Button>
          }
        >
          Sagatave izdzēsta
        </Alert>
      </Snackbar>
    </>
  );
}
