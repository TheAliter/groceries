import { Sample } from "../../types/_types";
import { supabase } from "../initialize";

export async function dbCreateSample(sample: Sample) {
  const { error } = await supabase
    .from("Samples")
    .insert([sample.toMapForDB()]);

  if (error) {
    console.error(error);
  }
}
