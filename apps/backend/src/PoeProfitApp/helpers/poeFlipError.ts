import logger from "./logger.js";

export default class AppError extends Error {
    originalError?: Error;
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    constructor(message = AppError.UNKNOWN, originalError?: Error | unknown) {
        super();
        this.name = this.constructor.name;
        this.message = message;
        if (originalError instanceof Error) this.originalError = originalError;

        // if (isAxiosError<PoeErrorMessage>(error)) {
        //   this.message = error.response?.data.error.message ?? error.message;
        // } else if (error instanceof Error) {
        //   this.message = error.message;
        // }
        logger.error(`AppError: ${this.message}`);
        Error.captureStackTrace(this, this.constructor);
    }
    static readonly SKIP_ITEM = "SKIP_ITEM";
    static readonly RATE_LIMIT = "RATE_LIMIT";
    static readonly UNKNOWN = "UNKNOWN";
}
