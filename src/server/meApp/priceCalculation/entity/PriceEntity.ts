export class PriceEntity {
  [key: string]: number;
  chaos: number;
  divine: number;
  exalted: number;
  priceInChaosIfFullStackSize: number;
  priceInDivineIfFullStackSize: number;
  priceInExaltedIfFullStackSize: number;

  static createDefault() {
    const priceEntity = new PriceEntity();
    priceEntity.chaos = 0;
    priceEntity.divine = 0;
    priceEntity.exalted = 0;
    priceEntity.priceInChaosIfFullStackSize = 0;
    priceEntity.priceInDivineIfFullStackSize = 0;
    priceEntity.priceInExaltedIfFullStackSize = 0;
    return priceEntity;
  }
}
