export interface ShippingMethodFormValues {
    name: string;
    description: string;
    flatRate: number;
    freeAboveAmount: number;
    estimatedDaysMin: number;
    estimatedDaysMax: number;
}
export interface ShippingMethods {
    id: number;
    name: string;
    description: string;
    flatRate: number;
    freeAboveAmount: number;
    estimatedDaysMin: number;
    estimatedDaysMax: number;
}