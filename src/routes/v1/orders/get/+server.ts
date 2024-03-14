import { json } from "@sveltejs/kit";
import { getCollection } from "$lib/database";
import type { Collection } from "mongodb";
import type { order, restaurant } from "$lib/types";

const ordersCollection: Collection = getCollection("core", "orders");

export async function GET({ locals, fetch }) {
    const result = await ordersCollection.findOne({
        id: locals.session.user?.email,
    });
    const items: order[] = result?.items || [];

    // Sort the orders by date.
    items.sort(function (orderA: order, orderB: order) {
        return orderB.placed - orderA.placed;
    });

    // Remove the code from the orders & replace the restaurant ID with the actual name.
    for (let index = 0; index < items.length; index++) {
        const order: order = items[index];
        order.code = null as unknown as any;

        const restaurantFetch = await fetch(`/v1/restaurants/info/${order.restaurant}`);
        const { restaurant }: { restaurant: restaurant } = await restaurantFetch.json();
        order.restaurant = restaurant.name;
    }

    return json({
        success: true,
        orders: items,
    });
}
