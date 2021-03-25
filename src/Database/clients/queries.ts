import { ClientCredentioal } from "../../Interfaces/auth.interface";
import {Client, SingleTransaction} from "../../Interfaces/client.interface";
import ClientsModel from "./model"

  // find client by credentioal
export async function findClient(
  Credentioal: ClientCredentioal
): Promise<Client | null> {
  return new Promise(
    (resolve, reject) => {
      ClientsModel.findOne(
        Credentioal,
        (err: any, client: Client | null): void => {
          if (err) console.log(err);
          resolve(client);
        }
      );
    }
  );
}
  // find by id
export async function findClientById(_id: string): Promise<Client>{
  // retun promise
  return new Promise((resolve, reject) => {
    // get the client by id
    ClientsModel.findById(_id, (err: any, data: Client) => {
      // if an error
      if(err) console.log("error in get client by id")
      // resolve the data
      resolve(data)
    })
  })
}
  // add new client
export async function addClient(data: ClientCredentioal){
  return new Promise((resolve, reject) => {
    const clientData: Client = {...data, account: {balance: "0"}, transactionsHistory: [], avatar: ""}
    ClientsModel.insertMany([clientData], {}, (err, clientData) => {
      if(err) console.log(err)
      resolve(clientData)
    })
  })
}
  // get all client
export async function getAllClient(){
  return new Promise((resolve, reject) => {
    ClientsModel.find({}, (err, data) => {
      if(err) throw err;
      resolve(data)
    })
  })
}
  // get receiver by phone number
export async function getReceiver(receiverPhone: string): Promise<Client>{
  return new Promise((resolve, reject) => {
    ClientsModel.findOne({phone: receiverPhone}, (err: any, data: Client) => {
      if(err) console.log(err);
      resolve(data)
    })
  })
}
  // get client current balance
export async function getClientBalance(selector: {phone?: string, _id?: string}): Promise<number>{
  // return promise 
  return new Promise((resolve, reject) => {
    // connect to databasse
    ClientsModel.findOne(selector, {"account.balance": 1}, {},(err: any, data: {account: {balance: string}}) => {
      // promise rejectoin
      if(err) reject(err);
      // promise fuffil
      resolve(Number(data.account.balance))
    })
  })
}
  // update current client balance after transfer done
export async function updateClientBalance(data: {amount: string, selector: {phone?: string, _id?: string}, operation: boolean}){
  // the client balance "currentclient or ReceiverClient"
  const clientBalance = await getClientBalance(data.selector);
  // the new balance for currentClient or ReceiverClient 
  const updatedBalance = data.operation ? clientBalance + Number(data.amount) : clientBalance - Number(data.amount);
  // return Promise
  return new Promise((resolve, reject) => {
    // update the datebase 
    ClientsModel.updateOne(data.selector, {$set: {"account": {"balance": String(updatedBalance)}}}, {}, (err, res) => {
      // promise rejection
      if(err) reject(err);
      // promise fulffil
      resolve({error: false, data: "transfer is done"})
    })
  })
}
  // 
export async function updateTransHis(_id: any, data: {receiverPhone: string, amount: any}){
  // get the name and avatar of receiver client
  const {name, avatar} = await getReceiver(data.receiverPhone);
  // number
  // Single Tranasaction
  const Transaction: SingleTransaction = {amount: data.amount, date: "2020", status: true, receiver: {name, avatar}}
  return new Promise((resolve, reject) => {
    // @ts-ignore
    ClientsModel.updateOne({_id}, {$push: {transactionsHistory: Transaction}}, (err, data) => {
      if(err) reject(err);
      // resolve success reps
      resolve(Transaction)
      console.log("updated")
    })
  })
} 
