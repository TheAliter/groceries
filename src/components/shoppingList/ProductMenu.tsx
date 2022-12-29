import { useNavigate } from "react-router-dom";
import { useOverlayVisible } from "../../hooks/_hooks";
import { useProductsStore, useShoppingListStore } from "../../store/_store";
import styles from "./styles/ProductMenu.module.css";

interface Props {
  uid: number;
}

export default function ProductMenu({ uid }: Props) {
  const { ref, isOverlayVisible, setIsOverlayVisible } =
    useOverlayVisible<HTMLDivElement>(false);
  const navigate = useNavigate();
  const productsStore = useProductsStore();
  const shoppingListStore = useShoppingListStore();

  function handleClick(e: React.SyntheticEvent) {
    e.stopPropagation();
    setIsOverlayVisible(!isOverlayVisible);
  }

  function handleDelete(e: React.SyntheticEvent) {
    e.stopPropagation();
    productsStore.deleteProduct(uid, {updateDB: true});
  }

  function handleEdit(e: React.SyntheticEvent) {
    e.stopPropagation();
    navigate(
      "/shopping-list/" + shoppingListStore.accessKey + "/edit-product/" + uid
    );
  }

  return (
    <div ref={ref} className={styles.container}>
      <span onClick={handleClick} className="material-icons">
        more_vert
      </span>
      {isOverlayVisible && (
        <ul className={styles.menu}>
          <li onClick={handleEdit}>Rediģēt</li>
          <span></span>
          <li onClick={handleDelete}>Izdzēst</li>
        </ul>
      )}
    </div>
  );
}
