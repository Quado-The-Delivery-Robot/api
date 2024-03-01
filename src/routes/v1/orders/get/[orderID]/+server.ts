import { json } from "@sveltejs/kit";
import { getCollection } from "$lib/database";
import type { Collection } from "mongodb";
import type { order } from "$lib/types";

const ordersCollection: Collection = getCollection("core", "orders");

export async function GET({ locals, params }) {
    const result = await ordersCollection.findOne({
        id: locals.session.user?.email,
    });
    const items: order[] = result?.items || [];

    return json({
        success: true,
        order: items.filter((order: order) => order.id === params.orderID)[0],
    });
}
