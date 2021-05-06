import { AuthFaild, LoginRes, ClientCredentioal, IntRes } from "./inteface";
import {Body, Route, Get, Post, Request} from "tsoa";
import {findClient, findClientById} from "../../Database/clients/queries";
import JWT from "jsonwebtoken";
import express from "express"

@Route("/auth")
export default class AuthController {
    // login route handler
    @Post("/login")
    public async LoginHandler(@Body() reqBody: ClientCredentioal): Promise<LoginRes> {
        // client name && password
        const Credentioal = reqBody; 
        // get client from the data base
        const data = await findClient(Credentioal);
        // if client is exist
        if (data) {
          const {_id, account, avatar, transactionsHistory, name} = data[0] ;
          // client data that will be send
          const currentClient = { _id, name, account, transactionsHistory, avatar };
          // generate token to the client
          const token: string = JWT.sign({ _id }, "Token Secret");
          // data will send to the client
          const ResData: LoginRes = { error: false, data: {token, currentClient} };
          // send data to the client
          return ResData
        } else {
          const res: LoginRes = {error: false, data: {token: null, currentClient: null}}
          return res
        }   
    }
    // initate client route handler
    @Get("/initate_client")
    public async IntClientHandler(@Request() req: express.Request): Promise<IntRes>{
      // get id of currentclient
      const _id: string = req.currentClient!;
      // get the client assosated with that id from database
      const data = await findClientById(_id);
      // the data that will send to the client
      const ResData: IntRes = {error: false, data: {currentClient: data!}}
      // send data to the client
      return ResData
    }
}