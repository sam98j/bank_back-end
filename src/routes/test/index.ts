import express, { Request, Response } from "express";
import TestController from "./controllers";
// router
const router = express.Router();
// ping route
router.get("/ping", async (req: Request, res: Response) => {
  const controller = new TestController();
  const response = await controller.pingHandler();
  console.log(req.params)
  return res.send(response);
});
// add client route
router.post("/add_client/", async(req: Request, res: Response) => {
  // new instant of controller
  const controller = new TestController();
  // make response obj
  const response = await controller.addClientHandler(req.body);
  console.log(req.params)
  res.send(response)
})
export default router;