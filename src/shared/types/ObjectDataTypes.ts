import { ObjectProfitDataType } from '../../MyApp/FileManagers';
import { ItemType } from '../../MyApp/Item';

export type ItemInfoType = ItemType;

export interface DataToClientType {
  data: ObjectProfitDataType[];
  lastUpdate: Date;
}
