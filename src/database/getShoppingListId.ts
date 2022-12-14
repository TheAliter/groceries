import { supabase } from "./initialize";

async function dbGetShoppingListId(accessKey: string) {
  let id = 0;
  let { data, error } = await supabase
    .from("Shopping Lists")
    .select("id")
    .eq("access_key", accessKey);

  if (error) {
    console.log(error);
  }

  if (data) {
    id = data[0].id;
  }

  return id;
}

export { dbGetShoppingListId as getShoppingListId };
