import "../styles/auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    age: "",
    gender: "",
    height_cm: "",
    weight_kg: "",
    smoking_status: "",
    activity_level: "",
    known_conditions: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age: Number(form.age),
          height_cm: Number(form.height_cm),
          weight_kg: Number(form.weight_kg)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Registration failed");
        return;
      }

      alert("Registration successful! Please login.");
      navigate("/login"); // ✅ redirect after success
    } catch (err) {
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      {/* LEFT CONTENT */}
      <div className="auth-left">
        <h1>VasoScan</h1>
        <p>
          Create your profile to enable AI‑based fingertip micro blood flow
          analysis and personalized vascular insights.
        </p>
      </div>

      {/* RIGHT GLASS CARD */}
      <div className="auth-right">
        <form className="glass-card" onSubmit={handleRegister}>
          <h2>Register</h2>

          <input name="email" placeholder="Email" onChange={handleChange} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <div className="row">
            <input name="age" placeholder="Age" onChange={handleChange} />
            <input name="gender" placeholder="Gender" onChange={handleChange} />
          </div>

          <div className="row">
            <input
              name="height_cm"
              placeholder="Height (cm)"
              onChange={handleChange}
            />
            <input
              name="weight_kg"
              placeholder="Weight (kg)"
              onChange={handleChange}
            />
          </div>

          <input
            name="smoking_status"
            placeholder="Smoking Status"
            onChange={handleChange}
          />

          <input
            name="activity_level"
            placeholder="Activity Level"
            onChange={handleChange}
          />

          <input
            name="known_conditions"
            placeholder="Known Conditions (optional)"
            onChange={handleChange}
          />

          <button type="submit">Create Account</button>

          <p className="switch-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
