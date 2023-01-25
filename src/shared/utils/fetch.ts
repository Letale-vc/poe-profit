import { isServer, PORT } from '../constants/env';

export const envAwareUrl = (url: string) => {
  return isServer && url.startsWith('/')
    ? `http://localhost:${PORT}${url}`
    : url;
};
