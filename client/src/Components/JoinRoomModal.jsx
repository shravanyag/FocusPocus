import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const JoinRoomModal = ({ onClose }) => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (!roomId) {
      toast.error("Room ID is required", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    axios
      .get(`http://localhost:3000/auth/yourRoom/${roomId}`)
      .then((res) => {
        if (res.data.status) {
          navigate(`/yourRoom/${roomId}`);
        } else {
          toast.error("Invalid Room ID", {
            position: "top-right",
            autoClose: 5000,
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching room:", err);
        toast.error("Failed to join room", {
          position: "top-right",
          autoClose: 5000,
        });
      });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Join Room</h2>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={handleJoinRoom}>Join Room</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default JoinRoomModal;
