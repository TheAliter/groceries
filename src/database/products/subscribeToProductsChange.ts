import { supabase } from "../initialize";

export async function dbSubscribeToProductsChanges(
  shopListId: number,
  handleProductsListChange: Function
) {
  const productsListListener = supabase
    .channel("custom-filter-channel")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "Products",
        filter: `shopping_list_id=eq.${shopListId}`,
      },
      (payload) => handleProductsListChange(payload)
    )
    .subscribe();

  return productsListListener;
}
