import { Product, Sample } from "../types/_types";

export function useReorderNewRank(
  sourceIndex: number,
  destinationIndex: number,
  items: Array<Sample | Product>
) {
  let targetItemRank = items[destinationIndex].rank;
  if (sourceIndex > destinationIndex) {
    // Drag up
    if (items[destinationIndex - 1] === undefined) {
      return (targetItemRank + (targetItemRank - 1)) / 2;
    } else {
      let previousProductRank = items[destinationIndex - 1].rank;
      return (targetItemRank + previousProductRank) / 2;
    }
  } else {
    // Drag down
    if (items[destinationIndex + 1] === undefined) {
      return targetItemRank + 1;
    } else {
      let nextProductRank = items[destinationIndex + 1].rank;
      return (targetItemRank + nextProductRank) / 2;
    }
  }
}
