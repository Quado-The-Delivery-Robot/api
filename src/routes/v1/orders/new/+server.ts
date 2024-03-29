import { json } from "@sveltejs/kit";
import { v4 as uuidv4 } from "uuid";
import { getCollection } from "$lib/database";
import isValidRestaurant from "$lib/isValidRestaurant";
import { createOrder } from "$lib/controllers/orders";
import type { Collection } from "mongodb";
import type { orderItem, userOrderItem } from "$lib/types";

const restaurantsCollection: Collection = getCollection("core", "restaurants");

type userOrder = {
    restaurant: string;
    items: userOrderItem[];
};

export async function POST({ request, locals }) {
    const userOrder: userOrder = await request.json();

    if (!isValidRestaurant(userOrder.restaurant)) {
        return json({
            success: false,
            error: "Invalid restaurant.",
        });
    }

    const restaurantResult = await restaurantsCollection.findOne({
        id: userOrder.restaurant,
    });
    let orderItems: orderItem[] = [];
    let orderPrice: number = 0;

    userOrder.items.forEach((item: userOrderItem) => {
        const itemData = restaurantResult?.items[item.id];

        if (typeof itemData == null) return;

        orderPrice += itemData.price;
        orderItems[item.id] = {
            price: itemData.price,
            id: item.id,
            quantity: item.quantity,
        };
    });

    return json({
        success: await createOrder(locals.session.user?.email!, {
            id: uuidv4(),
            items: orderItems,
            price: orderPrice,
            restaurant: userOrder.restaurant,
            state: "Not started",
        }),
    });
}
