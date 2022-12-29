import create from "zustand";

export interface PrimarySliceType {
  useShoppingListGuard: boolean;
  id: number;
  updateUseShoppingListGuard: (useShoppingListGuard: boolean) => void;
}

const initialState = {
  useShoppingListGuard: false,
  id: 0,
};

export const usePrimaryStore = create<PrimarySliceType>()((set) => ({
  ...initialState,
  updateUseShoppingListGuard: (useShoppingListGuard: boolean) =>
    set(() => ({
      useShoppingListGuard,
    })),
}));
