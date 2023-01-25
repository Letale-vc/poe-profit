import { IFlipObjectItem } from '../flipObject/interface/IFlipObjectItem';
import { TradeQueryType } from '../types/TradeQueryType';
import { ItemInfoEntity } from './entity/ItemInfo.entity';
import { IItemPriceCalculation } from './interface/IItemPriceCalculation';
import { IPoeTradeItemInfo } from './interface/IPoeTradeItemInfo';

export class Item implements IFlipObjectItem {
  constructor(
    private readonly leagueName: string,
    private readonly itemPrice: IItemPriceCalculation,
  ) {}

  private getPoeTradeLink(id: string) {
    const poeTradeLinkURL = new URL('https://www.pathofexile.com/trade/search');
    poeTradeLinkURL.pathname = `${poeTradeLinkURL.pathname}/${this.leagueName}/${id}`;
    return poeTradeLinkURL.toString();
  }

  private getName(tradeQuery: TradeQueryType) {
    const { name, type, term } = tradeQuery.query;
    if (typeof name === 'string' && typeof type === 'string') {
      return name;
    }
    if (!name && typeof type === 'string') {
      return type;
    }
    if (typeof name === 'object' && name.option) {
      return name.option;
    }
    if (!name && typeof type === 'object' && type.option) {
      return type.option;
    }
    if (!!term) {
      return term;
    }
    return '';
  }

  getItemInfo(
    poeTradeItemInfo: IPoeTradeItemInfo,
    tradeQuery: TradeQueryType,
    priceMultiplier?: number,
  ) {
    const { result, id, total } = poeTradeItemInfo;

    const item = new ItemInfoEntity();
    item.maxStackSize = result[0].item.maxStackSize || 1;
    const itemPrice = this.itemPrice.getItemPrice(
      result,
      total,
      item.maxStackSize,
      priceMultiplier || 1,
    );
    item.name = this.getName(tradeQuery);
    item.poeTradeLink = this.getPoeTradeLink(id);
    item.totalInTrade = total;
    item.price = itemPrice;

    return item;
  }
}
