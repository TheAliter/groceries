import { useProductsStore } from "../../store/productsSlice";
import { Sample } from "../../types/_types";

export function useShowCheckmark() {
  const productsStore = useProductsStore();

  return (sample: Sample) => {
    if (productsStore.products.some((product) => product.sameAs(sample))) {
      return true;
    } else {
      return false;
    }
  };
}
