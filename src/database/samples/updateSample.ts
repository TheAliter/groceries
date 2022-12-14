import { Sample } from "../../types/_types";
import { supabase } from "../initialize";

export async function dbUpdateSample(sample: Sample) {
  const { error } = await supabase
    .from("Samples")
    .update(sample.toMapForDB())
    .eq("uid", sample.uid);

  if (error) {
    console.error(error);
  }
}
