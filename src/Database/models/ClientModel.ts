import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
  name: String,
  password: String,
  avatar: String,
  transactionsHistroy: [],
  account: {
    balance: Number,
  },
});

export default mongoose.model("clients", ClientSchema);
