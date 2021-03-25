import mongoose, { Model } from "mongoose";

const ClientSchema = new mongoose.Schema({
  name: String,
  password: String,
  avatar: String, // photo
  transactionsHistory: [], // transactions that client maked
  account: {
    balance: Number, // client balance
  },
  phone: String, // client phone
});
// client model
const ClientModel: Model<any> = mongoose.model("clients", ClientSchema)
// export 
export default ClientModel;
