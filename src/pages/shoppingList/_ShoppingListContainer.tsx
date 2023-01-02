import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import styles from "./styles/_ShoppingListContainer.module.css";
import { usePrimaryStore, useShoppingListStore } from "../../store/_store";
import { dbIsValidShoppingList } from "../../database/_database";
import { Loader } from "../../components/_components";

export function ShoppingListContainer() {
  const navigate = useNavigate();
  const { accessKey } = useParams();
  const primaryStore = usePrimaryStore();
  const shoppingListStore = useShoppingListStore();

  useEffect(() => {
    let abortController = new AbortController();
    shoppingListStore.setLoadingState(true);

    // Validate shopping list access key (in situation when shopping list is first openned page)
    if (primaryStore.useShoppingListGuard) {
      dbIsValidShoppingList(accessKey ?? "", abortController.signal)
        .then((isValid) => {
          if (!isValid) {
            navigate("/");
            return;
          }
          primaryStore.updateUseShoppingListGuard(false);
          shoppingListStore.loadAllData(
            accessKey ?? "",
            abortController.signal
          );
        })
        .catch((error) => {
          console.error(error);
          shoppingListStore.setLoadingState(false);
        });
    } else {
      shoppingListStore.loadAllData(accessKey ?? "", abortController.signal);
    }

    return () => {
      abortController.abort();
      shoppingListStore.setLoadingState(false);
    };
  }, []);

  return (
    <div className={styles.container}>
      {shoppingListStore.loadingData ? <Loader /> : <Outlet />}
    </div>
  );
}
