import JWT from "jsonwebtoken";
import { AuthFaild, IntSuccess, ClientCredentioal, LoginSuccess } from '../interfaces/auth.service';
import ClientsService from "./clients"

export default class AuthServices {
  private clientsServices: ClientsService = new ClientsService();
  // login service 
  async login(credeantioal: ClientCredentioal) {
      // get client from the data base
      const data = await this.clientsServices.findClient(credeantioal);
      // if client is exist
      if (data) {
        const {_id, account, avatar, transactionsHistory, name} = data[0] ;
        // client data that will be send
        const currentClient = { _id, name, account, transactionsHistory, avatar };
        // generate token to the client
        const token: string = JWT.sign({ _id }, "Token Secret");
        // data will send to the client
        const ResData: LoginSuccess = { error: false, data: {token, currentClient} };
        // send data to the client
        return ResData
      } else {
        // if client dosnt exitst
        const ResData: AuthFaild = {
          error: true,
          data: "Client Not Exist",
        };
        // send data to the client
        return ResData
      }
  }
  // initate client service
  async initateClient(_id: string){
      // get the client assosated with that id from database
      const data = await this.clientsServices.findClientById(_id);
      // the data that will send to the client
      const ResData: IntSuccess = {error: false, data: {currentClient: data!}}
      // send data to the client
      return ResData
  }
}