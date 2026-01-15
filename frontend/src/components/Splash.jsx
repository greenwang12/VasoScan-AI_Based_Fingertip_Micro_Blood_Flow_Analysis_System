import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/splash.css";
import logo from "../assets/vasoscan-logo.png";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login"); // redirect to login page
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <img src={logo} className="splash-logo" />
      <h1 className="splash-title">VasoScan</h1>
      <p className="splash-subtitle">
        AI‑Based Fingertip Micro Blood Flow Analysis
      </p>
    </div>
  );
}
