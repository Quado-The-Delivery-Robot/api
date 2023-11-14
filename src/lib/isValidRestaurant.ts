import { v4 as uuidv4 } from "uuid";
import { getCollection } from "./database";
import type { Collection } from "mongodb";

const restaurantsCollection: Collection = getCollection("core", "restaurants");
const validRestaurants: string[] = [];

export default function isValidRestaurant(restaurant: string): boolean {
    if (validRestaurants.includes(restaurant)) {
        return true;
    }

    const result = restaurantsCollection.find({
        name: restaurant,
    });

    if (result.bufferedCount() == 1) {
        validRestaurants.push(restaurant);
        return true;
    }

    return false;
}
