import { json } from "@sveltejs/kit";
import { getCollection } from "$lib/database";
import type { Collection } from "mongodb";
import type { order, restaurant } from "$lib/types";

const ordersCollection: Collection = getCollection("core", "orders");

export async function GET({ locals, params, fetch }) {
    const result = await ordersCollection.findOne({
        id: locals.session.user?.email,
    });
    const items: order[] = result?.items || [];
    const order: order = items.filter((order: order) => order.id === params.orderID)[0];

    if (order) {
        order.code = null as unknown as any;

        const restaurantFetch = await fetch(`/v1/restaurants/info/${order.restaurant}`);
        const { restaurant }: { restaurant: restaurant } = await restaurantFetch.json();
        order.restaurant = restaurant.name;
    }

    return json({
        success: true,
        order,
    });
}
