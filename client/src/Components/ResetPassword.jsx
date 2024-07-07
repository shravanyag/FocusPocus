import React, { useState } from "react";
import "../App.css";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const { token } = useParams();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:3000/auth/reset-password/" + token, {
      password,
    })
      .then((response) => {
        if (response.data.status) {
          toast.success("Password updated!");
          navigate("/login");
        } else if (response.data.message === "invalid token") {
          toast.error("Invalid token!", { autoClose: 15000 });
        }
      })
      .catch((err) => {
        toast.error("An error occurred!", { autoClose: 15000 });
      });
  };

  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>

        <label htmlFor="password">New Password:</label>
        <input
          type="password"
          placeholder="******"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
