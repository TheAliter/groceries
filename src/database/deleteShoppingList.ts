import { supabase } from "./initialize";

async function dbDeleteShoppingList(id: string) {
  let isSuccess = true;
  const { error: shoppingListDeleteError } = await supabase
    .from("Shopping Lists")
    .delete()
    .eq("access_key", id);

  const { error: productsDeleteErrro } = await supabase
    .from("Products")
    .delete()
    .eq("shopping_list_id", id);

  if (shoppingListDeleteError || productsDeleteErrro) {
    console.log({ shoppingListDeleteError });
    console.log({ productsDeleteErrro });
    isSuccess = false;
  }

  return isSuccess;
}

export { dbDeleteShoppingList as deleteShoppingList };
