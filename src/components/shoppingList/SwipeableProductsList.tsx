import { useNavigate } from "react-router-dom";
import {
  LeadingActions,
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
} from "react-swipeable-list";
import { useProductsStore, useShoppingListStore } from "../../store/_store";
import { Product } from "../../types/_types";
import { ProductMenu } from "../_components";
import styles from "./styles/SwipableProductsList.module.css";
import "react-swipeable-list/dist/styles.css";
import { useState } from "react";

export default function SwipableProductsList() {
  const [mouseDownX, setMouseDownX] = useState(0);
  const productsStore = useProductsStore();
  const shoppingListStore = useShoppingListStore();
  const navigate = useNavigate();

  const leadingActions = (product: Product) => (
    <LeadingActions>
      <SwipeAction
        destructive={true}
        onClick={() =>
          productsStore.deleteProduct(product.uid, { updateDB: true })
        }
      >
        IZDZĒST
      </SwipeAction>
    </LeadingActions>
  );

  function handleEdit(uid: number) {
    navigate(
      "/shopping-list/" + shoppingListStore.accessKey + "/edit-product/" + uid
    );
  }

  return (
    <ul className={styles.products}>
      {productsStore.products.length === 0 ? (
        <div className={styles["empty-list"]}>Iepirkuma saraksts ir tukšs</div>
      ) : (
        <SwipeableList key={0} threshold={0.1}>
          {productsStore.products
            .sort((a, b) => a.rank - b.rank)
            .map((product) => (
              <SwipeableListItem
                key={product.uid.toString()}
                leadingActions={leadingActions(product)}
              >
                <li
                  onMouseDown={(e) => setMouseDownX(e.clientX)}
                  onMouseUp={(e) => {
                    if (e.clientX === mouseDownX) handleEdit(product.uid);
                  }}
                  className={styles.product}
                >
                  <span>{product.name} </span>
                  <span className={styles.dots}></span>
                  <span>
                    {product.amount > 0 && product.amount}{" "}
                    {product.units !== "" && product.units}
                  </span>
                  <div className={styles["image-indicator"]}>
                    {product.imageName && (
                      <span className="material-icons">circle</span>
                    )}
                  </div>
                </li>
              </SwipeableListItem>
            ))}
        </SwipeableList>
      )}
    </ul>
  );
}
