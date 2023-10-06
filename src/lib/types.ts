type orderItem = {
    id: number;
    quanity: number;
};

type orderStatus = "Picking up order" | "Waiting for order" | "On its way" | "Delivered";

export type order = {
    price: number,
    status: orderStatus;
    restaurant: string;
    items: orderItem[];
};
