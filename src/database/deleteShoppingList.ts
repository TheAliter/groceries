import { supabase } from "./initialize";

export async function dbDeleteShoppingList(shopListId: number) {
  // Must be correct delete order (products -> shopList)
  const { error: productsDeleteErrro } = await supabase
    .from("Products")
    .delete()
    .eq("shopping_list_id", shopListId);

  const { error: shoppingListDeleteError } = await supabase
    .from("Shopping Lists")
    .delete()
    .eq("id", shopListId);

  if (shoppingListDeleteError || productsDeleteErrro) {
    console.error({ shoppingListDeleteError });
    console.error({ productsDeleteErrro });
  }
}
