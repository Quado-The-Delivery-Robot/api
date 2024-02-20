import { json } from "@sveltejs/kit";
import { getCollection } from "$lib/database";
import type { Collection } from "mongodb";
import type { RequestEvent } from "@sveltejs/kit";
import type { cart } from "$lib/types";

const cartsCollection: Collection = getCollection("core", "carts");

export async function GET({ locals }: RequestEvent) {
    const result = await cartsCollection.findOne({
        id: locals.session.user?.email,
    });
    const carts: { [key: string]: cart } = result?.carts || {};

    return json({
        success: true,
        carts,
    });
}
