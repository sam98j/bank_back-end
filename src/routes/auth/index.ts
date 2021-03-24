import express from "express";
const Router = express.Router();
import { InitateClientHandler, LoginHandler } from "./handelers";
import { validateClientMiddleware } from "../../utils/VierfyClient";
// handle login route
Router.post("/login", LoginHandler);
// route to check if user is already login
Router.get("/initate_client",validateClientMiddleware , InitateClientHandler);
// export Router as default
export default Router;
