import { ClientCredentioal } from "../../routes/auth/inteface";
import {Client, SingleTransaction, updateClientBalanceParams} from "./interface";
import ClientsModel from "./model"

  // find client by credentioal
export async function findClient(credentioal: ClientCredentioal): Promise<Client[]| []>{
  // return Promise
  return ClientsModel.find(credentioal)
}
  // find by id
export async function findClientById(_id: string): Promise<Client>{
  // retun promise
  return ClientsModel.findById(_id)
}
// get receiver by phone number
export async function getReceiver(phone: string): Promise<null | Client>{
  // return new promise
  return ClientsModel.findOne({phone})
}
  // get client current balance
export function getClientBalance(_id: string): Promise<number>{
  return new Promise(async(resolve, reject) => {
    try {
      const data = await ClientsModel.findOne({_id}, {"account.balance": 1}, {});
      // check for null
      const resoveData = Number(data.account.balance);
      resolve(resoveData)
    } catch(err) {reject(err)}
  })
}
// update current client balance after transfer done
export function updateClientBalance(data: updateClientBalanceParams){
  return new Promise(async(resolve, reject) => {
    // try to get the old balance of client
    try {
      const oldBalance = await getClientBalance(data._id)
      // new balance of current or receiver client
      const newBalance = data.operation ? oldBalance + data.amount : oldBalance - data.amount;
      // try to update the client balance
      try {
        await ClientsModel.updateOne({_id: data._id}, {$set: {"account.balance": newBalance}})
        // try to get the new balance
        try {
          const newBalance = await getClientBalance(data._id);
          resolve(newBalance)
        } catch(err) {reject("error in getting new Balance")}
      } catch(err) {reject("error in update balance")}
    } catch(err){reject("error in getting old balance")}
  })
}
// 
export function updateTransHis(_id: string, data: {receiverId: string, amount: number}): Promise<SingleTransaction>{
  return new Promise(async(resolve, reject) => {
    // try to get the receiver
    try {
      // get name, avatar from receiver
      const {name, avatar} = await findClientById(data.receiverId)
      // Single Tranasaction
      const Transaction: SingleTransaction = {amount: data.amount, date: "2020", receiver: {name, avatar}};
      try {
        // @ts-ignore
        await ClientsModel.updateOne({_id}, {$push: {transactionsHistory: Transaction}})
        // resolve Transaction
        resolve(Transaction)
      } catch(err) {reject("an error durring update transactionHistory")}
    } catch(err) {reject("error durring get receiver")}
  })
}
// submit transfer
export function DoTransfer(_id: string, receiverId: string, amount: number): Promise<any[]>{
  return new Promise(async(resolve, reject) => {
    // take the money from current client
    try {
      // takeing Money
      await updateClientBalance({_id, operation: false, amount})
      // try to add moeny to receiver client
      try {
        await updateClientBalance({_id: receiverId, amount, operation: true})
        const data = await Promise.all([updateTransHis(_id, {amount, receiverId}), getClientBalance(_id)])
        resolve(data)
      } catch(err) {reject("error in adding money to receiver client")}
    } catch(err) {reject("an error in takeing")}
  })
}