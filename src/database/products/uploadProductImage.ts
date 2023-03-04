import { supabase } from "../initialize";

export async function dbUploadProductImage(productImageFile: File) {
  const { data, error } = await supabase.storage
    .from("pictures")
    .upload(productImageFile.name, productImageFile, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error(error);
  }
}
