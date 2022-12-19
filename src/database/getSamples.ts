import { supabase } from "./initialize";
import { DB_Sample } from "./types";

export async function dbGetSamples(id: number) {
  let { data, error } = await supabase
    .from("Samples")
    .select("*")
    .eq("shopping_list_id", id);

  if (error) {
    console.error(error);
  }

  return (data as Array<DB_Sample>) ?? [];
}

export async function dbSubscribeToSamplesChanges(
  shopListId: number,
  handleSamplesListChange: Function
) {
  const samplesListListener = supabase
    .channel("custom-filter-channel")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "Samples",
        filter: `shopping_list_id=eq.${shopListId}`,
      },
      (payload) => handleSamplesListChange(payload)
    )
    .subscribe();

  return samplesListListener;
}
