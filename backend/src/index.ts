import {Hono} from "hono";
import {serve} from "@hono/node-server";
import "dotenv/config";

const app = new Hono();

app.get("/", (c) => c.json({message: "backend ok"}));

const port = Number(process.env.PORT || 3000);

serve({
    fetch: app.fetch,
    port,
});

console.log(`server running on http://localhost:${port}`);