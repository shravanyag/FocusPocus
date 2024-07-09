import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [user, setUser] = useState({ username: "", email: "", rooms: [] });
  const [roomName, setRoomName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const handleLogout = () => {
    axios
      .get("http://localhost:3000/auth/logout")
      .then((res) => {
        if (res.data.status) {
          toast.success("Logout successful", {
            position: "top-right",
            autoClose: 5000,
          });
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const createRoom = () => {
    console.log(user);
    if (!roomName) {
      toast.error("Room name is required", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }
    axios
      .post("http://localhost:3000/auth/create-room", {
        name: roomName,
        user: user._id,
      })
      .then((res) => {
        if (res.data.status) {
          setUser((prevUser) => ({
            ...prevUser,
            rooms: [...prevUser.rooms, res.data.room],
          }));
          setRoomName("");
          setShowModal(false);
          toast.success("Room created successfully!");
          console.log(res.data.status);
        } else {
          toast.error("Failed to create room.");
          console.log("sowwwyyyy");
        }
      });
  };

  useEffect(() => {
    axios.get("http://localhost:3000/auth/verify").then((res) => {
      if (res.data.status) {
        setUser(res.data.user);
        console.log(res.data.user);
      } else {
        toast.error("Unauthorized access", {
          position: "top-right",
          autoClose: 15000,
        });
        navigate("/login");
      }
    });
  }, [navigate]);
  return (
    <div>
      Dashboard
      <button onClick={handleLogout}>Logout</button>
      <div>
        <p>Hi {user.username}</p>
        <p>Email: {user.email}</p>
        <div>
          <h2>Rooms</h2>
          <ul>
            {user.rooms.map((room) => (
              <li key={room._id}>
                <p>Room Name: {room.name}</p>
                <p>Created By: {room.createdBy}</p>
                <p>Created At: {new Date(room.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button onClick={() => setShowModal(true)}>Create Room</button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create Room</h2>
            <input
              type="text"
              placeholder="Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <button onClick={createRoom}>Create Room</button>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
