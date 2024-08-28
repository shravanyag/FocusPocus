import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
//import JoinRoomModal from "./JoinRoomModal";

const Dashboard = () => {
  const [user, setUser] = useState({ username: "", email: "", rooms: [] });
  const [roomName, setRoomName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showJoinRoomModal, setShowJoinRoomModal] = useState(false);
  const [joinRoomName, setJoinRoomName] = useState("");
  const [joinRoomPassword, setJoinRoomPassword] = useState("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  // Logout function
  const handleLogout = () => {
    axios
      .get("http://localhost:3000/auth/logout")
      .then((res) => {
        if (res.data.status) {
          toast.success("Logout successful", {
            position: "top-right",
            autoClose: 5000,
          });
          setUser({ username: "", email: "", rooms: [] }); // Clear user state
          navigate("/login");
        } else {
          toast.error("Failed to logout");
        }
      })
      .catch((err) => {
        console.error("Error logging out:", err);
        toast.error("Failed to logout");
      });
  };

  // Create room function
  const createRoom = () => {
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
        } else {
          if (res.data.message === "Room name already exists") {
            toast.error(
              "Room name already exists. Please use a different name.",
              {
                position: "top-right",
                autoClose: 5000,
              }
            );
          } else {
            toast.error("Failed to create room. Please try again later.", {
              position: "top-right",
              autoClose: 5000,
            });
          }
        }
      })
      .catch((err) => {
        console.error("Error creating room:", err);
        toast.error("Failed to create room. Please try again later.", {
          position: "top-right",
          autoClose: 5000,
        });
      });
  };

  const joinRoom = () => {
    if (!joinRoomName || !joinRoomPassword) {
      toast.error("Room name and password are required", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    axios
      .post("http://localhost:3000/auth/join-room", {
        name: joinRoomName,
        password: joinRoomPassword,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status) {
          toast.success("Joined room successfully!", {
            position: "top-right",
            autoClose: 5000,
          });
          navigate(`/yourRoom/${res.data.room._id}`);
        } else {
          toast.error("Invalid room name or password", {
            position: "top-right",
            autoClose: 5000,
          });
        }
      })
      .catch((err) => {
        console.error("Error joining room:", err);
        toast.error("Failed to join room. Please try again later.", {
          position: "top-right",
          autoClose: 5000,
        });
      });
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/verify");
        if (response.data.status) {
          setUser(response.data.user); // Update user state with fetched data
          //console.log(response.data);
        } else {
          toast.error("Unauthorized access", {
            position: "top-right",
            autoClose: 5000,
          });
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Error fetching user data", {
          position: "top-right",
          autoClose: 5000,
        });
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div>
      <h1>Welcome, {user.username}</h1>
      <p>Email: {user.email}</p>

      <div>
        <h2>Rooms</h2>
        <ul>
          {user.rooms.map((room) => (
            <li key={room._id}>
              <Link to={`/yourRoom/${room._id}`}>
                <p>Room Name: {room.name}</p>
              </Link>
              <p>Share Password with Friends: {room._id.toString()}</p>
            </li>
          ))}
        </ul>
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

      <div>
        <button onClick={() => setShowJoinRoomModal(true)}>Join Room</button>
      </div>
      {showJoinRoomModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Join Room</h2>
            <input
              type="text"
              placeholder="Room Name"
              value={joinRoomName}
              onChange={(e) => setJoinRoomName(e.target.value)}
            />
            <input
              type="password"
              placeholder="Room Password"
              value={joinRoomPassword}
              onChange={(e) => setJoinRoomPassword(e.target.value)}
            />
            <button onClick={joinRoom}>Join</button>
            <button onClick={() => setShowJoinRoomModal(false)}>Close</button>
          </div>
        </div>
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
