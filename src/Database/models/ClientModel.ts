import mongoose from "mongoose";
import {SingleTransaction} from "../../Interfaces/client.interface"

const ClientSchema = new mongoose.Schema({
  name: String,
  password: String,
  avatar: String,
  transactionsHistory: [],
  account: {
    balance: Number,
  },
});

export default mongoose.model("clients", ClientSchema);
