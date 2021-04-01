import { AddClientBody, PingRes, reqQueries } from "./interface";
import {Route, Get, Post, Request, Body, Query} from "tsoa"
import express, {query} from "express";

@Route("/test")
export default class TestController {
    // ping route handler
    @Get("/ping")
    public async pingHandler(): Promise<PingRes>{
        return {
            message: "Hello"
        }
    }
    // add clients toute handler
    @Post("/add_client")
    public async addClientHandler(
    @Body() reqBody: AddClientBody,
    ): Promise<AddClientBody>{
        const body: AddClientBody = reqBody;
        return body
    }
}