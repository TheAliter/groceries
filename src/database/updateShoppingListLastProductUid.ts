import { supabase } from "./initialize";

export async function dbUpdateShoppingListLastProductUid(id: number, newUid: number) {
  const { error } = await supabase
    .from("Shopping Lists")
    .update({ last_product_uid: newUid })
    .eq("id", id);

  if (error) {
    console.error(error);
  }
}
