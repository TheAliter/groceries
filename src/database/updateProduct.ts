import Product from "../types/Product";
import { supabase } from "./initialize";

export async function dbUpdateProduct(product: Product) {
  const { error } = await supabase
    .from("Products")
    .update(product.toMapForDB())
    .eq("uid", product.uid);

  if (error) {
    console.error(error);
  }
}
