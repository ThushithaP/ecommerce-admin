// billingAddress
// branch
// branchName
// channel
// currency
// customer
// customerEmail
// customerName
// discount
// grandTotal
// id
// orderNo
// ordered_at
// shipping
// shippingAddress
// status
// subtotal
// tax
export interface Address {
    city: string;
    fullName: string;
    line1: string;
    line2: string;
    postalCode: string;
}

export interface Attribute {
    key: string;
    value: string;
}
export interface OrderFormValues {

}

export interface Payments {
    id: string;
    amount: string;
    confirmedBy: string;
    confirmedByEmp: string;
    currency: string;
    method: string;
    order: string;
    orderNo: string;
    paid_at: string;
    status: string;
    transactionReference: string;
    created_at: string;
}

export interface Item {
    id: number
    discount: string;
    productName: string;
    quantity: number;
    tax: string;
    total: string;
    unitPrice: string;
    variant: number
    variantAttributes: Attribute[]
    variantSku: string;
}

export interface Orders {
    id: string;
    orderNo: string;
    branchName: string;
    channel: string;
    currency: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    discount: string;
    grandTotal: string;
    ordered_at: string;
    shippingAddress: Address
    billingAddress: Address
    shippingMethod: string;
    shippingFee: string;
    status: string;
    subtotal: string;
    tax: string;
    items: Item[];
    payments: Payments[]
}

// amount
// : 
// "5018.86"
// created_at
// : 
// "2026-09-06T04:54:49.552893Z"
// currency
// : 
// "LKR"
// id
// : 
// "5d880d70-9ace-4a01-bf71-6d3c71683a02"
// method
// : 
// "cash"
// order
// : 
// "1eeeb45a-ef35-4ed5-9790-c005a6028d6b"
// orderNo
// : 
// "ORD-20260906-0002"
// paid_at
// : 
// null
// status
// : 
// "pending"
// transactionReference
// : 
// null

export interface OrderPayment {
    id: string;
    amount: string;
    confirmedBy: string;
    confirmedByEmp: string;
    currency: string;
    method: string;
    order: string;
    orderNo: string;
    paid_at: string;
    status: string;
    transactionReference: string;
}