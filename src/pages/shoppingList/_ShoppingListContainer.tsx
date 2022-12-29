import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import styles from "./styles/_ShoppingListContainer.module.css";
import { usePrimaryStore, useShoppingListStore } from "../../store/_store";
import { dbIsValidShoppingList } from "../../database/_database";
import { Loader } from "../../components/_components";

export default function ShoppingList() {
  const navigate = useNavigate();
  const { accessKey } = useParams();
  const primaryStore = usePrimaryStore();
  const shoppingListStore = useShoppingListStore();

  useEffect(() => {
    shoppingListStore.setLoadingState(true);

    // Validate shopping list access key (in situation when shopping list is first openned page)
    if (primaryStore.useShoppingListGuard) {
      dbIsValidShoppingList(accessKey ?? "").then((isValid) => {
        if (!isValid) {
          navigate("/");
          return;
        }
        primaryStore.updateUseShoppingListGuard(false);
        shoppingListStore.loadAllData(accessKey ?? "");
      });
    } else {
      shoppingListStore.loadAllData(accessKey ?? "");
    }
  }, []);

  return (
    <div className={styles.container}>
      {shoppingListStore.loadingData ? <Loader /> : <Outlet />}
    </div>
  );
}
