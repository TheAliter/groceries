import { supabase } from "../initialize";

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
