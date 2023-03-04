import { DB_Sample } from "../database/types";
import { Product, ProductMap } from "./_types";

export interface SampleMap extends ProductMap {}

export class Sample extends Product {
  constructor(sampleAsMap: SampleMap) {
    super(sampleAsMap);
  }

  toMap(): SampleMap {
    return super.toMap();
  }

  toMapForDB(): DB_Sample {
    return super.toMapForDB();
  }

  sameAs(
    sampleData: Sample,
    { checkRank }: { checkRank: boolean } = { checkRank: false }
  ): boolean {
    // Rank checking is for reordering check (example: when receiving update from DB)
    return super.sameAs(sampleData, { checkRank });
  }

  static fromMap(sampleMap: SampleMap) {
    return new Sample(sampleMap);
  }

  static fromDbMap(dbSample: DB_Sample) {
    return new Sample({
      ...dbSample,
      imageName: dbSample.image_name,
      shopListId: dbSample.shopping_list_id,
    });
  }
}
