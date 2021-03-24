import Express, {Application} from "express"
import { ServerConfigs } from "../Interfaces/server.interface";
import { Configs } from "./config";
// Server class
class Server {
    // Express app object
    private app: Application = Express();
    // the express app port
    private port: number | string = 1000;
    // server configurations
    private configs: ServerConfigs = new Configs(this.app);
    // constructor function
    constructor(port: number) {
        // reset the app port
        this.port =  process.env.PORT || port;
    }
  
    run() {
        // run the server configruations
        this.configs.configure()
        // run the server
        this.app.listen(this.port, () => console.log(`server running on port ${this.port}`));
    }
}

export default Server