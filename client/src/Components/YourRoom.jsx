import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const YourRoom = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/auth/yourRoom/${id}`);
        if (response.data.status) {
          setRoom(response.data.room);
        } else {
          toast.error("Room not found", {
            position: "top-right",
            autoClose: 5000,
          });
        }
      } catch (error) {
        console.error("Error fetching room details:", error);
        toast.error("Failed to fetch room details", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    };

    fetchRoomData();
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

export default YourRoom;
