import { DB_Product } from "../database/types";

interface ProductMap {
  uid: number;
  rank: number;
  name: string;
  amount: number;
  units: string;
  shopListId: number;
}

export default class Product {
  uid: number;
  rank: number;
  name: string;
  amount: number;
  units: string;
  shopListId: number;

  constructor(
    uid: number,
    rank: number,
    name: string,
    amount: number,
    units: string,
    shopListId: number
  ) {
    this.uid = uid;
    this.rank = rank;
    this.name = name;
    this.amount = amount;
    this.units = units;
    this.shopListId = shopListId;
  }

  toMap(): ProductMap {
    return {
      uid: this.uid,
      rank: this.rank,
      name: this.name,
      amount: this.amount,
      units: this.units,
      shopListId: this.shopListId,
    };
  }

  static fromMap(productAsMap: ProductMap) {
    return new Product(
      productAsMap.uid,
      productAsMap.rank,
      productAsMap.name,
      productAsMap.amount,
      productAsMap.units,
      productAsMap.shopListId
    );
  }

  toMapForDB() {
    return {
      uid: this.uid,
      rank: this.rank,
      name: this.name,
      amount: this.amount,
      units: this.units,
      shopping_list_id: this.shopListId,
    };
  }

  static fromDbMap(productAsMap: DB_Product) {
    return new Product(
      productAsMap.uid,
      productAsMap.rank,
      productAsMap.name,
      productAsMap.amount,
      productAsMap.units,
      productAsMap.shopping_list_id
    );
  }
}
