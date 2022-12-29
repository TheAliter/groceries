import { RealtimeChannel } from "@supabase/supabase-js";
import create from "zustand";
import { DB_Product } from "../database/types";
import {
  dbCreateProduct,
  dbDeleteProduct,
  dbUpdateProduct,
} from "../database/_database";
import { Product } from "../types/_types";
import { useShoppingListStore } from "./_store";

type Options = { updateDB: boolean };
const defaultOptions: Options = { updateDB: false };

export interface ProductsSliceType {
  products: Product[];
  productsListListener: RealtimeChannel | null;
  setProductsListListener: (productsListListener: RealtimeChannel) => void;
  updateProductsList: (products: Array<Product>) => void;
  addProduct: (product: Product, options?: Options) => void;
  updateProduct: (updatedProduct: Product, options?: Options) => void;
  deleteProduct: (productUid: number, options?: Options) => void;
  handleProductsListChangeFromDB: (changeData: { [key: string]: any }) => void;
  resetProductsData: () => void;
}

const initialState = {
  products: Array<Product>(),
  productsListListener: null,
};

export const useProductsStore = create<ProductsSliceType>()((set, get) => ({
  ...initialState,
  setProductsListListener: (productsListListener: RealtimeChannel) => {
    set(() => ({
      productsListListener,
    }));
  },
  updateProductsList: (products: Array<Product>) => {
    set(() => ({
      products,
    }));
  },
  addProduct: (product: Product, { updateDB }: Options = defaultOptions) => {
    if (updateDB) {
      dbCreateProduct(product);
    }

    let products = [...get().products, product];
    set(() => ({
      products,
    }));
  },
  updateProduct: (
    updatedProduct: Product,
    { updateDB }: Options = defaultOptions
  ) => {
    if (updateDB) {
      dbUpdateProduct(updatedProduct);
    }

    let products = get().products.map((product) =>
      product.uid === updatedProduct.uid ? updatedProduct : product
    );
    set(() => ({
      products,
    }));
  },
  deleteProduct: (
    productUid: number,
    { updateDB }: Options = defaultOptions
  ) => {
    if (updateDB) {
      let shopListId = useShoppingListStore.getState().id;
      dbDeleteProduct(shopListId, productUid);
    }

    let products = get().products.filter(
      (product) => product.uid !== productUid
    );
    set(() => ({
      products,
    }));
  },
  handleProductsListChangeFromDB: (changeData: { [key: string]: any }) => {
    switch (changeData.eventType as "INSERT" | "UPDATE" | "DELETE") {
      case "INSERT": {
        let newProductData = changeData.new as DB_Product;
        let newProduct = Product.fromDbMap(newProductData);
        if (!get().products.some((product) => product.uid === newProduct.uid)) {
          let products = [...get().products, newProduct];
          set(() => ({
            products,
          }));
        }
        break;
      }
      case "UPDATE": {
        let updatedProductData = changeData.new as DB_Product;
        let updatedProduct = Product.fromDbMap(updatedProductData);
        let originalProduct = get().products.find(
          (product) => product.uid === updatedProduct.uid
        );
        if (!originalProduct?.sameAs(updatedProduct, { checkRank: true })) {
          let products = get().products.map((product) =>
            product.uid === updatedProduct.uid ? updatedProduct : product
          );
          set(() => ({
            products,
          }));
        }
        break;
      }
      case "DELETE": {
        let deletedProductUid = changeData.old.uid as number;
        if (
          get().products.some((product) => product.uid === deletedProductUid)
        ) {
          let products = get().products.filter(
            (product) => product.uid !== deletedProductUid
          );
          set(() => ({
            products,
          }));
        }
        break;
      }
    }
  },
  resetProductsData: () => {
    set(() => ({
      ...initialState,
    }));
  },
}));
