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
        this.data.placed = new Date().getTime();
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
        let user: any = await ordersCollection.findOne({ id: this.user });

        if (user === null) {
            user = {
                id: this.user,
                items: [],
            };

            await ordersCollection.insertOne(user);
        }

        const orderIndex: number = user?.items.findIndex((order: Order) => order.id === this.id);

        if (orderIndex === -1) {
            user!.items.push(this.data);
        } else {
            user!.items[orderIndex] = this.data;
        }

        const databaseResult = await ordersCollection.updateOne(
            {
                id: this.user,
            },
            {
                $set: {
                    items: user!.items,
                },
            }
        );

        return databaseResult.acknowledged;
    }
}
