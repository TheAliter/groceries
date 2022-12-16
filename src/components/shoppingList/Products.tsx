import { useNavigate } from "react-router-dom";
import { useShoppingListContext } from "../../hooks/useShoppingListContext";
import ProductMenu from "./ProductMenu";
import styles from "./styles/Products.module.css";

export default function Products() {
  const navigate = useNavigate();
  const shopListContext = useShoppingListContext();

  function handleAddProduct() {
    navigate("/shopping-list/" + shopListContext?.accessKey + "/add-product");
  }

  return (
    <div className={styles.container}>
      <ul className={styles.products}>
        {shopListContext?.products.map((product) => (
          <li key={product.uid} className={styles.product}>
            <span>{product.name} </span>
            <span className={styles.dots}></span>
            <span>
              {product.amount > 0 && product.amount}{" "}
              {product.units !== "" && product.units}
            </span>
            <ProductMenu uid={product.uid}></ProductMenu>
          </li>
        ))}
      </ul>

      <button onClick={handleAddProduct} className={styles["main-action-btn"]}>
        Pievienot preci
      </button>
    </div>
  );
}
