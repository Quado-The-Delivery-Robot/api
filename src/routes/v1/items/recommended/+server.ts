import { json } from "@sveltejs/kit";
import type { restaurant, restaurantItem } from "$lib/types.js";

export async function GET({ fetch }) {
    const result = await fetch("/v1/restaurants/recommended", {
        credentials: "include",
    });
    const { data: restaurants }: { data: restaurant[] } = await result.json();
    const recommendedItems: restaurantItem[] = [];

    // Get the popular items from the recommended restaurants.
    restaurants.forEach((restaurant: restaurant) => {
        let item: restaurantItem = restaurant.items[0];
        item.data = {
            colors: restaurant.colors,
        };
        recommendedItems.push(item);
    });

    return json({
        success: recommendedItems.length > 0,
        data: recommendedItems,
    });
}
