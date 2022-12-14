import { useContext } from "react";
import { ShoppingListContext } from "../contexts/ShoppingListContext";

function useShoppingListContext() {
  const context = useContext(ShoppingListContext);

  if (context === undefined) {
    throw new Error("useContext() used outside of ShoppingListContextProvider");
  }

  return context;
}

export { useShoppingListContext };
