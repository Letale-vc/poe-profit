import { myIpAddress, NODE_ENV } from '../constants/env';

export const checkIpAddress = (
  ipv6Address: string | string[] | undefined,
): boolean => {
  if (NODE_ENV === 'development') return true;
  let findAdminAddress: boolean = false
  if (typeof ipv6Address === 'string') {
    const ipv4Address = ipv6Address.replace('::ffff:', '');
    findAdminAddress = ipv4Address === myIpAddress
  } else if (Array.isArray(ipv6Address)) {
    ipv6Address.forEach(el=>{
    const  ipv4Address = el?.replace('::ffff:', '');
    findAdminAddress = ipv4Address === myIpAddress
    })
    
  }
  return findAdminAddress
};
