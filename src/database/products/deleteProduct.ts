import { supabase } from "../initialize";

export async function dbDeleteProduct(shopListId: number, productUid: number) {
  const { error } = await supabase
    .from("Products")
    .delete()
    .eq("shopping_list_id", shopListId)
    .eq("uid", productUid);

  if (error) {
    console.error(error);
  }
}
