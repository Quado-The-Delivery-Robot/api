import { json } from "@sveltejs/kit";
import { getCollection } from "$lib/database";
import isValidRestaurant from "$lib/isValidRestaurant";
import type { Collection } from "mongodb";
import type { cart } from "$lib/types";

const cartsCollection: Collection = getCollection("app", "carts");

export async function POST({ request, locals }) {
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
        cart.items.forEach((itemID: string) => {
            carts[cart.restaurant].items.push(itemID);
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
