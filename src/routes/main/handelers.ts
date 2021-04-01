import { Request, Response } from "express";
import ClientsModel from "../../Database/clients/model";
import {getReceiver, getClientBalance, DoTransfer} from "../../Database/clients/queries";
import { GetReceiverBody, GetReceiverRes, SubmitTransBody, SubmitTransRes } from "./interface";


// basic route hander
export async function basicRouteHandler(req: Request, res: Response){
  // all client array
  res.send({error: false, data: []})
}
// get reciver
export async function getReceiverHandler(req: Request, res: Response){
  //  get receiver phone from body
   const {receiverPhone} = req.body as GetReceiverBody;
   try {
      // get the receiver from db by his phone
      const receiver = await getReceiver(receiverPhone);
      // response object
      const resObj: GetReceiverRes = {error: false, data: {receiver}}
      // send the data to the client
      res.send(resObj)
   } catch(err){
      // send resposen
      const resObj: GetReceiverRes = {error: true, data: {receiver: null}}
   }
}
// submit transfer
export async function submitTransfer(req: Request, res: Response){
//   // transfer details comes from client
  const {receiverPhone, amount} = req.body as SubmitTransBody;
//   // get the current client balance
  const currentClientBalance = await getClientBalance(req.currentClient!);
//   // if transfer amount less than current client balance
  if(currentClientBalance! > Number(amount)) {
    try {
      const receiver = await getReceiver(receiverPhone);
      const TransferData = await DoTransfer(req.currentClient!, receiver?._id!, amount);
      // res data
      const resData: SubmitTransRes = {error: false, data: {newTransaction: TransferData[0], newBalance: TransferData[1]}}
      res.send(resData)
    } catch(err) {}
  } else {
    // the current client balance is not enoghp
    res.send({error: true, data: "Your Balance is not enogh"})
  }
}