import { myIpAddress, NODE_ENV } from '../constants/env';

export const checkIpAddress = (
  ipv6Address: string | string[] | undefined,
): boolean => {
  if (NODE_ENV === 'development') return true;
  let ipv4Address: string | undefined;

  if (typeof ipv6Address === 'string') {
    ipv4Address = ipv6Address.replace('::ffff:', '');
  } else if (Array.isArray(ipv6Address)) {
    ipv4Address = ipv6Address[0]?.replace('::ffff:', '');
  }
  return ipv4Address === myIpAddress;
};
