import { Model } from "mongoose";
import { ClientCredentioal } from "../interfaces/auth.service";
import {Client, SingleTransaction, updateClientBalanceParams} from "../interfaces/clients.services";
import ClientsModel from '../models/clients'

export default class ClientsService {
  private Model: Model<any> = ClientsModel;
  // find client by credentioal
  async findClient(credentioal: ClientCredentioal): Promise<Client[]| []>{
    // return Promise
    return this.Model.find(credentioal)
  }
  // find by id
  async findClientById(_id: string): Promise<Client>{
    // retun promise
    return this.Model.findById(_id)
  }
  // get receiver by phone number
  async getReceiver(phone: string): Promise<null | Client>{
    // return new promise
    return this.Model.findOne({phone})
  }
  // get client current balance
  async getClientBalance(_id: string): Promise<number>{
    return new Promise(async(resolve, reject) => {
      try {
        const data = await this.Model.findOne({_id}, {"account.balance": 1}, {});
        // check for null
        const resoveData = Number(data.account.balance);
        resolve(resoveData)
      } catch(err) {reject(err)}
    })
  }
  // update current client balance after transfer done
  async updateClientBalance(data: updateClientBalanceParams){
    return new Promise(async(resolve, reject) => {
      // try to get the old balance of client
      try {
        const oldBalance = await this.getClientBalance(data._id)
        // new balance of current or receiver client
        const newBalance = data.operation ? oldBalance + data.amount : oldBalance - data.amount;
        // try to update the client balance
        try {
          await this.Model.updateOne({_id: data._id}, {$set: {"account.balance": newBalance}})
          // try to get the new balance
          try {
            const newBalance = await this.getClientBalance(data._id);
            resolve(newBalance)
          } catch(err) {reject("error in getting new Balance")}
        } catch(err) {reject("error in update balance")}
      } catch(err){reject("error in getting old balance")}
    })
  }
  // 
  async updateTransHis(_id: string, data: {receiverId: string, amount: number}): Promise<SingleTransaction>{
    return new Promise(async(resolve, reject) => {
      // try to get the receiver
      try {
        // get name, avatar from receiver
        const {name, avatar} = await this.findClientById(data.receiverId)
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
}