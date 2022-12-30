import { supabase } from "../initialize";
import { DB_Product } from "../types";

export async function dbGetProducts(id: number, abortSignal: AbortSignal) {
  let { data, error } = await supabase
    .from("Products")
    .select("*")
    .eq("shopping_list_id", id)
    .abortSignal(abortSignal);

  if (error) {
    console.error(error);
  }

  return (data as Array<DB_Product>) ?? [];
}
