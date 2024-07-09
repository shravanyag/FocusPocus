import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [user, setUser] = useState({ username: "", email: "" });
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
      </div>
    </div>
  );
};

export default Dashboard;
