import { NODE_ENV } from "$env/static/private";
import { v4 as uuidv4 } from "uuid";
import { getCollection } from "../database";
import { robotFree } from "$lib/controllers/orders";
import type { Collection } from "mongodb";
import type { robotState } from "../types";
import type { Order } from "./order";

const robotsCollection: Collection = getCollection("core", "robots");

export class Robot {
    readonly api: string;
    readonly id: string;
    state: robotState | undefined;
    order: Order | null = null;

    constructor(api: string) {
        this.api = api;
        this.id = uuidv4();
    }

    public async setup(): Promise<boolean> {
        let pingInterval: NodeJS.Timeout;
        pingInterval = setInterval(async () => {
            const isOnline: boolean = await this.ping();

            if (isOnline === false) {
                clearInterval(pingInterval);
                return;
            }
        }, 30000);

        const setState: boolean = await this.setState("free");
        return setState;
    }

    public async destroy() {
        await robotsCollection.deleteOne({
            id: this.id,
        });
    }

    public async setState(state: robotState): Promise<boolean> {
        if (state === this.state) return false;
        if (state === "free") robotFree(this);

        this.state = state;
        return this.updateDB();
    }

    public async startOrder(order: Order): Promise<boolean> {
        const startFetch = await fetch(this.api + "/startOrder", {
            method: "POST",
            body: JSON.stringify({
                code: order.data.code,
            }),
        });
        const startResult = await startFetch.text();

        if (startResult !== "OK") {
            return false;
        }

        this.setState("delivering");

        this.order = order;
        order.setState("Picking up order");

        return this.updateDB();
    }

    private async updateDB(): Promise<boolean> {
        const databaseResult = await robotsCollection.updateOne(
            {
                id: this.id,
            },
            {
                $set: this,
            },
            {
                upsert: true,
            }
        );

        return databaseResult.acknowledged;
    }

    private async ping(): Promise<boolean> {
        // If the current mode is development its very likely its not actual production robot.
        if (NODE_ENV === "development") return true;

        const ping = await fetch(this.api);
        const pingResult = await ping.text();

        if (pingResult === "OK") return true;

        return false;
    }
}
