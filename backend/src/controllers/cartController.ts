import {Context} from "hono";
import { ensureSessionId } from "../middlewares/session";
import {prisma} from "../lib/prisma";
import {z} from "zod";

const addItemSchema = z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().positive().max(99).default(1),
});

const seQtySchema = z.object({
    quantity: z.number().int().min(1).max(99),
});

export const CartController = {
    getCart: async (c: Context) => {
        const sessionId = ensureSessionId(c);
        const cart = await prisma.cart.upsert({
            where: {sessionId},
            update: {},
            create: {sessionId},
            include: {items: true},
        });
        return c.json(cart);
    },

    addItemToCart: async (c: Context) => {
        const sessionId = ensureSessionId(c);
        const body = addItemSchema.parse(await c.req.json());
        const cart = await prisma.cart.upsert({
            where: {sessionId},
            update: {},
            create: {sessionId},
            include: {items: true},
        });

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
    },
    addQuantity: async (c: Context) => {
        const sessionId = ensureSessionId(c);
        const productId = Number(c.req.param("productId"));
        const {quantity} = seQtySchema.parse(await c.req.json());
        const cart = await prisma.cart.upsert({
            where: {sessionId},
            update: {},
            create: {sessionId},
            include: {items: true},
        });

        await prisma.cartItem.update({
            where: {cartId_productId: {cartId: cart.id, productId}},
            data: {quantity},
        });

        const updated = await prisma.cart.findUnique({
            where: {id: cart.id},
            include: {items: true},
        });

        return c.json(updated);
    },

    deleteItem: async (c: Context) => {
        const sessionId = ensureSessionId(c);
        const productId = Number(c.req.param("productId"));
        const cart = await prisma.cart.upsert({
            where: {sessionId},
            update: {},
            create: {sessionId},
            include: {items: true},
        });

        await prisma.cartItem.delete({
            where: {cartId_productId: {cartId: cart.id, productId}},
        });

        const updated = await prisma.cart.findUnique({
            where: {id: cart.id},
            include: {items: true},
        });

        return c.json(updated);
    }
}