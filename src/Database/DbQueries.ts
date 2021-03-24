import { Model } from "mongoose";
import { ClientCredentioal } from "../Interfaces/auth.interface";
import {Client, SingleTransaction} from "../Interfaces/client.interface"

export default class Queries {
  collection: Model<any>;
  constructor(collection: Model<any>) {
    this.collection = collection;
  }
  // find client by credentioal
  findClient(
    Credentioal: ClientCredentioal
  ): Promise<Client | null> {
    return new Promise(
      (resolve, reject) => {
        this.collection.findOne(
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
  findClientById(_id: string): Promise<Client>{
    // retun promise
    return new Promise((resolve, reject) => {
      // get the client by id
      this.collection.findById(_id, (err: any, data: Client) => {
        // if an error
        if(err) console.log("error in get client by id")
        // resolve the data
        resolve(data)
      })
    })
  }
  // add new client
  addClient(data: ClientCredentioal){
    return new Promise((resolve, reject) => {
      const clientData: Client = {...data, account: {balance: "0"}, transactionsHistory: [], avatar: ""}
      this.collection.insertMany([clientData], {}, (err, clientData) => {
        if(err) console.log(err)
        resolve(clientData)
      })
    })
  }
  // get all client
  getAllClient(){
    return new Promise((resolve, reject) => {
      this.collection.find({}, (err, data) => {
        if(err) throw err;
        resolve(data)
      })
    })
  }
  // get receiver by phone number
  getReceiver(receiverPhone: string): Promise<Client>{
    return new Promise((resolve, reject) => {
      this.collection.findOne({phone: receiverPhone}, (err: any, data: Client) => {
        if(err) console.log(err);
        resolve(data)
      })
    })
  }
  // get client current balance
  async getClientBalance(selector: {phone?: string, _id?: string}): Promise<number>{
    // return promise 
    return new Promise((resolve, reject) => {
      // connect to databasse
      this.collection.findOne(selector, {"account.balance": 1}, {},(err: any, data: {account: {balance: string}}) => {
        // promise rejectoin
        if(err) reject(err);
        // promise fuffil
        resolve(Number(data.account.balance))
      })
    })
  }
  // update current client balance after transfer done
  async updateClientBalance(data: {amount: string, selector: {phone?: string, _id?: string}, operation: boolean}){
    // the client balance "currentclient or ReceiverClient"
    const clientBalance = await this.getClientBalance(data.selector);
    // the new balance for currentClient or ReceiverClient 
    const updatedBalance = data.operation ? clientBalance + Number(data.amount) : clientBalance - Number(data.amount);
    // return Promise
    return new Promise((resolve, reject) => {
      // update the datebase 
      this.collection.updateOne(data.selector, {$set: {"account": {"balance": String(updatedBalance)}}}, {}, (err, res) => {
        // promise rejection
        if(err) reject(err);
        // promise fulffil
        resolve({error: false, data: "transfer is done"})
      })
    })
  }
  // 
  async updateClientTransactionsHistory(_id: string, data: {receiverPhone: any, amount: any}){
    // get the name and avatar of receiver client
    const {name, avatar} = await this.getReceiver(data.receiverPhone);
    // Single Tranasaction
    const Transaction: SingleTransaction = {amount: data.amount, date: "2020", status: true, receiver: {name, avatar}}
    return new Promise((resolve, reject) => {
      // @ts-ignore
      this.collection.updateOne({_id}, {$push: {"transactionsHistory": Transaction}}, (err, data) => {
        if(err) reject("errrooo");
        resolve(Transaction)
      })
    })
  }
}
