import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import styles from "./styles/ShoppingList.module.css";
import { GlobalContext } from "../contexts/GlobalContext";
import { useShoppingListContext } from "../hooks/useShoppingListContext";
import { dbGetShoppingListData } from "../database/getShoppingListData";
import {
  dbGetProducts,
  dbSubscribeToProductsChanges,
} from "../database/getProducts";
import Product from "../types/Product";
import Loader from "../components/Loader";
import { dbIsValidShoppingList } from "../database/isValidShoppingList";
import Sample from "../types/Sample";
import {
  dbGetSamples,
  dbSubscribeToSamplesChanges,
} from "../database/getSamples";

export default function ShoppingList() {
  const navigate = useNavigate();
  const globalContext = useContext(GlobalContext);
  const shopListContext = useShoppingListContext();
  const { accessKey } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  function loadAndSetAllShoppingListData() {
    // Loading and setting all data regarding shopping list
    shopListContext!.setAccessKey(accessKey ?? "");
    dbGetShoppingListData(accessKey ?? "")
      .then((data) => {
        shopListContext?.setID(data.id);
        shopListContext?.setLastProductUid(data.last_product_uid);
        shopListContext?.setLastSampleUid(data.last_sample_uid);
        dbGetProducts(data.id).then((products) => {
          shopListContext?.updateProductsList(
            products.map((product) => Product.fromDbMap(product))
          );
          setIsLoading(false);
        });
        dbGetSamples(data.id).then((samples) => {
          shopListContext?.updateSamplesList(
            samples.map((sample) => Sample.fromDbMap(sample))
          );
        });
        dbSubscribeToProductsChanges(
          data.id,
          (payload: { [key: string]: any }) =>
            shopListContext!.handleProductsListChangeFromDB(payload)
        ).then((listener) =>
          shopListContext?.setProductsListListener(listener)
        );
        dbSubscribeToSamplesChanges(
          data.id,
          (payload: { [key: string]: any }) =>
            shopListContext!.handleSamplesListChangeFromDB(payload)
        ).then((listener) => shopListContext?.setSamplesListListener(listener));
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
      {isLoading ? <Loader /> : <Outlet />}
    </div>
  );
}
