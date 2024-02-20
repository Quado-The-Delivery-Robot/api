import { json } from "@sveltejs/kit";
import { v4 as uuidv4 } from "uuid";
import { getCollection } from "$lib/database";
import isValidRestaurant from "$lib/isValidRestaurant";
import { createOrder } from "$lib/controllers/orders";
import type { Collection } from "mongodb";
import type { RequestEvent } from "@sveltejs/kit";
import type { cart, cartItem } from "$lib/types";

const cartsCollection: Collection = getCollection("core", "carts");

export async function POST({ request, locals }: RequestEvent) {
    const cart: cart = await request.json();

    if (!isValidRestaurant(cart.restaurant)) {
        return json({
            success: false,
            error: "Invalid restaurant.",
        });
    }

    const result = await cartsCollection.findOne({
        id: locals.session.user?.email,
    });
    const carts: { [key: string]: cart } = result?.carts || {};

    if (carts[cart.restaurant]) {
        cart.items.forEach((cartItem: cartItem) => {
            carts[cart.restaurant].items.push(cartItem);
        });
    } else {
        carts[cart.restaurant] = {
            restaurant: cart.restaurant,
            items: cart.items,
        };
    }

    const updateResult = await cartsCollection.updateOne(
        {
            id: locals.session.user?.email,
        },
        {
            $set: {
                carts,
            },
        }
    );

    return json({
        success: updateResult.acknowledged,
    });
}
