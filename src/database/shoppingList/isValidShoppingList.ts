import { supabase } from "../initialize";

export async function dbIsValidShoppingList(accessKey: string) {
  let { data, error } = await supabase
    .from("Shopping Lists")
    .select()
    .eq("access_key", accessKey);

  if (error) {
    console.error(error);
  }

  if (data && data.length > 0) {
    return true;
  }
  return false;
}
