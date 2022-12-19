import { supabase } from "./initialize";

export async function dbDeleteSample(shopListId: number, sampleUid: number) {
  const { error } = await supabase
    .from("Samples")
    .delete()
    .eq("shopping_list_id", shopListId)
    .eq("uid", sampleUid);

  if (error) {
    console.error(error);
  }
}
