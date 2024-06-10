import * as fs from "fs";
import * as path from "path";
import { pino } from "pino";
import { fileURLToPath } from "url";


class Logger {
    #logDirectory = path.join(process.cwd(), "logs");
    #logDirectoryUrl = fileURLToPath(new URL(`file://${this.#logDirectory}`));
    #logFileUrl = fileURLToPath(new URL(`file://${path.join(this.#logDirectory, "poeProfit.log")}`));
    #logger: pino.Logger

    constructor() {
        if (!fs.existsSync(this.#logDirectoryUrl)) {
            fs.mkdirSync(this.#logDirectoryUrl);
        }
        this.#logger = pino(
            {
                level: process.env.PINO_LOG_LEVEL ?? "error",
                transport: {
                    target: "pino-pretty",
                    options: {
                        colorize: true,
                        messageFormat: "[Poe Profit]: {time} - {level}: {msg}",
                    },
                },
                timestamp: pino.stdTimeFunctions.isoTime,
            },
            pino.destination({
                dest: this.#logFileUrl,
                sync: true,
                minLength: 4096,
            }),
        );
    }
    info(message: string) {
        this.#logger.info(message);
    }

    error(message: string) {
        this.#logger.error(message);
    }
    debug(message: string) {
        this.#logger.debug(message);
    }

    warn(message: string) {
        this.#logger.warn(message);
    }
}

export default new Logger();
