import Product from "../types/Product";
import { supabase } from "./initialize";

export default async function dbCreateProduct(product: Product) {
  const { error } = await supabase
    .from("Products")
    .insert([product.toMapForDB()]);

  if (error) {
    console.log(error);
  }
}
