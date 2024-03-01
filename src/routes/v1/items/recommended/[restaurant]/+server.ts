import { json } from "@sveltejs/kit";
import type { restaurant, restaurantItem } from "$lib/types.js";

export async function GET({ fetch, params }) {
    const result = await fetch(`/v1/restaurants/info/${params.restaurant}`, {
        credentials: "include",
    });
    const { restaurant }: { restaurant: restaurant } = await result.json();
    const recommendedItems: restaurantItem[] = [];

    // Get the popular items from the restaurants.
    restaurant.items.forEach((item: restaurantItem) => {
        recommendedItems.push(item);
    });

    return json({
        success: recommendedItems.length > 0,
        data: recommendedItems,
    });
}
