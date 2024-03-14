import { json } from "@sveltejs/kit";
import { getCollection } from "$lib/database";
import type { Collection } from "mongodb";
import type { cart } from "$lib/types";

const cartsCollection: Collection = getCollection("app", "carts");

export async function GET({ locals, params }) {
    const result = await cartsCollection.findOne({
        id: locals.session.user?.email,
    });
    const carts: { [key: string]: cart } = result?.carts || {};
    const cart: cart | undefined = carts[params.cartID];

    return json({
        success: true,
        cart,
    });
}
