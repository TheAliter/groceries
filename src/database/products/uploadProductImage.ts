import { supabase } from "../initialize";
import Compressor from "compressorjs";

export async function dbUploadProductImage(productImageFile: File) {
  new Compressor(productImageFile, {
    quality: 0.33,
    success: async (compressedResult) => {
      const { data, error } = await supabase.storage
        .from("pictures")
        .upload(compressedResult.name, compressedResult, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error(error);
      }
    },
  });
}
