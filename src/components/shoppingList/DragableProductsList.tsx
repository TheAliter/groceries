import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import { useReorderNewRank } from "../../hooks/_hooks";
import { useProductsStore, useShoppingListStore } from "../../store/_store";
import { Product } from "../../types/_types";
import { ProductMenu } from "../_components";
import styles from "./styles/DragableProductsList.module.css";

export default function DragableProductsList() {
  const productsStore = useProductsStore();
  const shoppingListStore = useShoppingListStore();
  const navigate = useNavigate();

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
    productsStore.updateProduct(activeProduct, {
      updateDB: true,
      updateImage: false,
    });
  }

  function handleEdit(uid: number) {
    navigate(
      "/shopping-list/" + shoppingListStore.accessKey + "/edit-product/" + uid
    );
  }

  return (
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
  );
}
