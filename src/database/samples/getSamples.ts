import { supabase } from "../initialize";
import { DB_Sample } from "../types";

export async function dbGetSamples(id: number, abortSignal: AbortSignal) {
  let { data, error } = await supabase
    .from("Samples")
    .select("*")
    .eq("shopping_list_id", id)
    .abortSignal(abortSignal);

  if (error) {
    console.error(error);
  }

  return (data as Array<DB_Sample>) ?? [];
}
