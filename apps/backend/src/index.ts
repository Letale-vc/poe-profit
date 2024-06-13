import cors from "@fastify/cors";
import fastify from "fastify";
import { PoeProfitApp } from "./PoeProfitApp/app.js";

const poeProfitApp = new PoeProfitApp();

poeProfitApp.start().catch((err) => {
    server.log.error(err);
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
    await reply.send(poeProfitApp.getAllProfitData());
});

try {
    await server.listen({ port: 3000, host: "0.0.0.0" });
} catch (err) {
    server.log.error(err);
    process.exit(1);
}
