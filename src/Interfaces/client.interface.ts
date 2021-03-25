export interface ClientAccount {
  balance: string;
}
  
export interface Client {
  _id?: String; // id of client
  name: String; // name of client
  password?: String; // password of client
  account: ClientAccount; // client account object
  transactionsHistory: []; // history of transactions
  avatar: string; // client image
  phone?: any
}
// single transaction is history
export interface SingleTransaction {
  receiver: {name: String, avatar: string}; // how receive the amount 
  amount: number; // amount of transfer
  status: boolean; // is transfer is done or not
  date: string; // date of transaction 
}