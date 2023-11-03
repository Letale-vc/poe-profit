import { type ObjectProfitDataType } from '../../../FileManagers';
import { type FILE_NAMES } from '../constants';

export type AllTypeDataFiles = ObjectProfitDataType;

export type FileNamesType = (typeof FILE_NAMES)[keyof typeof FILE_NAMES];
