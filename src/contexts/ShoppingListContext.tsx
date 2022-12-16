import { RealtimeChannel } from "@supabase/supabase-js";
import { createContext, ReactElement, useReducer } from "react";
import { DB_Product } from "../database/types";
import Product from "../types/Product";

export const ShoppingListContext =
  createContext<ShoppingListContextInterface | null>(null);

const initialState = {
  id: 0,
  accessKey: "",
  lastProductUid: 1,
  shoppingListListener: null,
  products: Array<Product>(),
};

function shoppingListReducer(
  state: ShoppingListContextInterface,
  action: Actions
) {
  switch (action.type) {
    case ActionType.SET_ID: {
      return { ...state, id: action.payload };
    }

    case ActionType.SET_ACCESS_KEY: {
      return { ...state, accessKey: action.payload };
    }

    case ActionType.SET_LAST_PRODUCT_UID: {
      return { ...state, lastProductUid: action.payload };
    }

    case ActionType.SET_SHOP_LIST_LISTENER: {
      return { ...state, shoppingListListener: action.payload };
    }

    case ActionType.UPDATE_PRODUCTS_LIST: {
      return { ...state, products: action.payload };
    }

    case ActionType.ADD_PRODUCT: {
      let products = [...state.products, action.payload];
      return { ...state, products };
    }

    case ActionType.ADD_PRODUCT_FROM_DB: {
      if (
        !state.products.some((product) => product.uid === action.payload.uid)
      ) {
        let products = [...state.products, action.payload];
        return { ...state, products };
      }
      return state;
    }

    case ActionType.UPDATE_PRODUCT: {
      let products = state.products.map((product) =>
        product.uid === action.payload.uid ? action.payload : product
      );
      return { ...state, products };
    }

    case ActionType.UPDATE_PRODUCT_FROM_DB: {
      let originalProduct = state.products.find(
        (product) => product.uid === action.payload.uid
      );
      if (
        originalProduct?.name !== action.payload.name ||
        originalProduct.amount !== action.payload.amount ||
        originalProduct.units !== action.payload.units
      ) {
        let products = state.products.map((product) =>
          product.uid === action.payload.uid ? action.payload : product
        );
        return { ...state, products };
      }
      return state;
    }

    case ActionType.DELETE_PRODUCT: {
      let products = state.products.filter(
        (product) => product.uid !== action.payload
      );
      return { ...state, products };
    }

    case ActionType.DELETE_PRODUCT_FROM_DB: {
      if (state.products.some((product) => product.uid === action.payload)) {
        let products = state.products.filter(
          (product) => product.uid !== action.payload
        );
        return { ...state, products };
      }
      return state;
    }

    case ActionType.RESET_DATA: {
      return { ...state, ...initialState };
    }

    default:
      return state;
  }
}

export function ShoppingListProvider({ children }: Props) {
  const [state, dispatch] = useReducer(shoppingListReducer, {
    // PROPERTIES
    ...initialState,

    // METHODS
    setID,
    setAccessKey,
    setLastProductUid,
    setShoppingListListener,
    updateProductsList,
    addProduct,
    updateProduct,
    deleteProduct,
    handleProductListChangeFromDB,
    resetData,
  });

  function setID(shopListId: number) {
    dispatch({ type: ActionType.SET_ID, payload: shopListId });
  }

  function setAccessKey(shopListAccessKey: string) {
    dispatch({ type: ActionType.SET_ACCESS_KEY, payload: shopListAccessKey });
  }

  function setLastProductUid(lastProductUid: number) {
    dispatch({
      type: ActionType.SET_LAST_PRODUCT_UID,
      payload: lastProductUid,
    });
  }

  function setShoppingListListener(shopListListner: RealtimeChannel) {
    dispatch({
      type: ActionType.SET_SHOP_LIST_LISTENER,
      payload: shopListListner,
    });
  }

  function updateProductsList(products: Array<Product>) {
    dispatch({ type: ActionType.UPDATE_PRODUCTS_LIST, payload: products });
  }

  function addProduct(product: Product) {
    dispatch({
      type: ActionType.ADD_PRODUCT,
      payload: product,
    });
  }

  function updateProduct(product: Product) {
    dispatch({
      type: ActionType.UPDATE_PRODUCT,
      payload: product,
    });
  }

  function deleteProduct(productUid: number) {
    dispatch({ type: ActionType.DELETE_PRODUCT, payload: productUid });
  }

  function handleProductListChangeFromDB(payload: { [key: string]: any }) {
    switch (payload.eventType as "INSERT" | "UPDATE" | "DELETE") {
      case "INSERT": {
        let newProduct = payload.new as DB_Product;
        dispatch({
          type: ActionType.ADD_PRODUCT_FROM_DB,
          payload: Product.fromDbMap(newProduct),
        });
        break;
      }
      case "UPDATE": {
        let updatedProduct = payload.new as DB_Product;
        dispatch({
          type: ActionType.UPDATE_PRODUCT_FROM_DB,
          payload: Product.fromDbMap(updatedProduct),
        });
        break;
      }
      case "DELETE": {
        let deletedProductUid = payload.old.uid as number;
        dispatch({
          type: ActionType.DELETE_PRODUCT_FROM_DB,
          payload: deletedProductUid,
        });
        break;
      }
    }
  }

  function resetData() {
    dispatch({ type: ActionType.RESET_DATA, payload: true });
  }

  return (
    <ShoppingListContext.Provider value={state}>
      {children}
    </ShoppingListContext.Provider>
  );
}

interface Props {
  children: ReactElement;
}

export interface ShoppingListContextInterface {
  // PROPERTIES
  id: number;
  accessKey: string;
  lastProductUid: number;
  shoppingListListener: RealtimeChannel | null;
  products: Product[];

  // METHODS
  setID: Function;
  setAccessKey: Function;
  setLastProductUid: Function;
  setShoppingListListener: Function;
  updateProductsList: Function;
  addProduct: Function;
  updateProduct: Function;
  deleteProduct: Function;
  handleProductListChangeFromDB: Function;
  resetData: Function;
}

enum ActionType {
  "SET_ID",
  "SET_ACCESS_KEY",
  "SET_LAST_PRODUCT_UID",
  "SET_SHOP_LIST_LISTENER",
  "UPDATE_PRODUCTS_LIST",
  "ADD_PRODUCT",
  "ADD_PRODUCT_FROM_DB",
  "UPDATE_PRODUCT",
  "UPDATE_PRODUCT_FROM_DB",
  "DELETE_PRODUCT",
  "DELETE_PRODUCT_FROM_DB",
  "RESET_DATA",
}
type Actions =
  | { type: ActionType.SET_ID; payload: number }
  | { type: ActionType.SET_ACCESS_KEY; payload: string }
  | { type: ActionType.SET_LAST_PRODUCT_UID; payload: number }
  | { type: ActionType.SET_SHOP_LIST_LISTENER; payload: RealtimeChannel }
  | { type: ActionType.UPDATE_PRODUCTS_LIST; payload: Product[] }
  | { type: ActionType.ADD_PRODUCT; payload: Product }
  | { type: ActionType.ADD_PRODUCT_FROM_DB; payload: Product }
  | { type: ActionType.UPDATE_PRODUCT; payload: Product }
  | { type: ActionType.UPDATE_PRODUCT_FROM_DB; payload: Product }
  | { type: ActionType.DELETE_PRODUCT; payload: number }
  | { type: ActionType.DELETE_PRODUCT_FROM_DB; payload: number }
  | { type: ActionType.RESET_DATA; payload: boolean };
