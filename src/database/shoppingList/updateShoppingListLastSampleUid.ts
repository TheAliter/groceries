import { supabase } from "../initialize";

export async function dbUpdateShoppingListLastSampleUid(
  id: number,
  newUid: number
) {
  const { error } = await supabase
    .from("Shopping Lists")
    .update({ last_sample_uid: newUid })
    .eq("id", id);
  if (error) {
    console.error(error);
  }
}
