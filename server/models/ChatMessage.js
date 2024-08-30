import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
    room_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true},
    user: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const ChatMessageModel = mongoose.model('ChatMessage', chatMessageSchema);

export { ChatMessageModel as ChatMessage };