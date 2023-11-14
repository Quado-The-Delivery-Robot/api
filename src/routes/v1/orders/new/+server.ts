import { json } from "@sveltejs/kit";
import { getCollection } from "$lib/database";
import isValidRestaurant from "$lib/isValidRestaurant";
import type { Collection } from "mongodb";
import type { Session } from "@auth/core/types";
import type { RequestEvent } from "@sveltejs/kit";
import type { order, orderItem } from "$lib/types";

const ordersCollection: Collection = getCollection("core", "orders");
const restaurantsCollection: Collection = getCollection("core", "restaurants");

type userOrder = {
    restaurant: string;
    items: orderItem[];
};

export async function POST({ request, locals }: RequestEvent) {
    const session: Session = (await locals.getSession()) as Session;
    const order: userOrder = await request.json();

    if (!isValidRestaurant(order.restaurant)) {
        return json({
            success: false,
            error: "Invalid restaurant.",
        });
    }

    const restaurantResult = await restaurantsCollection.findOne({
        name: order.restaurant,
    });
    let orderItems = [];

    order.items.forEach((item: orderItem) => {
        const itemData = restaurantResult?.items[item.id];

        if (typeof itemData == null) return;

        orderItems[item.id] = {
            price: itemData.price,
            id: item.id,
            quantity: item.quantity,
        };
    });

    const result = await ordersCollection.updateOne(
        {
            user: session?.user?.email,
        },
        {
            $push: {
                orders: order,
            },
        },
        {
            upsert: true,
        }
    );

    return json({
        success: result.acknowledged,
    });
}
