import create from "zustand";
import {
  dbGetProducts,
  dbGetSamples,
  dbGetShoppingListData,
  dbSubscribeToProductsChanges,
  dbSubscribeToSamplesChanges,
  dbUpdateShoppingListLastProductUid,
  dbUpdateShoppingListLastSampleUid,
} from "../database/_database";
import { Product, Sample } from "../types/_types";
import { useProductsStore, useSampleStore } from "./_store";

type Options = { updateDB: boolean };
const defaultOptions: Options = { updateDB: false };

export interface ShopppingListSliceType {
  loadingData: boolean;
  id: number;
  accessKey: string;
  lastProductUid: number;
  lastSampleUid: number;
  generateNewProductUid: () => number;
  generateNewSampleUid: () => number;
  setLoadingState: (newState: boolean) => void;
  setID: (newId: number) => void;
  setAccessKey: (accessKey: string) => void;
  setLastProductUid: (lastProductUid: number, options?: Options) => void;
  setLastSampleUid: (lastSampleUid: number, options?: Options) => void;
  resetAllData: () => void;
  loadAllData: (accessKey: string) => Promise<void>;
}

const initialParamsState = {
  loadingData: false,
  id: 0,
  accessKey: "",
  lastProductUid: 0,
  lastSampleUid: 0,
};

export const useShoppingListStore = create<ShopppingListSliceType>()(
  (set, get) => ({
    ...initialParamsState,
    generateNewProductUid: () =>
      parseInt(`${get().id}000${get().lastProductUid + 1}`),
    generateNewSampleUid: () =>
      parseInt(`${get().id}000${get().lastSampleUid + 1}`),
    setLoadingState: (newState: boolean) => {
      set(() => ({
        loadingData: newState,
      }));
    },
    setID: (id: number) => {
      set(() => ({
        id,
      }));
    },
    setAccessKey: (accessKey: string) => {
      set(() => ({ accessKey }));
    },
    setLastProductUid: (
      lastProductUid: number,
      { updateDB }: Options = defaultOptions
    ) => {
      if (updateDB) {
        dbUpdateShoppingListLastProductUid(get().id, lastProductUid);
      }

      set(() => ({ lastProductUid }));
    },
    setLastSampleUid: (
      lastSampleUid: number,
      { updateDB }: Options = defaultOptions
    ) => {
      if (updateDB) {
        dbUpdateShoppingListLastSampleUid(get().id, lastSampleUid);
      }

      set(() => ({ lastSampleUid }));
    },
    resetAllData: () => {
      useProductsStore.getState().resetProductsData();
      useSampleStore.getState().resetSamplesData();
      set(() => ({
        ...initialParamsState,
      }));
    },
    loadAllData: async (accessKey: string) => {
      get().setAccessKey(accessKey);
      try {
        let shopListData = await dbGetShoppingListData(accessKey);

        // Populate shopping list data
        get().setID(shopListData.id);
        get().setLastProductUid(shopListData.last_product_uid);
        get().setLastSampleUid(shopListData.last_sample_uid);

        // Populate products and samples data
        let [products, samples] = await Promise.all([
          dbGetProducts(shopListData.id),
          dbGetSamples(shopListData.id),
        ]);
        useProductsStore
          .getState()
          .updateProductsList(
            products.map((product) => Product.fromDbMap(product))
          );
        useSampleStore
          .getState()
          .updateSamplesList(samples.map((sample) => Sample.fromDbMap(sample)));
        get().setLoadingState(false);

        // Set up listeners for data changes to products and samples
        let productsListener = await dbSubscribeToProductsChanges(
          shopListData.id,
          (payload: { [key: string]: any }) =>
            useProductsStore.getState().handleProductsListChangeFromDB(payload)
        );
        let samplesListener = await dbSubscribeToSamplesChanges(
          shopListData.id,
          (payload: { [key: string]: any }) =>
            useSampleStore.getState().handleSamplesListChangeFromDB(payload)
        );
        useProductsStore.getState().setProductsListListener(productsListener);
        useSampleStore.getState().setSamplesListListener(samplesListener);
      } catch (error) {
        console.error(error);
        get().setLoadingState(false);
      }
    },
  })
);
