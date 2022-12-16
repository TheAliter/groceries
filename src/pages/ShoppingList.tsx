import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import styles from "./styles/ShoppingList.module.css";
import { GlobalContext } from "../contexts/GlobalContext";
import ShoppingListMenu from "../components/shoppingList/ShoppingListMenu";
import { useShoppingListContext } from "../hooks/useShoppingListContext";
import { dbGetShoppingListData } from "../database/getShoppingListData";
import {
  dbGetProducts,
  dbSubscribeToProductsChanges,
} from "../database/getProducts";
import Product from "../types/Product";
import Loader from "../components/Loader";
import { dbIsValidShoppingList } from "../database/isValidShoppingList";

export default function ShoppingList() {
  const navigate = useNavigate();
  const globalContext = useContext(GlobalContext);
  const shopListContext = useShoppingListContext();
  const { accessKey } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  function closeMenu(newState: boolean) {
    setShowMenu(newState);
  }

  function loadAndSetAllShoppingListData() {
    // Loading and setting all data regarding shopping list
    shopListContext!.setAccessKey(accessKey);
    dbGetShoppingListData(accessKey ?? "")
      .then((data) => {
        shopListContext?.setID(data.id);
        shopListContext?.setLastProductUid(data.last_product_uid);
        dbGetProducts(data.id).then((products) => {
          shopListContext?.updateProductsList(
            products.map((product) => Product.fromDbMap(product))
          );
          setIsLoading(false);
        });
        dbSubscribeToProductsChanges(
          data.id,
          (payload: { [key: string]: any }) =>
            shopListContext!.handleProductListChangeFromDB(payload)
        ).then((listener) =>
          shopListContext?.setShoppingListListener(listener)
        );
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    // Validate shopping list access key (in situation when shopping list is first openned page)
    if (globalContext?.useShoppingListGuard) {
      dbIsValidShoppingList(accessKey ?? "").then((isValid) => {
        if (!isValid) {
          navigate("/");
          return;
        }
        globalContext.updateUseShoppingListGuard(false);
        loadAndSetAllShoppingListData();
      });
    } else {
      loadAndSetAllShoppingListData();
    }
  }, []);

  return (
    <div className={styles.container}>
      <header>
        <h1>Iepirkuma saraksts</h1>
        <div onClick={() => closeMenu(true)} className={styles["menu-icon"]}>
          <span className="material-icons">menu</span>
        </div>
      </header>
      {isLoading ? <Loader /> : <Outlet />}

      {showMenu && (
        <ShoppingListMenu handleCloseMenu={() => closeMenu(false)} />
      )}
    </div>
  );
}
