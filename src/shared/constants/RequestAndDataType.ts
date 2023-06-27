export const RequestAndDataTypeNames = {
  flip: 'flip',
  expGems: 'expGems',
};
export type RequestAndDataTypeNamesTypes =
  (typeof RequestAndDataTypeNames)[keyof typeof RequestAndDataTypeNames];
