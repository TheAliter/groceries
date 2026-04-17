import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import { Alert, Button } from "@mui/material";
import { SnackbarCloseReason } from "@mui/base";
import styles from "./styles/Products.module.css";
import { useProductsStore, useShoppingListStore } from "../../store/_store";
import { ScreenType, useScreenSizeType } from "../../hooks/_hooks";
import {
  DragableProductsList,
  Header,
  ShoppingListMenu,
  SwipableProductsList,
} from "../../components/_components";
import { ShoppingListLayout } from "../../layouts/_layouts";
import { Product } from "../../types/_types";

export function Products() {
  const navigate = useNavigate();
  const screenType = useScreenSizeType();
  const [showMenu, setShowMenu] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [showDeleteSnackbar, setShowDeleteSnackbar] = useState(false);
  const [deleteSnackbarKey, setDeleteSnackbarKey] = useState(0);
  const [deletedProductSnapshot, setDeletedProductSnapshot] =
    useState<Product | null>(null);
  const productsStore = useProductsStore();
  const shoppingListStore = useShoppingListStore();

  function handleRequestDeleteProduct(product: Product) {
    const snapshot = Product.fromMap(product.toMap());
    setDeletedProductSnapshot(snapshot);
    setDeleteSnackbarKey((key) => key + 1);
    productsStore.deleteProduct(product.uid, { updateDB: true });
    setShowDeleteSnackbar(true);
  }

  function handleUndoDelete() {
    if (!deletedProductSnapshot) {
      return;
    }
    productsStore.addProduct(deletedProductSnapshot, {
      updateDB: true,
      updateImage: false,
    });
    setDeletedProductSnapshot(null);
    setShowDeleteSnackbar(false);
  }

  function handleDeleteSnackbarClose(
    _event: React.SyntheticEvent | Event,
    _reason?: SnackbarCloseReason
  ) {
    setShowDeleteSnackbar(false);
    setDeletedProductSnapshot(null);
  }

  function handleNavigateToAddProduct() {
    navigate("/shopping-list/" + shoppingListStore.accessKey + "/add-product");
  }

  function handleShowSamples() {
    navigate("/shopping-list/" + shoppingListStore.accessKey + "/samples");
  }
  const mainContentBlock = (
    <>
      <Header
        title="Iepirkumu saraksts"
        handleMenuShow={() => setShowMenu(true)}
        showMenuIcon={true}
        showSamplesIcon={true}
      />
      {reordering ? (
        <DragableProductsList
          onRequestDeleteProduct={handleRequestDeleteProduct}
        />
      ) : (
        <SwipableProductsList
          onRequestDeleteProduct={handleRequestDeleteProduct}
        />
      )}
    </>
  );

  const actionsBlock = (
    <div className={styles["actions-block"]}>
      {screenType !== ScreenType.DESKTOP && reordering ? (
        <button
          onClick={() => setReordering(!reordering)}
          className={styles["main-action-btn"] + " accent"}
        >
          Beigt pārkārtošanu
        </button>
      ) : (
        <button
          onClick={handleNavigateToAddProduct}
          className={styles["main-action-btn"]}
        >
          Pievienot preci
        </button>
      )}
      {screenType === ScreenType.DESKTOP && (
        <>
          <button
            onClick={handleShowSamples}
            className={styles["main-action-btn"]}
          >
            Sagataves
          </button>
          <button
            onClick={() => setReordering(!reordering)}
            className={
              styles["main-action-btn"] + (reordering ? " accent" : "")
            }
          >
            {reordering ? "Beigt pārkārtošanu" : "Pārkārtot sarakstu"}
          </button>
        </>
      )}
    </div>
  );

  // TODO show some indicator on mobile that reordering is active

  const menuBlock =
    screenType === ScreenType.DESKTOP || showMenu ? (
      <ShoppingListMenu
        handleCloseMenu={() => setShowMenu(false)}
        toogleReordering={() => setReordering(!reordering)}
        reordering={reordering}
      />
    ) : (
      <></>
    );
  return (
    <>
      <ShoppingListLayout
        mainContent={mainContentBlock}
        actions={actionsBlock}
        menu={menuBlock}
      />
      <Snackbar
        key={deleteSnackbarKey}
        open={showDeleteSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={2000}
        onClose={handleDeleteSnackbarClose}
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
              onClick={handleUndoDelete}
            >
              Atcelt
            </Button>
          }
        >
          Prece izdzēsta
        </Alert>
      </Snackbar>
    </>
  );
}
