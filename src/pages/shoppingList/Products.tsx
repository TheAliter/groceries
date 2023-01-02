import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/Products.module.css";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { useProductsStore, useShoppingListStore } from "../../store/_store";
import {
  ScreenType,
  useReorderNewRank,
  useScreenSizeType,
} from "../../hooks/_hooks";
import { Product } from "../../types/_types";
import {
  Header,
  ProductMenu,
  ShoppingListMenu,
} from "../../components/_components";
import { ShoppingListLayout } from "../../layouts/_layouts";

export function Products() {
  const navigate = useNavigate();
  const screenType = useScreenSizeType();
  const [showMenu, setShowMenu] = useState(false);
  const productsStore = useProductsStore();
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

    const activeProduct = Product.fromMap(
      productsStore.products[source.index].toMap()
    );

    activeProduct.rank = useReorderNewRank(
      source.index,
      destination.index,
      productsStore.products
    );
    productsStore.updateProduct(activeProduct, { updateDB: true });
  }

  function handleEdit(uid: number) {
    navigate(
      "/shopping-list/" + shoppingListStore.accessKey + "/edit-product/" + uid
    );
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
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="0">
          {(provided) => (
            <ul
              className={styles.products}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {productsStore.products.length === 0 ? (
                <div className={styles["empty-list"]}>
                  Iepirkuma saraksts ir tukšs
                </div>
              ) : (
                productsStore.products
                  .sort((a, b) => a.rank - b.rank)
                  .map((product, index) => (
                    <Draggable
                      key={product.uid.toString()}
                      draggableId={product.uid.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          onClick={() => handleEdit(product.uid)}
                          ref={provided.innerRef}
                          className={styles.product}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <span>{product.name} </span>
                          <span className={styles.dots}></span>
                          <span>
                            {product.amount > 0 && product.amount}{" "}
                            {product.units !== "" && product.units}
                          </span>
                          <ProductMenu uid={product.uid}></ProductMenu>
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
        onClick={handleNavigateToAddProduct}
        className={styles["main-action-btn"]}
      >
        Pievienot preci
      </button>
      {screenType === ScreenType.DESKTOP && (
        <button
          onClick={handleShowSamples}
          className={styles["main-action-btn"]}
        >
          Sagataves
        </button>
      )}
    </div>
  );

  const menuBlock =
    screenType === ScreenType.DESKTOP || showMenu ? (
      <ShoppingListMenu handleCloseMenu={() => setShowMenu(false)} />
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
