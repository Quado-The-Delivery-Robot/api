type orderItem = {
    id: number;
    quanity: number;
};

type orderStatus = "Picking up order" | "Waiting for order" | "On its way" | "Delivered";

export type robotState = "delivering" | "waiting" | "free";

export type order = {
    id: string,
    price: number;
    status: orderStatus;
    restaurant: string;
    items: orderItem[];
};

export type restaurant = {
    name: string;
    colors: string[];
    tags: string[];
    image: string;
    nameID: string;
    items: any;
};
