import {Hono} from "hono";
import {cors} from "hono/cors";
import {serve} from "@hono/node-server";
import {z} from "zod";
import {prisma} from "./lib/prisma";
import { ensureSessionId } from "./session";
import { fetchProduct, fetchProducts } from "./fakestore";
import {Prisma} from "./generated/prisma/client";


const app = new Hono();

app.use(
    "/*",
    cors({
        origin: ["http://localhost:5173"],
        credentials: true,
    })
);

app.get("/api/products", async (c) => {
    console.log("yes");
    const list = await fetchProducts();
    return c.json(list);
});

app.get("/api/products/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const p = await fetchProduct(id);
    return c.json(p);
});

// cart helpers
async function getOrCreateCart(sessionId: string) {
    return prisma.cart.upsert({
        where: {sessionId},
        update: {},
        create: {sessionId},
        include: {items: true},
    });
}

//cart routes
app.get("/api/cart", async (c) => {
    const sessionId = ensureSessionId(c);
    const cart = await getOrCreateCart(sessionId);
    return c.json(cart);
});

const addItemSchema = z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().positive().max(99).default(1),
});

app.post("/api/cart/items", async (c) => {
    const sessionId = ensureSessionId(c);
    const body = addItemSchema.parse(await c.req.json());
    const cart = await getOrCreateCart(sessionId);

    await prisma.cartItem.upsert({
        where: {cartId_productId: {cartId: cart.id, productId: body.productId}},
        update: {quantity: {increment: body.quantity}},
        create: {cartId: cart.id, productId: body.productId, quantity: body.quantity},
    });

    const updated = await prisma.cart.findUnique({
        where: {id: cart.id},
        include: {items: true},
    });

    return c.json(updated);
});

const setQtySchema = z.object({
    quantity: z.number().int().min(1).max(99),
});

app.patch("/api/cart/items/:productId", async (c) => {
    const sessionId = ensureSessionId(c);
    const productId = Number(c.req.param("productId"));
    const {quantity} = setQtySchema.parse(await c.req.json());
    const cart = await getOrCreateCart(sessionId);

    await prisma.cartItem.update({
        where: {cartId_productId: {cartId: cart.id, productId}},
        data: {quantity},
    });

    const updated = await prisma.cart.findUnique({
        where: {id: cart.id},
        include: {items: true},
    });

    return c.json(updated);
});

app.delete("/api/cart/items/:productId", async (c) => {
    const sessionId = ensureSessionId(c);
    const productId = Number(c.req.param("productId"));
    const cart = await getOrCreateCart(sessionId);

    await prisma.cartItem.delete({
        where: {cartId_productId: {cartId: cart.id, productId}},
    });

    const updated = await prisma.cart.findUnique({
        where: {id: cart.id},
        include: {items: true},
    });

    return c.json(updated);

});

//checkout
app.post("/api/checkout", async (c) => {
    const sessionId = ensureSessionId(c);
    const cart = await getOrCreateCart(sessionId);

    if(cart.items.length === 0) {
        return c.json({message: "cart is empty"}, 400);
    }

    //fetch product snapshots
    const snapshots = await Promise.all(
        cart.items.map(async (i) => {
            const p = await fetchProduct(i.productId);
            return {
                productId: i.productId,
                quantity: i.quantity,
                title: p.title,
                image: p.image,
                unitPrice: new Prisma.Decimal(p.price),
                lineTotal: new Prisma.Decimal(p.price).mul(i.quantity),
            };
        })
    );

    const total = snapshots.reduceRight(
        (acc, s) => acc.add(s.lineTotal),
        new Prisma.Decimal(0)
    );

    const order = await prisma.$transaction(async (tx) => {
        const created = await tx.order.create({
            data: {
                sessionId,
                total,
                items: {
                    create: snapshots.map((s) => ({
                        productId: s.productId,
                        quantity: s.quantity,
                        title: s.title,
                        image: s.image,
                        unitPrice: s.unitPrice,
                    })),
                },
            },
            include: {items: true},
        });

        await tx.cartItem.deleteMany({where: {cartId: cart.id}});
        return created;
    });

    return c.json(order);
});

const port = 3000;
console.log(`Backend running at http://localhost:${port}`);

serve({
    fetch: app.fetch,
    port,
});