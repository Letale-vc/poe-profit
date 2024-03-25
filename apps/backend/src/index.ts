// Import the framework and instantiate it
import cors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyStatic from "@fastify/static";
import fastifyView from "@fastify/view";
import Fastify from "fastify";
import Handlebars from "handlebars";
import path from "path";
import CurrencyPriceFinder from "./PoeProfitApp/Currency/CurrencyPriceFinder.js";
import { PoeProfitApp } from "./PoeProfitApp/app.js";

const poeProfitApp = new PoeProfitApp();

poeProfitApp.start().catch((err) => {
    server.log.error(err);
    process.exit(1);
});

const server = Fastify({
    logger: true,
});
await server.register(cors, {
    origin: "*",
    methods: ["GET"],
});
await server.register(fastifyHelmet, {
    contentSecurityPolicy: false,
});
await server.register(fastifyView, {
    engine: {
        handlebars: Handlebars,
    },
    includeViewExtension: true,
    options: {
        partials: {
            head: "/views/partials/head.hbs",
            header: "/views/partials/header.hbs",
            footer: "/views/partials/footer.hbs",
        },
    },
});
const projectRoot = process.cwd();
const publicFolder = path.join(projectRoot, "public");
await server.register(fastifyStatic, {
    root: publicFolder,
    prefix: "/public/",
});

// Declare a route
server.get("/", async (_request, reply) => {
    await reply.view("/views/main", {
        divinePrice: CurrencyPriceFinder.currencyPrice.divine,
        title: "Poe Profit",
    });
});

server.get("/api/data", async (_request, reply) => {
    await reply.send(poeProfitApp.getAllProfitData());
});

try {
    await server.listen({ port: 3000 });
} catch (err) {
    server.log.error(err);
    process.exit(1);
}
