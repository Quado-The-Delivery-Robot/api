import { v4 as uuidv4 } from "uuid";
import { getCollection } from "./database";
import type { Collection } from "mongodb";
import type { robotState, order } from "./types";

const robotsCollection: Collection = getCollection("core", "robots");
const robots: Robot[] = [];

export class Robot {
    readonly api: string = "";
    readonly id: string = "";
    state: robotState = "free";
    order: order | null = null;

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
        this.state = state;
        return this.updateDB();
    }

    public async startOrder(order: order): Promise<boolean> {
        this.setState("delivering");
        this.order = order;
        return this.updateDB();
    }

    private async updateDB(): Promise<boolean> {
        const databaseResult = await robotsCollection.updateOne(
            {
                id: this.id,
            },
            this,
            {
                upsert: true,
            }
        );

        return databaseResult.acknowledged;
    }

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

    if (success) robots.push(robot);

    return [success, robot];
}

export function getAvailableRobot(): Robot {
    let availableRobot: Robot;

    robots.forEach((robot: Robot) => {
        if (robot.state !== "free") return;

        availableRobot = robot;
    });

    return availableRobot!;
}
