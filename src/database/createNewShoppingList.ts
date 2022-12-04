import { useEffect } from "react";
import { supabase } from "./initialize";

async function createNewShoppingList() {
  const id = Math.floor(Math.random() * 10000000000);
  const { data, error } = await supabase
    .from("Shopping Lists")
    .insert([{ access_key: Math.floor(Math.random() * 10000000000) }]);

  if (error) {
    console.log(error);
  }

  return {
    id,
    error,
  };
}

export default createNewShoppingList;
