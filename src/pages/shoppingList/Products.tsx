import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/Products.module.css";
import { useShoppingListStore } from "../../store/_store";
import { ScreenType, useScreenSizeType } from "../../hooks/_hooks";
import {
  DragableProductsList,
  Header,
  ShoppingListMenu,
  SwipableProductsList,
} from "../../components/_components";
import { ShoppingListLayout } from "../../layouts/_layouts";

export function Products() {
  const navigate = useNavigate();
  const screenType = useScreenSizeType();
  const [showMenu, setShowMenu] = useState(false);
  const [reordering, setReordering] = useState(false);
  const shoppingListStore = useShoppingListStore();

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
      {reordering ? <DragableProductsList /> : <SwipableProductsList />}
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
    <ShoppingListLayout
      mainContent={mainContentBlock}
      actions={actionsBlock}
      menu={menuBlock}
    />
  );
}
