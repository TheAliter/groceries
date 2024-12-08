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
import { useShowCheckmark } from "../../hooks/samples/useShowCheckmark";

export function Samples() {
  const navigate = useNavigate();
  const screenType = useScreenSizeType();
  const [showSearch, setShowSearch] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [isSuccessfulAdd, setIsSuccessfulAdd] = useState(true);
  const [snackbarKey, setSnackbarKey] = useState(
    Math.floor(Math.random() * 1000000)
  );

  const [filteredSamples, setFilteredSamples] = useState<Sample[]>([]);
  const productsStore = useProductsStore();
  const samplesStore = useSampleStore();
  const shoppingListStore = useShoppingListStore();
  const showCheckmark = useShowCheckmark();
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const filtered = samplesStore.samples.filter((sample) =>
        sample.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSamples(filtered);
  }, [samplesStore.samples, searchTerm]);

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
    } else {
      setIsSuccessfulAdd(true);
      const uid = shoppingListStore.generateNewProductUid();
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

  function handleSnackBarClose(
    e: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) {
    setShowSnackBar(false);
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
            <div style={{position: 'relative', display: 'flex', marginBottom: '12px'}}>
                <input
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Preces nosaukums"
                    style={{ flex: "1"}}>
                </input>
                { searchTerm && <div onClick={handleSearchClear} style={{position: "absolute", right: '10px', height: "100%", alignContent: "center", width: "40px"}}>X</div>}
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
                .map((sample) => (
                    <li
                        onClick={() => handleSampleClick(sample)}
                        className={styles.sample}>

                        {showCheckmark(sample) && (
                            <span className={`${styles.checkmark} material-icons`}>
                                checkmark
                            </span>
                        )}

                        <span>{sample.name} </span>

                        <span className={styles.dots}></span>

                        <span>
                            {sample.amount > 0 && sample.amount}{" "}
                            {sample.units !== "" && sample.units}
                        </span>
                        
                        <SampleMenu uid={sample.uid}></SampleMenu>
                    </li>
                )))}
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
                      {(provided) => (
                        <li
                          onClick={() => handleSampleClick(sample)}
                          ref={provided.innerRef}
                          className={styles.sample}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {showCheckmark(sample) && (
                            <span
                              className={`${styles.checkmark} material-icons`}
                            >
                              checkmark
                            </span>
                          )}
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
