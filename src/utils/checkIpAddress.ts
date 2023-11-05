import { type IncomingMessage } from 'http';
import { type NextApiRequestCookies } from 'next/dist/server/api-utils';
import { env } from '~/env.mjs';

export const checkIpAddress = (
  req: IncomingMessage & {
    cookies: NextApiRequestCookies;
  },
): boolean => {
  const ipAddress = req.headers['x-real-ip'] ?? req.socket.remoteAddress;
  console.log(req.headers['x-real-ip']);
  console.log(req.socket.remoteAddress);
  console.log(req.headers);
  // console.log(
  //   `IP Address: ${ipAddress?.toString()} trying to get close section`,
  // );
  let findAdminAddress = false;
  if (typeof ipAddress === 'string') {
    const ipv4Address = ipAddress.replace('::ffff:', '');
    findAdminAddress =
      ipv4Address === env.NEXT_PUBLIC_MY_IP_ADDRESS ||
      ipv4Address === '127.0.0.1' ||
      ipv4Address === '::1';
  } else if (Array.isArray(ipAddress)) {
    ipAddress.forEach((el) => {
      const ipv4Address = el?.replace('::ffff:', '');
      findAdminAddress =
        ipv4Address === env.NEXT_PUBLIC_MY_IP_ADDRESS ||
        ipv4Address === '127.0.0.1' ||
        ipv4Address === '::1';
    });
  }
  return findAdminAddress;
};
