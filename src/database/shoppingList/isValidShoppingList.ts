import { supabase } from "../initialize";

export async function dbIsValidShoppingList(
  accessKey: string,
  abortSignal: AbortSignal
) {
  let { data, error } = await supabase
    .from("Shopping Lists")
    .select()
    .eq("access_key", accessKey)
    .abortSignal(abortSignal);

  if (error) {
    console.error(error);
  }

  if (data && data.length > 0) {
    return true;
  }
  return false;
}
