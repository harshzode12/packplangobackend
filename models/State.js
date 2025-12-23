import mongoose from "mongoose";

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String } // optional
});

const State = mongoose.model("State", stateSchema);

export default State;
