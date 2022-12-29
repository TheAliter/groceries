import { supabase } from "../initialize";
import { DB_Shopping_List } from "../types";

export async function dbGetShoppingListData(accessKey: string) {
  let { data, error } = await supabase
    .from("Shopping Lists")
    .select()
    .eq("access_key", accessKey);

  if (error) {
    console.error(error);
  }

  if (data && data.length > 0) {
    return data[0] as DB_Shopping_List;
  } else {
    throw new Error("Shop list data not available");
  }
}
