import {Context} from "hono";
import { ensureSessionId } from "../middlewares/session";
import {prisma} from "../lib/prisma";
import { fetchProduct } from "../services/fakestore";
import {Prisma} from "../generated/prisma/client";

export async function CheckoutController(c: Context) {
    const sessionId = ensureSessionId(c);
    const cart = await prisma.cart.upsert({
        where: {sessionId},
        update: {},
        create: {sessionId},
        include: {items: true},
    });

    if(cart.items.length === 0) {
        return c.json({message: "Cart is empty"}, 400);
    }

    const snapshots = await Promise.all(
        cart.items.map(async (item) => {
            const product = await fetchProduct(item.productId);
            return {
                productId: item.productId,
                quantity: item.quantity,
                title: product.title,
                image: product.image,
                unitPrice: new Prisma.Decimal(product.price),
                lineTotal: new Prisma.Decimal(product.price).mul(item.quantity),
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
    })

    return c.json(order);
}