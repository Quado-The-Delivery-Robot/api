type orderStatus = "Picking up order" | "Waiting for order" | "On its way" | "Delivered";

export type userOrderItem = {
    id: number;
    quantity: number;
};

export type orderItem = userOrderItem & {
    price: number;
};

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
