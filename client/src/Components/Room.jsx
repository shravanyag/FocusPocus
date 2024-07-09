// Components/Room.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const Room = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/auth/room/${id}`)
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
        toast.error("Error fetching room details", {
          position: "top-right",
          autoClose: 5000,
        });
      });
  }, [id]);

  if (!room) return <div>Loading...</div>;

  return (
    <div>
      <h1>{room.name}</h1>
      <p>Created by: {room.createdBy.username}</p>
      <p>Created at: {new Date(room.createdAt).toLocaleString()}</p>
      {/* Add more room details here */}
    </div>
  );
};

export default Room;
