import { Request, Response } from "express";
import ClientsModel from "../../Database/clients/model";
import {addClient, getReceiver, getClientBalance, updateTransHis, updateClientBalance} from "../../Database/clients/queries";


// basic route hander
export async function basicRouteHandler(req: Request, res: Response){
  // all client array
  ClientsModel.find({}, (err, data) => {
    if(err) throw err;
    // send all the users to the client
    res.send(data)
  });
  // send the data to the client
}

// add new client handler
export async function addNewClient(req: Request, res: Response){
  const newClient = await addClient(req.body);
  console.log(newClient)
  res.send({msg: "client adding done"})
}
// get reciver
export async function getReceiverHandler(req: Request, res: Response){
   // get receiver phone from body
   const {receiverPhone} = req.body as {receiverPhone: string};
   // get the receiver from db by his phone
   const receiver = await getReceiver(receiverPhone);
   // response object
   const ResData = {error: false, data: {receiver}}
   // send the data to the client
   res.send(ResData)
}
    // submit transfer
export async function submitTransfer(req: Request, res: Response){
  // transfer details comes from client
  const data = req.body as {receiverPhone: string, amount: string};
  // get the current client balance
  const currentClientBalance = await getClientBalance({_id: req.currentClient});
  // if transfer amount less than current client balance
  if(currentClientBalance > Number(data.amount)) {
    // get the receiver 
    try {
      // add transfer amount to receiver balance config
      const updateReceiver = {amount: data.amount, selector: {phone: data.receiverPhone}, operation: true};
      // shrink transfer amount from currentClient balance config
      const updateCurrentClient = {amount: data.amount, selector: {_id: req.currentClient}, operation: false};
      // Response
      await updateClientBalance(updateReceiver);
      // update currentClient balance
      await updateClientBalance(updateCurrentClient);
      // update trhi
      const NewTransaction = await updateTransHis(req.currentClient, {receiverPhone: data.receiverPhone, amount: data.amount});
      // new_Current_Client Balance
      const newBalance = await getClientBalance({_id: req.currentClient});
      // send the response
      res.send({error: false, data: {newBalance, NewTransaction}})
    } catch(error){
      // log the error
      console.log(error)
    }
  } else {
    // the current client balance is not enoghp
    res.send({error: true, data: "Your Balance is not enogh"})
  }
}