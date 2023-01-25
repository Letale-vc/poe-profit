import { QueriesFlipEntity } from '../flipQueries/entity/query.entity';
import { round } from '../helpers/utils';
import { IPoeTradeItemInfo } from '../item/interface/IPoeTradeItemInfo';
import { FlipObjectEntity } from './entity/FlipObjectEntity';
import { IFlipObjectItem } from './interface/IFlipObjectItem';

export class FlipObject {
  constructor(
    private readonly poeTradeItemBuyingInfo: IPoeTradeItemInfo,
    private readonly poeTradeItemSellingInfo: IPoeTradeItemInfo,
    private readonly queriesFlip: QueriesFlipEntity,
    private readonly item: IFlipObjectItem,
  ) {}
  getFlipObject() {
    const flipObjectEntity = new FlipObjectEntity();
    flipObjectEntity.queriesFlipUuid = this.queriesFlip.uuid;
    flipObjectEntity.itemBuyingInfo = this.item.getItemInfo(
      this.poeTradeItemBuyingInfo,
      this.queriesFlip.itemBuying,
    );
    flipObjectEntity.itemSellingInfo = this.item.getItemInfo(
      this.poeTradeItemSellingInfo,
      this.queriesFlip.itemSelling,
      this.queriesFlip.itemSellingPriceMultiplier,
    );

    flipObjectEntity.profitInDivine =
      flipObjectEntity.itemSellingInfo.price.divine -
      flipObjectEntity.itemBuyingInfo.price.priceInDivineIfFullStackSize;

    flipObjectEntity.profitInDivinePerTrade =
      flipObjectEntity.profitInDivine /
      flipObjectEntity.itemBuyingInfo.maxStackSize;

    flipObjectEntity.profitInChaos = round(
      flipObjectEntity.itemSellingInfo.price.chaos -
        flipObjectEntity.itemBuyingInfo.price.priceInChaosIfFullStackSize,
    );
    flipObjectEntity.profitInChaosPerTrade = round(
      flipObjectEntity.profitInChaos /
        flipObjectEntity.itemBuyingInfo.maxStackSize,
    );

    return flipObjectEntity;
  }
}
