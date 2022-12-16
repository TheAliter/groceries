import { supabase } from "./initialize";
import { DB_Product } from "./types";

export async function dbGetProducts(id: number) {
  let { data, error } = await supabase
    .from("Products")
    .select("*")
    .eq("shopping_list_id", id);

  if (error) {
    console.error(error);
  }

  return (data as Array<DB_Product>) ?? [];
}

export async function dbSubscribeToProductsChanges(
  shopListId: number,
  handleProductListChange: Function
) {
  const shopListListener = supabase
    .channel("custom-filter-channel")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "Products",
        filter: `shopping_list_id=eq.${shopListId}`,
      },
      (payload) => handleProductListChange(payload)
    )
    .subscribe();

  return shopListListener;
}
