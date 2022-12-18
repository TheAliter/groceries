import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useScreenSizeType } from "../../hooks/useScreenSizeType";
import { useShoppingListContext } from "../../hooks/useShoppingListContext";
import { ShoppingListLayout } from "../Layouts";
import Header from "./Header";
import ProductMenu from "./ProductMenu";
import ShoppingListMenu from "./ShoppingListMenu";
import styles from "./styles/Products.module.css";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import { dbUpdateProduct } from "../../database/updateProduct";
import Product from "../../types/Product";

export default function Products() {
  const navigate = useNavigate();
  const shopListContext = useShoppingListContext();
  const screenType = useScreenSizeType();
  const [showMenu, setShowMenu] = useState(false);

  function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const activeProduct = Product.fromMap(
      shopListContext!.products[source.index].toMap()
    );

    if (source.index > destination.index) {
      activeProduct.rank =
        shopListContext!.products[destination.index].rank - 1;
    } else {
      activeProduct.rank =
        shopListContext!.products[destination.index].rank + 1;
    }
    shopListContext?.updateProduct(activeProduct);
    dbUpdateProduct(activeProduct);
  }

  function handleAddProduct() {
    navigate("/shopping-list/" + shopListContext?.accessKey + "/add-product");
  }
  // TODO test dnd on mobile
  const mainContentBlock = (
    <>
      <Header handleMenuShow={() => setShowMenu(true)} />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="0">
          {(provided) => (
            <ul
              className={styles.products}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {shopListContext?.products.length === 0 ? (
                <div className={styles["empty-list"]}>
                  Iepirkuma saraksts ir tukšs
                </div>
              ) : (
                shopListContext?.products
                  .sort((a, b) => a.rank - b.rank)
                  .map((product, index) => (
                    <Draggable
                      key={product.uid.toString()}
                      draggableId={product.uid.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <li
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
    <button onClick={handleAddProduct} className={styles["main-action-btn"]}>
      Pievienot preci
    </button>
  );

  const menuBlock =
    screenType === "Desktop" || showMenu ? (
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
