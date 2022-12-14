import { createContext, ReactElement, useReducer } from "react";
import Product from "../types/Product";

export const ShoppingListContext = createContext<ContextInterface | null>(null);

function shoppingListReducer(state: ContextInterface, action: Actions) {
  switch (action.type) {
    case ActionType.SET_ID: {
      return { ...state, id: action.payload };
    }

    case ActionType.SET_ACCESS_KEY: {
      return { ...state, accessKey: action.payload };
    }

    case ActionType.UPDATE_PRODUCTS_LIST: {
      return { ...state, products: action.payload };
    }

    case ActionType.ADD_PRODUCT: {
      let products = [...state.products, action.payload];
      return { ...state, products };
    }

    case ActionType.DELETE_PRODUCT: {
      let products = state.products.filter(
        (entry) => entry.id !== action.payload
      );
      return { ...state, products };
    }

    case ActionType.UPDATE_PRODUCT: {
      let products = state.products.map((entry) =>
        entry.id === action.payload.id ? action.payload : entry
      );
      return { ...state, products };
    }

    default:
      return state;
  }
}

export function ShoppingListProvider({ children }: Props) {
  const [state, dispatch] = useReducer(shoppingListReducer, {
    id: 0,
    accessKey: "",
    products: Array<Product>(),
    setID,
    setAccessKey,
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  });

  function setID(id: number) {
    dispatch({ type: ActionType.SET_ID, payload: id });
  }

  function setAccessKey(accessKey: string) {
    dispatch({ type: ActionType.SET_ACCESS_KEY, payload: accessKey });
  }

  function setProducts(products: Array<Product>) {
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

  function deleteProduct(id: number) {
    dispatch({ type: ActionType.DELETE_PRODUCT, payload: id });
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

interface ContextInterface {
  id: number;
  accessKey: string;
  products: Product[];
  setID: Function;
  setAccessKey: Function;
  setProducts: Function;
  addProduct: Function;
  updateProduct: Function;
  deleteProduct: Function;
}

enum ActionType {
  "SET_ID",
  "SET_ACCESS_KEY",
  "UPDATE_PRODUCTS_LIST",
  "ADD_PRODUCT",
  "DELETE_PRODUCT",
  "UPDATE_PRODUCT",
}
type Actions =
  | { type: ActionType.SET_ID; payload: number }
  | { type: ActionType.SET_ACCESS_KEY; payload: string }
  | { type: ActionType.UPDATE_PRODUCTS_LIST; payload: Product[] }
  | { type: ActionType.ADD_PRODUCT; payload: Product }
  | { type: ActionType.DELETE_PRODUCT; payload: number }
  | { type: ActionType.UPDATE_PRODUCT; payload: Product };
