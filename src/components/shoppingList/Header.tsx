import { useNavigate } from "react-router-dom";
import { useShoppingListStore } from "../../store/_store";
import styles from "./styles/Header.module.css";

interface Props {
  title: string;
  toggleSearch?: Function;
  handleMenuShow?: Function;
  showSearchIcon?: boolean;
  showMenuIcon?: boolean;
  showSamplesIcon?: boolean;
  showProductsIcon?: boolean;
}

export default function Header({
  title,
  toggleSearch = () => {},
  handleMenuShow = () => {},
  showSearchIcon = false,
  showSamplesIcon = false,
  showProductsIcon = false,
  showMenuIcon = false,
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
        {showSearchIcon && (
          <div
            onClick={() => toggleSearch()}
            className={styles["menu-icon"]}>

            <span className="material-icons">search</span>
          </div>
        )}

        {showProductsIcon && (
          <div
            onClick={() => handleNavigateToProducts()}
            className={styles["menu-icon"]}>

            <span className="material-icons-outlined">shopping_basket</span>
          </div>
        )}
        {showSamplesIcon && (
          <div
            onClick={() => handleNavigateToSamples()}
            className={styles["menu-icon"]}>

            <span className="material-icons">merge</span>
          </div>
        )}
        {showMenuIcon && (
          <div 
            onClick={() => handleMenuShow()} 
            className={styles["menu-icon"]}>

            <span className="material-icons">menu</span>
          </div>
        )}
      </div>
    </header>
  );
}
