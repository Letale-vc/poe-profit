import * as fs from "fs";
import * as path from "path";
import { pino } from "pino";
import { fileURLToPath } from "url";

const logDirectory = path.join(process.cwd(), "logs");
const logDirectoryUrl = fileURLToPath(new URL(`file://${logDirectory}`));
const logFileUrl = fileURLToPath(new URL(`file://${path.join(logDirectory, "poeProfit.log")}`));
console.log(logDirectoryUrl);
// перевіряємо, чи існує директорія
if (!fs.existsSync(logDirectoryUrl)) {
    // якщо директорії не існує, створюємо її
    fs.mkdirSync(logDirectoryUrl);
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
        dest: logFileUrl,
        sync: true,
        minLength: 4096,
    }),
);

export default logger;
