import { Client } from "../../Database/clients/interface";
import { responseObj } from "../global.interface";

// the client login credentioal
export interface ClientCredentioal {
    name: String;
    password: String;
} 
// when use authentecation is succeed
export interface IntSuccess extends responseObj{
    error: false;
    data: {
        currentClient: Client;
    }
} 
// when use authentecation is faild
export interface AuthFaild extends responseObj{
    error: true;
    data: String;
}
// when use authentecation is succeed
export interface LoginSuccess extends responseObj{
    error: false;
    data: {
        token: String,
        currentClient: Client;
    }
}