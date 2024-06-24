import cors from "@fastify/cors";
import fastify from "fastify";
import { Logger } from "./PoeProfitApp/helpers/logger.js";
import { PoeProfitApp } from "./PoeProfitApp/newApp.js";

const poeProfitApp = new PoeProfitApp();

await poeProfitApp.init();

void poeProfitApp.start().catch((err) => {
    if (err instanceof Error) {
        Logger.error(err.message);
        Logger.error(err.stack?.toString() ?? "");
    } else {
        Logger.error("Unknown error.");
    }
    poeProfitApp.stop();
    process.exit(1);
});

const server = fastify({
    logger: true,
});

await server.register(cors, {
    origin: "*",
    methods: ["GET"],
});

server.get("/api/data", async (_request, reply) => {
    const data = await poeProfitApp.getAllProfitData();
    await reply.send(data);
});

const port = Number.parseInt(process.env.PORT ?? "3000");
try {
    await server.listen({ port: port, host: "0.0.0.0" });
} catch (err) {
    server.log.error(err);
    process.exit(1);
}

process.on("beforeExit", () => {
    poeProfitApp.stop();
});
process.on("exit", () => {
    poeProfitApp.stop();
});
process.on("SIGINT", () => {
    poeProfitApp.stop();
    process.exit(0);
});

process.on("SIGTERM", () => {
    poeProfitApp.stop();
    process.exit(0);
});
