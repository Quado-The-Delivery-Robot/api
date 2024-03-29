import { json } from "@sveltejs/kit";
import { getCollection } from "$lib/database";
import type { Collection } from "mongodb";
import type { cart } from "$lib/types";

const cartsCollection: Collection = getCollection("app", "carts");

export async function GET({ locals }) {
    const result = await cartsCollection.findOne({
        id: locals.session.user?.email,
    });
    const carts: { [key: string]: cart } = result?.carts || {};

    return json({
        success: true,
        carts,
    });
}
