import {Hono} from "hono";
import {cors} from "hono/cors";
import {serve} from "@hono/node-server";
import product from "./routes/product";
import cart from "./routes/cart";
import checkout from "./routes/checkout";
import {errorHandler} from "./middlewares/errorHandler";


const app = new Hono();

app.use(
    "/*",
    cors({
        origin: [ `${process.env.FRONTEND_URL}` || "http://localhost:5173"],
        credentials: true,
    })
);

app.route("/api/products", product);
app.route("/api/cart", cart);
app.route("/api/checkout", checkout);

// app.use(errorHandler);

const port = 3000;
console.log(`Backend running at http://localhost:${port}`);

serve({
    fetch: app.fetch,
    port,
});