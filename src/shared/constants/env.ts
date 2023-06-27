export const isServer = typeof window === 'undefined';

export const isClient = !isServer;

export const NODE_ENV = process.env.NODE_ENV || 'development';

export const PORT = process.env.PORT || 3000;

export const myIpAddress = '31.131.100.39';
