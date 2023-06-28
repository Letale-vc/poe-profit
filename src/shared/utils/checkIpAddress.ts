import { IncomingMessage } from 'http';
import { logger } from '../../MyApp/Logger/LoggerPino';
import { myIpAddress, NODE_ENV } from '../constants/env';
import type { Request } from 'express';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

export const checkIpAddress = (
  req:
    | Request
    | (IncomingMessage & {
        cookies: NextApiRequestCookies;
      }),
): boolean => {
  const ipAddress = req.headers['x-real-ip'] || req.socket.remoteAddress;
  logger.info(`IP Address: ${ipAddress} trying to get close section`);
  if (NODE_ENV === 'development') return true;
  let findAdminAddress = false;
  if (typeof ipAddress === 'string') {
    const ipv4Address = ipAddress.replace('::ffff:', '');
    findAdminAddress =
      ipv4Address === myIpAddress || ipv4Address === '127.0.0.1';
  } else if (Array.isArray(ipAddress)) {
    ipAddress.forEach((el) => {
      const ipv4Address = el?.replace('::ffff:', '');
      findAdminAddress =
        ipv4Address === myIpAddress || ipv4Address === '127.0.0.1';
    });
  }
  return findAdminAddress;
};
