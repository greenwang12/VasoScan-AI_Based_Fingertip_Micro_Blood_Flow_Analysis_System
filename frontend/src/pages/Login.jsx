import "../styles/auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Login failed");
        return;
      }

      // ✅ Save user info (optional but useful)
      localStorage.setItem("user", JSON.stringify(data));

      // ✅ Go to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError("Backend not reachable");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <h1>VasoScan</h1>
        <p>
          An AI‑based system for analyzing fingertip micro blood flow,
          enabling early detection of vascular irregularities.
        </p>

        <ul>
          <li>🫀 Non‑invasive vascular monitoring</li>
          <li>🤖 AI‑powered risk prediction</li>
          <li>📊 Real‑time & accurate insights</li>
        </ul>
      </div>

      <div className="auth-right">
        <div className="glass-card">
          <h2>Login</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error-text">{error}</p>}

          <button onClick={handleLogin}>Login</button>

          <p className="switch-text">
            New user?{" "}
            <Link to="/register" className="link">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
