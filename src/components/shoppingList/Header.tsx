import { useNavigate } from "react-router-dom";
import { useShoppingListStore } from "../../store/_store";
import styles from "./styles/Header.module.css";

interface Props {
  title: string;
  handleMenuShow?: Function;
  showMenuIcon?: boolean;
  showSamplesIcon?: boolean;
  showProductsIcon?: boolean;
}

export default function Header({
  title,
  handleMenuShow = () => {},
  showMenuIcon = false,
  showSamplesIcon = false,
  showProductsIcon = false,
}: Props) {
  const navigate = useNavigate();
  const shoppingListStore = useShoppingListStore();

  function handleNavigateToSamples() {
    navigate("/shopping-list/" + shoppingListStore.accessKey + "/samples");
  }

  function handleNavigateToProducts() {
    navigate("/shopping-list/" + shoppingListStore.accessKey + "/");
  }

  return (
    <header className={styles.container}>
      <h1>{title}</h1>
      <div className={styles["menu-icons"]}>
        {showProductsIcon && (
          <div
            onClick={() => handleNavigateToProducts()}
            className={styles["menu-icon"]}
          >
            <span className="material-icons-outlined">shopping_basket</span>
          </div>
        )}
        {showSamplesIcon && (
          <div
            onClick={() => handleNavigateToSamples()}
            className={styles["menu-icon"]}
          >
            <span className="material-icons">merge</span>
          </div>
        )}
        {showMenuIcon && (
          <div onClick={() => handleMenuShow()} className={styles["menu-icon"]}>
            <span className="material-icons">menu</span>
          </div>
        )}
      </div>
    </header>
  );
}
