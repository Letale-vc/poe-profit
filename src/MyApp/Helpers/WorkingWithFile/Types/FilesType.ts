import { ObjectProfitDataType } from '../../../FileManagers';
import { TradeRequestType } from '../../../API/Types/TradeRequestType';
import { CurrencyNamesType } from '../../../../shared';

export interface CurrencyQueriesFileType {
  name: CurrencyNamesType;
  request: TradeRequestType;
}

export type AllTypeDataFiles = CurrencyQueriesFileType | ObjectProfitDataType;
