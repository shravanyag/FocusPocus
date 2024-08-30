import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ChatRoom from "./ChatRoom";

const YourRoom = () => {
  const { token } = useParams();
  const [room, setRoom] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/auth/yourRoom/${token}`)
      .then((res) => {
        if (res.data.status) {
          setRoom(res.data.room);
        } else {
          toast.error("Room not found", {
            position: "top-right",
            autoClose: 5000,
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching room:", err);
        toast.error("Failed to fetch room details", {
          position: "top-right",
          autoClose: 5000,
        });
      });
  }, [token]);

  if (!room) return <p>Loading room details...</p>;

  return (
    <div>
      <h1>{room.name}</h1>
      <p>Created by: {room.createdBy.username}</p>
      <p>Created at: {new Date(room.createdAt).toLocaleString()}</p>
      <ChatRoom />
    </div>
  );
};

export default YourRoom;
