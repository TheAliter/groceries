import { RealtimeChannel } from "@supabase/supabase-js";
import { createContext, ReactElement, useReducer } from "react";
import { DB_Product, DB_Sample } from "../database/types";
import Product from "../types/Product";
import Sample from "../types/Sample";

export const ShoppingListContext =
  createContext<ShoppingListContextInterface | null>(null);

const initialState = {
  id: 0,
  accessKey: "",
  lastProductUid: 0,
  lastSampleUid: 0,
  productsListListener: null,
  samplesListListener: null,
  products: Array<Product>(),
  samples: Array<Sample>(),
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

    case ActionType.SET_PRODUCTS_LIST_LISTENER: {
      return { ...state, productsListListener: action.payload };
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
        originalProduct?.rank !== action.payload.rank ||
        originalProduct.name !== action.payload.name ||
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

    case ActionType.SET_LAST_SAMPLE_UID: {
      return { ...state, lastSampleUid: action.payload };
    }

    case ActionType.SET_SAMPLES_LIST_LISTENER: {
      return { ...state, samplesListListener: action.payload };
    }

    case ActionType.UPDATE_SAMPLES_LIST: {
      return { ...state, samples: action.payload };
    }

    case ActionType.ADD_SAMPLE: {
      let samples = [...state.samples, action.payload];
      return { ...state, samples };
    }

    case ActionType.ADD_SAMPLE_FROM_DB: {
      if (!state.samples.some((sample) => sample.uid === action.payload.uid)) {
        let samples = [...state.samples, action.payload];
        return { ...state, samples };
      }
      return state;
    }

    case ActionType.UPDATE_SAMPLE: {
      let samples = state.samples.map((sample) =>
        sample.uid === action.payload.uid ? action.payload : sample
      );
      return { ...state, samples };
    }

    case ActionType.UPDATE_SAMPLE_FROM_DB: {
      let originalSample = state.samples.find(
        (sample) => sample.uid === action.payload.uid
      );
      if (
        originalSample?.rank !== action.payload.rank ||
        originalSample.name !== action.payload.name ||
        originalSample.amount !== action.payload.amount ||
        originalSample.units !== action.payload.units
      ) {
        let samples = state.samples.map((sample) =>
          sample.uid === action.payload.uid ? action.payload : sample
        );
        return { ...state, samples };
      }
      return state;
    }

    case ActionType.DELETE_SAMPLE: {
      let samples = state.samples.filter(
        (sample) => sample.uid !== action.payload
      );
      return { ...state, samples };
    }

    case ActionType.DELETE_SAMPLE_FROM_DB: {
      if (state.samples.some((sample) => sample.uid === action.payload)) {
        let samples = state.samples.filter(
          (sample) => sample.uid !== action.payload
        );
        return { ...state, samples };
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
    setProductsListListener,
    updateProductsList,
    addProduct,
    updateProduct,
    deleteProduct,
    handleProductsListChangeFromDB,
    setLastSampleUid,
    setSamplesListListener,
    updateSamplesList,
    addSample,
    updateSample,
    deleteSample,
    handleSamplesListChangeFromDB,
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

  function setProductsListListener(productsListListner: RealtimeChannel) {
    dispatch({
      type: ActionType.SET_PRODUCTS_LIST_LISTENER,
      payload: productsListListner,
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

  function handleProductsListChangeFromDB(payload: { [key: string]: any }) {
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

  function setLastSampleUid(lastSampleUid: number) {
    dispatch({
      type: ActionType.SET_LAST_SAMPLE_UID,
      payload: lastSampleUid,
    });
  }

  function setSamplesListListener(samplesListListner: RealtimeChannel) {
    dispatch({
      type: ActionType.SET_SAMPLES_LIST_LISTENER,
      payload: samplesListListner,
    });
  }

  function updateSamplesList(samples: Array<Sample>) {
    dispatch({ type: ActionType.UPDATE_SAMPLES_LIST, payload: samples });
  }

  function addSample(sample: Sample) {
    dispatch({
      type: ActionType.ADD_SAMPLE,
      payload: sample,
    });
  }

  function updateSample(sample: Sample) {
    dispatch({
      type: ActionType.UPDATE_SAMPLE,
      payload: sample,
    });
  }

  function deleteSample(sampleUid: number) {
    dispatch({ type: ActionType.DELETE_SAMPLE, payload: sampleUid });
  }

  function handleSamplesListChangeFromDB(payload: { [key: string]: any }) {
    switch (payload.eventType as "INSERT" | "UPDATE" | "DELETE") {
      case "INSERT": {
        let newSample = payload.new as DB_Sample;
        dispatch({
          type: ActionType.ADD_SAMPLE_FROM_DB,
          payload: Sample.fromDbMap(newSample),
        });
        break;
      }
      case "UPDATE": {
        let updatedSample = payload.new as DB_Sample;
        dispatch({
          type: ActionType.UPDATE_SAMPLE_FROM_DB,
          payload: Sample.fromDbMap(updatedSample),
        });
        break;
      }
      case "DELETE": {
        let deletedSampleUid = payload.old.uid as number;
        dispatch({
          type: ActionType.DELETE_SAMPLE_FROM_DB,
          payload: deletedSampleUid,
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
  lastSampleUid: number;
  productsListListener: RealtimeChannel | null;
  samplesListListener: RealtimeChannel | null;
  products: Product[];
  samples: Sample[];

  // METHODS
  setID: (shopListId: number) => void;
  setAccessKey: (shopListAccessKey: string) => void;
  setLastProductUid: (lastProductUid: number) => void;
  setProductsListListener: (productsListListener: RealtimeChannel) => void;
  updateProductsList: (products: Array<Product>) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productUid: number) => void;
  handleProductsListChangeFromDB: (payload: { [key: string]: any }) => void;
  setLastSampleUid: (lastSampleUid: number) => void;
  setSamplesListListener: (samplesListListener: RealtimeChannel) => void;
  updateSamplesList: (samples: Array<Sample>) => void;
  addSample: (sample: Sample) => void;
  updateSample: (sample: Sample) => void;
  deleteSample: (sampleUid: number) => void;
  handleSamplesListChangeFromDB: (payload: { [key: string]: any }) => void;
  resetData: () => void;
}

enum ActionType {
  "SET_ID",
  "SET_ACCESS_KEY",
  "SET_LAST_PRODUCT_UID",
  "SET_PRODUCTS_LIST_LISTENER",
  "UPDATE_PRODUCTS_LIST",
  "ADD_PRODUCT",
  "ADD_PRODUCT_FROM_DB",
  "UPDATE_PRODUCT",
  "UPDATE_PRODUCT_FROM_DB",
  "DELETE_PRODUCT",
  "DELETE_PRODUCT_FROM_DB",
  "SET_LAST_SAMPLE_UID",
  "SET_SAMPLES_LIST_LISTENER",
  "UPDATE_SAMPLES_LIST",
  "ADD_SAMPLE",
  "ADD_SAMPLE_FROM_DB",
  "UPDATE_SAMPLE",
  "UPDATE_SAMPLE_FROM_DB",
  "DELETE_SAMPLE",
  "DELETE_SAMPLE_FROM_DB",
  "RESET_DATA",
}
type Actions =
  | { type: ActionType.SET_ID; payload: number }
  | { type: ActionType.SET_ACCESS_KEY; payload: string }
  | { type: ActionType.SET_LAST_PRODUCT_UID; payload: number }
  | { type: ActionType.SET_PRODUCTS_LIST_LISTENER; payload: RealtimeChannel }
  | { type: ActionType.UPDATE_PRODUCTS_LIST; payload: Product[] }
  | { type: ActionType.ADD_PRODUCT; payload: Product }
  | { type: ActionType.ADD_PRODUCT_FROM_DB; payload: Product }
  | { type: ActionType.UPDATE_PRODUCT; payload: Product }
  | { type: ActionType.UPDATE_PRODUCT_FROM_DB; payload: Product }
  | { type: ActionType.DELETE_PRODUCT; payload: number }
  | { type: ActionType.DELETE_PRODUCT_FROM_DB; payload: number }
  | { type: ActionType.SET_LAST_SAMPLE_UID; payload: number }
  | { type: ActionType.SET_SAMPLES_LIST_LISTENER; payload: RealtimeChannel }
  | { type: ActionType.UPDATE_SAMPLES_LIST; payload: Sample[] }
  | { type: ActionType.ADD_SAMPLE; payload: Sample }
  | { type: ActionType.ADD_SAMPLE_FROM_DB; payload: Sample }
  | { type: ActionType.UPDATE_SAMPLE; payload: Sample }
  | { type: ActionType.UPDATE_SAMPLE_FROM_DB; payload: Sample }
  | { type: ActionType.DELETE_SAMPLE; payload: number }
  | { type: ActionType.DELETE_SAMPLE_FROM_DB; payload: number }
  | { type: ActionType.RESET_DATA; payload: boolean };
