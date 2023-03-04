import { supabase } from "../initialize";

export async function getProductImage(imageName: string) {
  const { data, error } = await supabase.storage
    .from("pictures")
    .download(imageName);

  if (error) {
    console.error(error);
  }

  return data;
}
