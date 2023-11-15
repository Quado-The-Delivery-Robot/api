import { v4 as uuidv4 } from "uuid";
import { getCollection } from "../database";
import type { Collection } from "mongodb";
import type { order, orderState } from "../types";

const ordersCollection: Collection = getCollection("core", "orders");

export class Order {
    readonly user: string;
    readonly id: string;
    data: order;

    constructor(user: string, data: order) {
        this.user = user;
        this.id = uuidv4();
        data.id = this.id
        this.data = data
    }

    public async setup(): Promise<boolean> {
        const setState: boolean = await this.setState("Not started");
        return setState;
    }

    public async destroy() {
        await ordersCollection.updateOne(
            {
                id: this.id,
            },
            {
                $pull: {
                    order: { id: this.id }
                }
            }
        );
    }

    public async setState(state: orderState): Promise<boolean> {
        this.data.state = state;
        return this.updateDB();
    }

    private async updateDB(): Promise<boolean> {
        const databaseResult = await ordersCollection.updateOne(
            {
                id: this.id,
                "items.id": this.id,
            },
            {
                $set: {
                    "items.$": this.data
                }
            }
        );

        return databaseResult.acknowledged;
    }
}