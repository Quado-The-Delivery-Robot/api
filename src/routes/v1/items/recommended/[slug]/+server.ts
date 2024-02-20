import { json } from "@sveltejs/kit";
import type { restaurant, restaurantItem } from "$lib/types.js";

export async function GET({ fetch, params }) {
    const restaurant: string | null = params.slug;
    const result = await fetch(`/v1/restaurants/info/${restaurant}`, {
        credentials: "include",
    });
    const { restaurant: restaurantInfo }: { restaurant: restaurant } = await result.json();
    const recommendedItems: restaurantItem[] = [];

    // Get the popular items from the restaurants.
    restaurantInfo.items.forEach((item: restaurantItem) => {
        recommendedItems.push(item);
    });

    return json({
        success: recommendedItems.length > 0,
        data: recommendedItems,
    });
}