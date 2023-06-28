import { logger } from '../../MyApp/Logger/LoggerPino';
import { myIpAddress, NODE_ENV } from '../constants/env';

export const checkIpAddress = (
  ipv6Address: string | string[] | undefined,
): boolean => {
  logger.info(`IP Address: ${ipv6Address} trying to get close section`);
  if (NODE_ENV === 'development') return true;
  let findAdminAddress = false;
  if (typeof ipv6Address === 'string') {
    const ipv4Address = ipv6Address.replace('::ffff:', '');
    findAdminAddress = ipv4Address === myIpAddress;
  } else if (Array.isArray(ipv6Address)) {
    ipv6Address.forEach((el) => {
      const ipv4Address = el?.replace('::ffff:', '');
      findAdminAddress = ipv4Address === myIpAddress;
    });
  }
  return findAdminAddress;
};
