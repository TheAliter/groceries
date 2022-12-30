import { supabase } from "../initialize";

export function dbSubscribeToSamplesChanges(
  shopListId: number,
  handleSamplesListChange: (newData: { [key: string]: any }) => void
) {
  const samplesListListener = supabase
    .channel("samples-list")
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
