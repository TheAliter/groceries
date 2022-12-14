import { supabase } from "./initialize";

export default async function dbDeleteProduct(
  shopListId: number,
  productId: number
) {
  const { data, error } = await supabase
    .from("Products")
    .delete()
    .eq("shopping_list_id", shopListId)
    .eq("id", productId);

  if (error) {
    console.log(error);
  }
}
