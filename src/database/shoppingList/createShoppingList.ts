import { supabase } from "../initialize";

export async function dbCreateShoppingList() {
  const accessKey = Math.floor(Math.random() * 10000000000).toString();
  let isSuccess = true;

  const { data, error } = await supabase
    .from("Shopping Lists")
    .insert([{ access_key: accessKey }]);

  if (error) {
    console.error(error);
    isSuccess = false;
  }

  return {
    accessKey,
    isSuccess,
  };
}
