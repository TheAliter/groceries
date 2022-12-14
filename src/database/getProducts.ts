import { supabase } from "./initialize";
import { DB_Product } from "./types";

async function dbGetProducts(id: number) {
  let { data, error } = await supabase
    .from("Products")
    .select("*")
    .eq("shopping_list_id", id);

  if (error) {
    console.log(error);
  }

  return (data as Array<DB_Product>) ?? [];
}

async function subscribeToProductsChanges(id: number) {
  const products = supabase
    .channel("custom-filter-channel")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "Products",
        filter: `shopping_list_id=eq.${id}`,
      },
      (payload) => {
        // TODO: Handle products getting
        console.log("Change received!", payload);
      }
    )
    .subscribe();

  // TODO: unsubscribe upon page leave or shop list delete?

  console.log(products);

  //   TODO
  return products;
}

export { dbGetProducts as getProducts, subscribeToProductsChanges };
