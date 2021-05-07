import { Client, SingleTransaction } from "./clients.services";
import { responseObj } from "./global";

// response with all client in database
export interface AllClientsRes extends responseObj{
    error: false;
    data: [Client] | []
}
// response of route to get the receiver client
export interface GetReceiverRes extends responseObj{
    error: boolean;
    data: {receiver: Client | null}
}
// body of request ot get the receiver client
export interface GetReceiverBody {
    receiverPhone: string
}
// body of request to submit transfer money
export interface SubmitTransBody {
    receiverPhone: string;
    amount: number
}
// response of request to submit transfer money
export interface SubmitTransRes extends responseObj {
    error: boolean;
    data: {newBalance: number | null, newTransaction: SingleTransaction | null}
}