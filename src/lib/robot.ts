import { getCollection } from "./database";
import type { Collection } from "mongodb";

const robotsCollection: Collection = getCollection("core", "robots");

export class Robot {
    readonly api: string = "";

    constructor(api: string) {
        this.api = api;
    }

    public async setup(): Promise<boolean> {
        const databaseResult = await robotsCollection.updateOne(
            {
                api: this.api,
            },
            {},
            {
                upsert: true,
            }
        );

        let pingInterval: NodeJS.Timeout;
        pingInterval = setInterval(async () => {
            const isOnline: boolean = await this.ping();

            if (isOnline === false) {
                clearInterval(pingInterval);
                return;
            }
        }, 30000);

        return databaseResult.acknowledged;
    }

    public async destroy() {}

    private async ping(): Promise<boolean> {
        const ping = await fetch(this.api);
        const pingResult = await ping.text();

        if (pingResult === "OK") return true;

        return false;
    }
}

export async function registerRobot(api: string): Promise<[boolean, Robot]> {
    const robot = new Robot(api);
    const success: boolean = await robot.setup();
    return [success, robot];
}
