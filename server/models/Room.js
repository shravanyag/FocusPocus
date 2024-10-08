import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Unique constraint on name
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const RoomModel = mongoose.model("Room", RoomSchema);

export { RoomModel as Room };