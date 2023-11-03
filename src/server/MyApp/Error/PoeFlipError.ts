import { isAxiosError } from "axios";
import { logger } from "../Logger/LoggerPino";
import { type PoeErrorMessage } from "poe-trade-fetch";

export class ApError {
  code: number;
  name: string;
  constructor(error: unknown, code?: number, message?: string) {
    if (isAxiosError<PoeErrorMessage>(error)) {
      this.name = this.constructor.name;
      this.code = error.response?.data.error.code ?? 666;
      logger.error(error.message);
    } else if (error instanceof Error) {
      logger.error(error.message);
      this.name = this.constructor.name;
      this.code = 666;
    } else {
      logger.error(message ?? "unknown error");
      this.name = this.constructor.name;
      this.code = code ?? 666;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}
