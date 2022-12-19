import { DB_Sample } from "../database/types";
import Product from "./Product";

export interface SampleMap {
  uid: number;
  rank: number;
  name: string;
  amount: number;
  units: string;
  shopListId: number;
}

export default class Sample {
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

  toMap(): SampleMap {
    return {
      uid: this.uid,
      rank: this.rank,
      name: this.name,
      amount: this.amount,
      units: this.units,
      shopListId: this.shopListId,
    };
  }

  static fromMap(sampleAsMap: SampleMap) {
    return new Sample(
      sampleAsMap.uid,
      sampleAsMap.rank,
      sampleAsMap.name,
      sampleAsMap.amount,
      sampleAsMap.units,
      sampleAsMap.shopListId
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

  static fromDbMap(sampleAsMap: DB_Sample) {
    return new Sample(
      sampleAsMap.uid,
      sampleAsMap.rank,
      sampleAsMap.name,
      sampleAsMap.amount,
      sampleAsMap.units,
      sampleAsMap.shopping_list_id
    );
  }
}
