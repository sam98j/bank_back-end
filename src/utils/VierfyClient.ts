import JWT from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { AuthFaild } from "../interfaces/auth.service";

export function validateToken(req: Request): Promise<any> {
  // get the authorization Property from headers of request
  const authorization = req.headers.authorization;
  // extract token from authorization property
  const Token: string | undefined = authorization ? authorization.split(" ")[1] : authorization;
  // return promise 
  return new Promise((resolve, reject) => {
    // check if token is string
    if(typeof Token === "string") {
      JWT.verify(Token, "Token Secret", (err, data) => {
        // if an error accour during validate token "token not valid"
        if(err) {
          // token not valid response
          const TokenNotValid: AuthFaild = { error: true, data: "Token Not Valid" };
          // promise rejection
          reject(TokenNotValid)
        }
        // No error and resolve promise
        resolve(data)
      })
    } else if(typeof Token !== "string") {
      // token not valid response
      const TokenNotValid: AuthFaild = {error: true, data: "Token Not valid"}
      // promise rejection
      reject(TokenNotValid)
    } else if(typeof Token === "undefined") {
      // token not found response 
      const TokenNotExist: AuthFaild = {error: true, data: "Token Not Exist"};
      // promise rejection
      reject(TokenNotExist)
    } 
  })
}

export async function validateClientMiddleware(req: Request, res: Response, next: NextFunction){
  try {
    // get id from validated token contains _id and iat
    const {_id} = await validateToken(req) as {_id: string, iat: number};
    // set currentclient property in req object
    req.currentClient = _id;
    // route request to main endpoint to proccess it
    next()
  } catch(error){
    // bad request and response with error
    res.send(error)
  }
}