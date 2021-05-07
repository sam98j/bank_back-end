import { Request, Response } from "express";
import { ClientCredentioal } from "../interfaces/auth.service";
import AuthServices from '../services/auth';
const authServices = new AuthServices()

export default class AuthController {
    // login route handler
    loginHandler(req: Request, res: Response){
        // client credenatioal form req body
        const credenaioals: ClientCredentioal = req.body;
        authServices.login(credenaioals)
        .then((data) => {
            res.status(201).send(data)
        }).catch((err) => {
            res.status(500).send(err)
        })
    }
    // initate client handler
    async InitateClientHandler(req: Request, res: Response) {
        // get client id
        const clientId = req.currentClient;
        // send data to client
        authServices.initateClient(clientId!)
        .then(data => {
            res.status(200).send(data)
        }).catch(err => {
            res.status(500).send(err)
        }) 
    }
}