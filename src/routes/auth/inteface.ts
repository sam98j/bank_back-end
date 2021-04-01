import { Client } from "../../Database/clients/interface";
import { responseObj } from "../global.interface";

// the client login credentioal
export interface ClientCredentioal {
    name: String;
    password: String;
} 
// when use authentecation is succeed
export interface IntRes extends responseObj{
    error: boolean;
    data: {
        currentClient: Client | null;
    }
} 
// when use authentecation is faild
export interface AuthFaild extends responseObj{
    error: true;
    data: String;
}
// when use authentecation is succeed
export interface LoginRes{
    error: boolean;
    data: {
        token: string | null,
        currentClient: Client | null;
    }
}
