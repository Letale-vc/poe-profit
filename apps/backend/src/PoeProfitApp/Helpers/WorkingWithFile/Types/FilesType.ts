import type { ObjectProfitDataType } from "../../../FileManagers/index.js";
import type { FILE_NAMES } from "../constants.js";

export type AllTypeDataFiles = ObjectProfitDataType;

export type FileNamesType = (typeof FILE_NAMES)[keyof typeof FILE_NAMES];
