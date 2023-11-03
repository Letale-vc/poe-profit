import { type ObjectProfitDataType } from '../FileManagers';
import { type ItemType } from '../Item';

export type ItemInfoType = ItemType;

export interface DataToClientType {
  data: ObjectProfitDataType[];
  lastUpdate: Date;
}
