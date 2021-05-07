export interface ClientAccount {
    balance: string;
}
      
export interface Client {
  _id?: string; // id of client
  name: string; // name of client
  password?: string; // password of client
  account: ClientAccount; // client account object
  transactionsHistory: []; // history of transactions
  avatar: string; // client image
  phone?: any
}
// single transaction is history
export interface SingleTransaction {
  receiver: {name: String, avatar: string}; // how receive the amount 
  amount: number; // amount of transfer
  date: string; // date of transaction 
}
// update client balance paramters
export interface updateClientBalanceParams {
  amount: number, 
  _id: string, 
  operation: boolean
}