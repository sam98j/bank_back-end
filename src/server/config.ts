import Express, { Application } from "express";
import mongoose from "mongoose";
import AuthRoutes from "../routes/auth/index";
import MainRoutes from "../routes/main/index";
import cors from "cors";
import {ServerConfigs} from "../Interfaces/server.interface"
// config server routes
export class Configs implements ServerConfigs{
    // express app object
    private app: Application;
    // constructor function
    constructor(app: Application){
        // set the app property
        this.app = app
    }
    // config database
    private configDatabase(){
        // remote database
        const uri = `mongodb+srv://hosam98j:hosam98j@cluster0.vvtul.mongodb.net/Bank?retryWrites=true&w=majority`;
        // create connection
        mongoose.connect(uri, {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
        });
        const DataBase = mongoose.connection;
        DataBase.once("open", () => console.log("database connected"));
    }
    // config the routes
    private configRoutes(){
        // auth routes
        this.app.use("/auth", AuthRoutes);
        // main routes
        this.app.use("/", MainRoutes)
    }
    // config middleware 
    private configMiddleWare(){
        // server response to the other servers
        this.app.use(cors())
        // response json data
        this.app.use(Express.json())
    }
    // run all the configs
    configure(){
        // database config
        this.configDatabase()
        // routes config
        this.configRoutes()
        // middleware config
        this.configMiddleWare()
    }
}