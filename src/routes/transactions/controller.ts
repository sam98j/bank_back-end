import {Body, Route, Post, Request} from "tsoa"
import { GetReceiverBody, GetReceiverRes, SubmitTransBody, SubmitTransRes } from "./interface";
import {getReceiver, getClientBalance, DoTransfer} from "../../Database/clients/queries";
import express from "express"

@Route("/transfer")
export default class TransferController {
    // get receiver route handler
    @Post("/get_receiver")
    public async getReceiverHandler(@Body() reqBody: GetReceiverBody): Promise<GetReceiverRes> {
        //  get receiver phone from body
        const {receiverPhone} = reqBody;
        try {
           // get the receiver from db by his phone
           const receiver = await getReceiver(receiverPhone);
           // response object
           const resObj: GetReceiverRes = {error: false, data: {receiver}}
           // send the data to the client
           return resObj
        } catch(err){
           // send resposen
           const resObj: GetReceiverRes = {error: true, data: {receiver: null}};
           return resObj
        }
    }
    // submit transfer route handler
    @Post("/submit_transfer")
    public async submitTransfer(@Request() req: express.Request, @Body() reqBody: SubmitTransBody): Promise<SubmitTransRes>{
        // transfer details comes from client
        const {receiverPhone, amount} = reqBody;
        // get the current client balance
        const currentClientBalance = await getClientBalance(req.currentClient!);
        // if transfer amount less than current client balance
        if(currentClientBalance! > Number(amount)) {
            try {
              const receiver = await getReceiver(receiverPhone);
              const TransferData = await DoTransfer(req.currentClient!, receiver?._id!, amount);
              // res data
              const resData: SubmitTransRes = {error: false, data: {newTransaction: TransferData[0], newBalance: TransferData[1]}}
              return resData
            } catch(err) {
                const resObj: SubmitTransRes = {error: true, data: {newBalance: null, newTransaction: null}};
                return resObj
            }
        } else {
            // the current client balance is not enoghp
            const resObj: SubmitTransRes = {error: true, data: {newBalance: null, newTransaction: null}}
            return resObj
        }
    }
}