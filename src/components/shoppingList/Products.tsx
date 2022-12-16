import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useScreenSizeType } from "../../hooks/useScreenSizeType";
import { useShoppingListContext } from "../../hooks/useShoppingListContext";
import Header from "./Header";
import ProductMenu from "./ProductMenu";
import ShoppingListMenu from "./ShoppingListMenu";
import styles from "./styles/Products.module.css";

export default function Products() {
  const navigate = useNavigate();
  const shopListContext = useShoppingListContext();
  const screenType = useScreenSizeType();
  const [showMenu, setShowMenu] = useState(false);

  function handleAddProduct() {
    navigate("/shopping-list/" + shopListContext?.accessKey + "/add-product");
  }

  return (
    <div className="shopping-list-base">
      <div className="left">
        <Header handleMenuShow={() => setShowMenu(true)} />
        <ul className={styles.products}>
          {shopListContext?.products.length === 0 ? (
            <div className={styles['empty-list']}>Iepirkuma saraksts ir tukšs</div>
          ) : (
            shopListContext?.products.map((product) => (
              <li key={product.uid} className={styles.product}>
                <span>{product.name} </span>
                <span className={styles.dots}></span>
                <span>
                  {product.amount > 0 && product.amount}{" "}
                  {product.units !== "" && product.units}
                </span>
                <ProductMenu uid={product.uid}></ProductMenu>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="right">
        <div className="actions">
          <button
            onClick={handleAddProduct}
            className={styles["main-action-btn"]}
          >
            Pievienot preci
          </button>
        </div>
        <div className="spacer"></div>
        {(screenType === "Desktop" || showMenu) && (
          <ShoppingListMenu handleCloseMenu={() => setShowMenu(false)} />
        )}
      </div>
    </div>
  );
}
