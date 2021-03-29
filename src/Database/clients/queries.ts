import { ClientCredentioal } from "../../routes/auth/inteface";
import {Client, SingleTransaction, updateClientBalanceParams} from "./interface";
import ClientsModel from "./model"

  // find client by credentioal
export function findClient(credentioal: ClientCredentioal){
  // return Promise
  return ClientsModel.find(credentioal)
}
  // find by id
export function findClientById(_id: string){
  // retun promise
  return ClientsModel.findById(_id)
}
// get receiver by phone number
export async function getReceiver(phone: string){
  // return new promise
  return ClientsModel.findOne({phone})
}
  // get client current balance
export async function getClientBalance(selector: {phone?: string, _id?: string}): Promise<number | null>{
  // return promise 
  return new Promise((resolve, reject) => {
    // connect to databasse
    ClientsModel.findOne(selector, {"account.balance": 1}, {},(err: any, data: {account: {balance: string}} | null) => {
      // promise rejectoin
      if(err) reject(err);
      // check for null
      const resoveData = data ? Number(data.account.balance) : null;
      // promise fuffil
      resolve(resoveData)
    })
  })
}
// update current client balance after transfer done
export function updateClientBalance(data: updateClientBalanceParams): Promise<number| null>{
  // return new Promise
  return new Promise(async(resolve, reject) => {
    // get the balance of current or receiver client 
    await getClientBalance(data.selector)
    .then(oldBalance => {
      // check if balance is not null
      if(oldBalance) {
        // new balance of current or receiver client
        const newBalance = data.operation ? oldBalance + data.amount : oldBalance - data.amount;
        // update the database
        ClientsModel.updateOne(data.selector, {$set: {"account.balance": newBalance}}, {}, async(err, res) => {
          // if an error durring update the db
          if(err) reject(err);
          // get newBalance of current client or receiver client
          await getClientBalance(data.selector)
          .then(newBalance => {
            // resolve newBalance
            resolve(newBalance)
          })
          .catch(err => reject(err)) // if an error durring get newBalance of current or receiver client
        })
      } else reject("client dosenot exitst")
    })
    .catch(err => reject(err)) // an error during getting balance of current or recevier client
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
// submit transfer
function submitTransfer(_id: string, receiverphone: string, amount: number){
  return new Promise(async(resolve, reject) => {
    // take the money from current client
    await updateClientBalance({amount, selector: {_id}, operation: false}) // take the money from current client
    .then(async newBalance => {
      if(newBalance) {
        await updateClientBalance({amount, selector: {phone: receiverphone}, operation: true}) // update balance of receiver
        .then(newBalance => {
          if(newBalance) {
            
          } else reject("cannot find receiver client")
        })
        .catch(() => reject("cannot update receiver client balance"))
      } else reject("cannot find the current client")
    })
    .catch(() => reject("cannot take the money form current client")) // an error durring take money from current client
  })
}