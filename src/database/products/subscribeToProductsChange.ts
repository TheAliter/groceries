import { supabase } from "../initialize";

export async function dbSubscribeToProductsChanges(
  shopListId: number,
  handleProductsListChange: (newData: { [key: string]: any }) => void
) {
  const productsListListener = supabase
    .channel("products-list")
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
