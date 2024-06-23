import path from "node:path";
import { pino } from "pino";

export class Logger {
    private static readonly logDirectory = path.join(process.cwd(), "logs");
    // private static readonly logFileUrl = fileURLToPath(
    //     new URL(`file://${path.join(this.logDirectory, "poeProfit.log")}`),
    // );
    private static readonly logFilePath = path.join(
        Logger.logDirectory,
        "poeProfit.log",
    );
    private static readonly transport = pino.transport({
        targets: [
            {
                level: "debug",
                target: "pino-pretty",
                options: {
                    colorize: true,
                    messageFormat: "{time} - [Poe Profit]: {msg}",
                },
            },
            {
                level: "debug",
                target: "pino/file",
                options: {
                    destination: this.logFilePath,
                    mkdir: true,
                },
            },
        ],
    });
    static readonly log = pino(
        { timestamp: pino.stdTimeFunctions.isoTime, level: "debug" },
        Logger.transport,
    );

    info(message: string) {
        Logger.log.info(message);
    }

    error(message: string) {
        Logger.log.error(message);
    }
    debug(message: string) {
        Logger.log.debug(message);
    }

    warn(message: string) {
        Logger.log.warn(message);
    }
    static info(message: string) {
        Logger.log.info(message);
    }

    static error(message: string) {
        Logger.log.error(message);
    }
    static debug(message: string) {
        Logger.log.debug(message);
    }

    static warn(message: string) {
        Logger.log.warn(message);
    }
}
