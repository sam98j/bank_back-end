import { Request } from "express"
import {Route, Get, Post} from "tsoa"

@Route("/")
export default class MainController {
    @Post("/")
    public async mainRoute(): Promise<{age: number}>{
        // console.log(req.body)
        return {
            age: 90
        }
    }
}