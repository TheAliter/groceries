import { DB_Product } from "../database/types";

export default class Product {
  uid: number;
  name: string;
  amount: number;
  units: string;
  shopListId: number;

  constructor(
    uid: number,
    name: string ,
    amount: number ,
    units: string ,
    shopListId: number 
  ) {
    this.uid = uid ;
    this.name = name ;
    this.amount = amount ;
    this.units = units ;
    this.shopListId = shopListId;
  }

  toMapForDB() {
    return {
      uid: this.uid,
      name: this.name,
      amount: this.amount,
      units: this.units,
      shopping_list_id: this.shopListId,
    };
  }

  static fromDbMap(productAsMap: DB_Product) {
    return new Product(
      productAsMap.uid,
      productAsMap.name,
      productAsMap.amount,
      productAsMap.units,
      productAsMap.shopping_list_id
    );
  }
}
