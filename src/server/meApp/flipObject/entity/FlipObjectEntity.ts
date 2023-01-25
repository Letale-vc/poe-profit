import { ItemInfoEntity } from '../../item/entity/ItemInfo.entity';

export class FlipObjectEntity {
  itemBuyingInfo: ItemInfoEntity;
  itemSellingInfo: ItemInfoEntity;
  profitInDivine: number;
  profitInDivinePerTrade: number;
  profitInChaos: number;
  profitInChaosPerTrade: number;
  queriesFlipUuid: string;
}
