import express, {Request, Response} from "express";
import { validateClientMiddleware } from "../../utils/VierfyClient";
import Controller from "./controller"
const Router = express.Router()

// get the client that want to send money to him
Router.post("/get_receiver", async (req: Request, res: Response) => {
    // instance of controller
    const controller = new Controller();
    // get reponse from handelr
    const response = await controller.getReceiverHandler(req.body)
    res.send(response)
})
// submit money transfer
Router.post("/submit_transfer", validateClientMiddleware, async (req: Request, res: Response) => {
    // instance of controller
    const controller = new Controller();
    // get reponse from handelr
    const response = await controller.submitTransfer(req, req.body);
    res.send(response)
})

export default Router