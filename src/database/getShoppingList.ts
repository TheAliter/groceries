import { supabase } from "./initialize";

async function getShoppingList(id: number) {
  let { data, error } = await supabase
    .from("Shopping Lists")
    .select()
    .eq("access_key", id);

  if (error) console.log(error);

  return { data, error };
}

export default getShoppingList;
