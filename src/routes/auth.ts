import express from "express";
const Router = express.Router();
import AuthController from "../controllers/auth";
import { validateClientMiddleware } from "../utils/VierfyClient";
const AuthHandlers = new AuthController();
// handle login route
Router.post("/login", AuthHandlers.loginHandler);
// route to check if user is already login
Router.get("/initate_client",validateClientMiddleware , AuthHandlers.InitateClientHandler);
// export Router as default
export default Router;
