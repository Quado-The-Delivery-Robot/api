import { getCollection } from "./database";
import type { Collection } from "mongodb";

const restaurantsCollection: Collection = getCollection("core", "restaurants");
const validRestaurants: string[] = [];

export default async function isValidRestaurant(restaurant: string): Promise<boolean> {
    if (validRestaurants.includes(restaurant)) {
        return true;
    }

    const result = await restaurantsCollection.findOne({
        nameID: restaurant,
    });

    if (result !== null) {
        validRestaurants.push(restaurant);
        return true;
    }

    return false;
}
