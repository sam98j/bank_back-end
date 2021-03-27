import { Request, Response } from "express";
import { Client } from "../../Database/clients/interface";
import ClientsModel from "../../Database/clients/model";
import {getReceiver, getClientBalance, updateTransHis, updateClientBalance} from "../../Database/clients/queries";
import { AllClientsRes, GetReceiverBody, GetReceiverRes, SubmitTransBody } from "./interfac";


// basic route hander
export async function basicRouteHandler(req: Request, res: Response){
  // all client array
  ClientsModel.find({}, (err, data: [Client] | []) => {
    if(err) throw err;
    const resObj: AllClientsRes = {error: false, data}
    // send all the users to the client
    res.send(resObj)
  });
  // send the data to the client
}
// get reciver
export async function getReceiverHandler(req: Request, res: Response){
   // get receiver phone from body
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
  // transfer details comes from client
  const {receiverPhone, amount} = req.body as SubmitTransBody;
  // get the current client balance
  const currentClientBalance = await getClientBalance({_id: req.currentClient});
  // if transfer amount less than current client balance
  if(currentClientBalance! > Number(amount)) {
    // add transfer amount to receiver balance config
    const updateReceiver = {amount, selector: {phone: receiverPhone}, operation: true};
    // shrink transfer amount from currentClient balance config
    const updateCurrentClient = {amount, selector: {_id: req.currentClient}, operation: false};
    // get the receiver 
    try {
      // Response
      await updateClientBalance(updateReceiver);
      // update current client
      try {
        // update currentClient balance
        await updateClientBalance(updateCurrentClient);
        // try to update trhi
        try {
          // update trhi
          const NewTransaction = await updateTransHis(req.currentClient, {receiverPhone, amount});
          // try get new balance
          try {
            // new_Current_Client Balance
            const newBalance = await getClientBalance({_id: req.currentClient});
            // send the response
            res.send({error: false, data: {newBalance, NewTransaction}})
          } catch(err) {}
        } catch(err){}
      } catch(err) {}
    } catch(error){
      // log the error
      console.log(error)
      res.send({error: true, data: "Transactions dosnot complete"})
    }
  } else {
    // the current client balance is not enoghp
    res.send({error: true, data: "Your Balance is not enogh"})
  }
}