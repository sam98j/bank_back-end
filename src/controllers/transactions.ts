import { Request, Response } from "express";
import { GetReceiverBody, GetReceiverRes, SubmitTransBody, SubmitTransRes } from "../interfaces/trans";
import ClientsServices from '../services/clients';
const clientsServices = new ClientsServices();
import TransServices from '../services/transactions';
const transactionsService = new TransServices()

export default class TransController {
    // get reciver handler
    async getReceiverHandler(req: Request, res: Response){
        // 
        const {receiverPhone} = req.body as GetReceiverBody;
        clientsServices.getReceiver(receiverPhone)
        .then(data => {
            const resObj: GetReceiverRes = {error: false, data: {receiver: data}};
            res.status(200).send(resObj)
        }).catch(err => {
            const resObj: GetReceiverRes = {error: true, data: {receiver: null}}
            res.status(500).send(resObj)
        })
    }
    // submit transfer
    async submitTransfer(req: Request, res: Response){
        // 
        const {amount, receiverPhone} = req.body as SubmitTransBody;
        // 
        transactionsService.submitTransfer(req.currentClient!, receiverPhone, amount)
        .then(data => {
            res.status(200).send(data)
        }).catch(err => {
            res.status(500).send(err)
        })
    }
}