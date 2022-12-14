import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../contexts/GlobalContext";
import { dbIsValidShoppingList } from "../database/isValidShoppingList";

export const useShoppingListGuard = (id: string) => {
  const navigate = useNavigate();
  const globalContext = useContext(GlobalContext);

  useEffect(() => {
    const isValid = dbIsValidShoppingList(id);
    if (!isValid) navigate("/");
  }, []);
};
