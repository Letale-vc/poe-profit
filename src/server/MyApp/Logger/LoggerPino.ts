import pino, { type Logger } from 'pino';
import pretty from 'pino-pretty';

const stream = pretty({
  levelFirst: true,
  colorize: true,
  ignore: 'time,hostname,pid',
});

export const logger: Logger = pino(
  {
    name: 'MyLogger',
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  },
  stream,
);
