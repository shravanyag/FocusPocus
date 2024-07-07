import React, { useState } from "react";
import "../App.css";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:3000/auth/forgot-password", {
      email,
    })
      .then((response) => {
        if (response.data.status) {
          toast.success("Email sent!");
          navigate("/login");
        } else if (response.data.message === "user is not registered") {
          toast.error("User is not registered!", { autoClose: 15000 });
        } else {
          toast.error("Error in sending email!", { autoClose: 15000 });
        }
      })
      .catch((err) => {
        toast.error("An error occurred!", { autoClose: 15000 });
      });
  };

  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          autoComplete="off"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Send an Email</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
