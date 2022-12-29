import { DB_Product } from "../database/types";
import { Sample } from "./_types";

export interface ProductMap {
  uid: number;
  rank: number;
  name: string;
  amount: number;
  units: string;
  shopListId: number;
}

export class Product {
  uid: number;
  rank: number;
  name: string;
  amount: number;
  units: string;
  shopListId: number;

  constructor({ uid, rank, name, amount, units, shopListId }: ProductMap) {
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

  toMapForDB(): DB_Product {
    return {
      uid: this.uid,
      rank: this.rank,
      name: this.name,
      amount: this.amount,
      units: this.units,
      shopping_list_id: this.shopListId,
    };
  }

  sameAs(
    { rank, name, amount, units }: Product | Sample,
    { checkRank }: { checkRank: boolean } = { checkRank: false }
  ): boolean {
    // Rank checking is for reordering check (example: when receiving update from DB)
    if (checkRank) {
      if (this.rank !== rank) return false;
    }

    return this.name === name && this.amount === amount && this.units === units;
  }

  static fromMap = (productMap: ProductMap) => new Product(productMap);

  static fromDbMap = (dbProduct: DB_Product) => {
    return new Product({
      ...dbProduct,
      shopListId: dbProduct.shopping_list_id,
    });
  };
}
