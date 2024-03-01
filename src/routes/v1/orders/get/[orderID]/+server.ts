import { json } from "@sveltejs/kit";
import { getCollection } from "$lib/database";
import type { Collection } from "mongodb";
import type { RequestEvent } from "@sveltejs/kit";

const ordersCollection: Collection = getCollection("core", "orders");

export async function GET({ locals, params }: RequestEvent) {
    const result = await ordersCollection.findOne({
        id: locals.session.user?.email,
        "items.id": params.orderID,
    });

    return json({
        success: true,
        order: result,
    });
}
