import { Product } from "../../types/_types";
import { supabase } from "../initialize";

export async function dbCreateProduct(product: Product) {
  const { error } = await supabase
    .from("Products")
    .insert([product.toMapForDB()]);

  if (error) {
    console.error(error);
  }
}
