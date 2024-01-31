import { getCollection } from "../database";
import type { Collection } from "mongodb";
import type { order, orderBasic, orderState } from "../types";

const ordersCollection: Collection = getCollection("core", "orders");

const characters: string = "abcdefghijklmnopqrstuvwxyz0123456789";

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function generateCode(length: number): string {
    let result = "";
    let counter = 0;

    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
        counter += 1;
    }

    return result;
}

export class Order {
    readonly user: string;
    readonly id: string;
    data: order;

    constructor(user: string, data: orderBasic) {
        this.user = user;
        this.id = data.id;
        this.data = data as unknown as order;
        this.data.code = generateCode(5);
    }

    public async setup(): Promise<boolean> {
        const setState: boolean = await this.setState("Not started");
        return setState;
    }

    public async destroy() {
        await ordersCollection.updateOne(
            {
                id: this.user,
            },
            {
                $pull: {
                    items: { id: this.id },
                },
            }
        );
    }

    public async setState(state: orderState): Promise<boolean> {
        this.data.state = state;
        return await this.updateDB();
    }

    private async updateDB(): Promise<boolean> {
        // Make sure the user exists
        const user = await ordersCollection.findOne({ id: this.user }, {});

        if (user === null) {
            ordersCollection.updateOne(
                {
                    id: this.user,
                },
                {
                    $set: {
                        items: [],
                    },
                },
                {
                    upsert: true,
                }
            );
        }

        const databaseResult = await ordersCollection.updateOne(
            {
                id: this.user,
            },
            {
                $set: {
                    "items.$[element]": this.data,
                },
            },
            {
                arrayFilters: [{ "element.id": this.id }],
                upsert: true,
            }
        );

        return databaseResult.acknowledged;
    }
}
