export default class Product {
  id: number;
  name: string;
  amount: number;
  units: string;
  shopListId: number;

  constructor(
    id: number | undefined,
    name: string | undefined,
    amount: number | undefined,
    units: string | undefined,
    shopListId: number | undefined
  ) {
    this.id = id ?? 0;
    this.name = name ?? "";
    this.amount = amount ?? 0;
    this.units = units ?? "";
    this.shopListId = shopListId ?? 0;
  }

  toMapForDB() {
    return {
      id: this.id,
      name: this.name,
      amount: this.amount,
      units: this.units,
      shopping_list_id: this.shopListId,
    };
  }
}
