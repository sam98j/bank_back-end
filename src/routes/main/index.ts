import express from "express";
import { basicRouteHandler, getReceiverHandler, submitTransfer } from "./handelers";
import { validateClientMiddleware } from "../../utils/VierfyClient";
const Router = express.Router()
// home route 
Router.get("/", validateClientMiddleware,basicRouteHandler)
// get the client that want to send money to him
Router.post("/transfer/get_receiver", getReceiverHandler)
// submit money transfer
Router.post("/transfer/submit_transfer", validateClientMiddleware, submitTransfer)

export default Router