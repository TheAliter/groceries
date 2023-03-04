import { DB_Product } from "../database/types";
import { Sample } from "./_types";

export interface ProductMap {
  uid: number;
  rank: number;
  imageName: string;
  name: string;
  amount: number;
  units: string;
  shopListId: number;
}

export class Product {
  uid: number;
  rank: number;
  imageName: string;
  name: string;
  amount: number;
  units: string;
  shopListId: number;

  constructor({
    uid,
    rank,
    imageName,
    name,
    amount,
    units,
    shopListId,
  }: ProductMap) {
    this.uid = uid;
    this.rank = rank;
    this.imageName = imageName;
    this.name = name;
    this.amount = amount;
    this.units = units;
    this.shopListId = shopListId;
  }

  toMap(): ProductMap {
    return {
      uid: this.uid,
      rank: this.rank,
      imageName: this.imageName,
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
      image_name: this.imageName,
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
      imageName: dbProduct.image_name,
      shopListId: dbProduct.shopping_list_id,
    });
  };
}
