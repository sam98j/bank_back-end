import { Client } from "./client.interface";

// the client login credentioal
export interface ClientCredentioal {
    name: String;
    password: String;
  }
  
  // when use authentecation is succeed
  export interface AuthSuccess {
    error: false;
    data: {
        currentClient: Client;
    }
}
  
// when use authentecation is faild
export interface AuthFaild {
    error: true;
    data: String;
}

  // when use authentecation is succeed
  export interface LoginSuccess {
    error: false;
    data: {
        token: String,
        currentClient: Client;
    }
}