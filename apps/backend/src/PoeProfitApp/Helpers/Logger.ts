import * as fs from "fs";
import * as path from "path";
import { pino } from "pino";

const logDirectory = path.resolve("logs");

// перевіряємо, чи існує директорія
if (!fs.existsSync(logDirectory)) {
    // якщо директорії не існує, створюємо її
    fs.mkdirSync(logDirectory);
}

const logger = pino(
    {
        level: process.env.PINO_LOG_LEVEL ?? "info",
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
        dest: path.join(logDirectory, "poeProfit.log"),
        sync: true,
        minLength: 4096,
    }),
);

export default logger;
