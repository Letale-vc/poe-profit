import { isAxiosError } from 'axios';
import { PoeErrorMessage } from '../API/Types/PoeErrorMessage';
import { logger } from '../Logger/LoggerPino';

export class PoeFlipError extends Error {
  code: number;
  constructor(error: any | number, message?: string) {
    if (isAxiosError<PoeErrorMessage>(error)) {
      super(error.response?.data.error.message || error.message);
      this.name = this.constructor.name;
      this.code = error.response?.data.error.code || 666;
      logger.error(error.message);
    } else {
      super(message || error.message);
      logger.error(message || error.message);
      this.name = this.constructor.name;
      this.code = error || 666;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}
