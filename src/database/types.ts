export interface DB_Shopping_List {
  id: number;
  created_at: string;
  access_key: string;
  last_product_uid: number;
}

export interface DB_Product {
  uid: number;
  created_at: string;
  name: string;
  amount: number;
  units: string;
  shopping_list_id: number;
}
