import Product from "../types/Product";
import { supabase } from "./initialize";

export default async function dbUpdateProduct(product: Product) {
  const { error } = await supabase
    .from("Products")
    .update(product.toMapForDB())
    .eq("id", product.id);

  if (error) {
    console.log(error);
  }
}
