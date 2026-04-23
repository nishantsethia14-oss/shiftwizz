import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MovementQuote {
    id: string;
    customerName: string;
    customerPhone: string;
    fromAddress: string;
    createdAt: bigint;
    items: string;
    estimatedDate: string;
    toAddress: string;
}
export interface Contact {
    id: string;
    name: string;
    createdAt: bigint;
    itemCount: string;
    message: string;
    address: string;
    phone: string;
}
export interface backendInterface {
    addContactRequest(contact: Contact): Promise<boolean>;
    addMovementQuote(quote: MovementQuote): Promise<boolean>;
    getContactRequests(): Promise<Array<Contact>>;
    getMovementQuotes(): Promise<Array<MovementQuote>>;
}
