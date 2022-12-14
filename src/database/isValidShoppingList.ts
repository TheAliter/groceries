import { supabase } from "./initialize";

export async function dbIsValidShoppingList(id: string) {
  let { data, error } = await supabase
    .from("Shopping Lists")
    .select()
    .eq("access_key", id);

  console.log(data);

  if (error) {
    console.log(error);
  }

  if (data && data.length > 0) {
    return true;
  }
  return false;
}
