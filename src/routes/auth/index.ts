import express, {Request, Response} from "express";
const Router = express.Router();
import { InitateClientHandler, LoginHandler } from "./handelers";
import { validateClientMiddleware } from "../../utils/VierfyClient";
import AuthController from "./controller";
// handle login route
Router.post("/login", async (req: Request, res: Response) => {
    // new instance from auth controller
    const controller = new AuthController();
    // reciver response from route handler
    const response = await controller.LoginHandler(req.body);
    // send response to client
    res.send(response)
});
// route to check if user is already login
Router.get("/initate_client",validateClientMiddleware , async (req: Request, res: Response) => {
    // new instance from auth controller
    const controller = new AuthController();
    // reciver response from route handler
    const response = await controller.IntClientHandler(req);
    // send response to client
    res.send(response)
});
// export Router as default
export default Router;
