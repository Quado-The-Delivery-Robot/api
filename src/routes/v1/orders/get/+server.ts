import { json } from "@sveltejs/kit";
import { getCollection } from "$lib/database";
import type { Collection } from "mongodb";
import type { RequestEvent } from "@sveltejs/kit";
import type { order, restaurant } from "$lib/types";

const ordersCollection: Collection = getCollection("core", "orders");

export async function GET({ locals, fetch }: RequestEvent) {
    const result = await ordersCollection.findOne({
        id: locals.session.user?.email,
    });
    const items: order[] = result?.items || [];

    // Sort the orders by date.
    items.sort(function (orderA: order, orderB: order) {
        return orderB.placed - orderA.placed;
    });

    // Remove the code from the orders & replace the restaurant ID with the actual name.
    items.forEach(async (order: order) => {
        order.code = null as unknown as any;

        const restaurantFetch = await fetch(`/v1/restaurants/info/${order.restaurant}`);
        const { restaurant }: { restaurant: restaurant } = await restaurantFetch.json();
        order.restaurant = "bruv";
    });

    return json({
        success: true,
        orders: items,
    });
}
