import { Request, Response } from "express";
import ClientsCollection from "../../Database/models/ClientModel";
import DbQueries from "../../Database/DbQueries";
import JWT from "jsonwebtoken";
import { AuthFaild, AuthSuccess, ClientCredentioal, LoginSuccess } from "../../Interfaces/auth.interface";
import { Client } from "../../Interfaces/client.interface";

export async function LoginHandler(req: Request, res: Response): Promise<void> {
  // client name && password
  const Credentioal: ClientCredentioal = req.body; 
  // get client from the data base
  const data: Client | null = await new DbQueries(
    ClientsCollection
  ).findClient(Credentioal);

  // if client is exist
  if (data) {
    const {_id, account, avatar, transactionsHistory, name} = data;
    // client data that will be send
    const currentClient = { _id, name, account, transactionsHistory, avatar };
    // generate token to the client
    const token: string = JWT.sign({ _id }, "Token Secret");
    // data will send to the client
    const ResData: LoginSuccess = { error: false, data: {token, currentClient} };
    // send data to the client
    res.send(ResData);
  } else {
    // if client dosnt exitst
    const ResData: AuthFaild = {
      error: true,
      data: "Client Not Exist",
    };
    // send data to the client
    res.send(ResData);
  }
}
  
export async function InitateClientHandler(req: Request, res: Response) {
  // get id of currentclient
  const _id: string = req.currentClient!;
  // get the client assosated with that id from database
  const data: Client = await new DbQueries(ClientsCollection).findClientById(_id);
  // the data that will send to the client
  const ResData: AuthSuccess = {error: false, data: {currentClient: data}}
  // send data to the client
  res.send(ResData);
}