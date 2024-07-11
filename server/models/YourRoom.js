import mongoose from "mongoose";

const YourRoomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Unique constraint on name
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const YourRoomModel = mongoose.model("Room", YourRoomSchema);

export { YourRoomModel as Room };