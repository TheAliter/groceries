import { useContext } from "react";
import { GlobalContext } from "../contexts/GlobalContext";

export default function useGlobalContext() {
  const context = useContext(GlobalContext);

  if (context === undefined) {
    throw new Error(
      "useGlobalContext() used outside of GlobalContext.Provider"
    );
  }

  return context;
}
