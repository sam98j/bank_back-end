import express from "express";
import { addNewClient, basicRouteHandler, getReceiver, submitTransfer } from "./handelers";
import { validateClientMiddleware } from "../../utils/VierfyClient";
const Router = express.Router()
// home route 
Router.get("/", basicRouteHandler)
// add new client
Router.post("/add_new_client", addNewClient)
// get the client that want to send money to him
Router.post("/transfer/get_receiver", getReceiver)
// submit money transfer
Router.post("/transfer/submit_transfer", validateClientMiddleware, submitTransfer)

export default Router