import { resolve } from 'path';
import { Worker } from 'worker_threads';
import { logger } from '../MyApp/Logger/LoggerPino';

const filePath = resolve(__dirname, '..', 'MyApp', 'app', 'PoeFlip.js');
const worker = new Worker(filePath);

worker.on('message', (message) => {
  logger.info('Worker message:', message);
});

worker.on('error', (error) => {
  logger.error('Error worker:', error);
});

worker.on('exit', (code) => {
  logger.info('Exit worker. Code:', code);
});

export default worker;
