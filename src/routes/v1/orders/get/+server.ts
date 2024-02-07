import { json } from "@sveltejs/kit";
import { getCollection } from "$lib/database";
import type { Collection } from "mongodb";
import type { RequestEvent } from "@sveltejs/kit";
import type { order, restaurant } from "$lib/types";

const ordersCollection: Collection = getCollection("core", "orders");
const pageSize: number = 15;

// https://stackoverflow.com/questions/42761068/paginate-javascript-array
function paginate(array: order[], pageNumber: number): order[] {
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}

export async function GET({ request, locals, fetch }: RequestEvent) {
    const pageNumber: number = (await request.json()).pageNumber || 1;
    const result = await ordersCollection.findOne({
        id: locals.session.user?.email,
    });
    const items: order[] = paginate(result?.items || [], pageNumber);

    // Sort the orders by date.
    items.sort(function (orderA: order, orderB: order) {
        return orderB.placed - orderA.placed;
    });

    // Remove the code from the orders & replace the restaurant ID with the actual name.
    items.forEach(async (order: order) => {
        order.code = null as unknown as any;

        const restaurantFetch = await fetch(`/restaurants/info/${order.restaurant}`);
        const restaurant: restaurant = await restaurantFetch.json();
        console.log(await restaurantFetch.json());
        order.restaurant = restaurant.name;
    });

    return json({
        success: true,
        orders: items,
    });
}
