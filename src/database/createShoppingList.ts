import { supabase } from "./initialize";

async function dbCreateShoppingList() {
  const id = Math.floor(Math.random() * 10000000000);
  let isSuccess = true;
  const { data, error } = await supabase
    .from("Shopping Lists")
    .insert([{ access_key: Math.floor(Math.random() * 10000000000) }]);

  if (error) {
    console.log(error);
    isSuccess = false;
  }

  return {
    id,
    isSuccess,
  };
}

export { dbCreateShoppingList as createShoppingList };
