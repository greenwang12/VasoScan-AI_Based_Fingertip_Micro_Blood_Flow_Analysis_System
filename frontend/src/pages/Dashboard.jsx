import "../styles/dashboard.css";
import { useEffect, useRef, useState } from "react";

// Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [latestResult, setLatestResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [scanning, setScanning] = useState(false);

  const [graphData, setGraphData] = useState(null);
  const [riskTrend, setRiskTrend] = useState(null);
  const [outcomes, setOutcomes] = useState([]);

  // ✅ NEW: AI outcomes from POST /predict/video
  const [aiOutcomes, setAiOutcomes] = useState([]);

  const fileInputRef = useRef(null);

  // =====================================
  // Load user, latest scan & history
  // =====================================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // Latest scan (GET)
    fetch(`http://127.0.0.1:8000/latest?user_id=${parsedUser.user_id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.message) setLatestResult(data);
      });

    // Scan history
    fetch(
      `http://127.0.0.1:8000/predict/history/graph?user_id=${parsedUser.user_id}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.message && data.metrics?.heart_rate?.length > 0) {
          setRiskTrend(data.trend_summary.risk_trend);

          const stressValues = data.metrics.stress_index.map((p) => p.y);
          const perfusionValues = data.metrics.perfusion.map((p) => p.y);

          const avgStress =
            stressValues.reduce((a, b) => a + b, 0) / stressValues.length;
          const avgPerfusion =
            perfusionValues.reduce((a, b) => a + b, 0) /
            perfusionValues.length;

          const derivedOutcomes = [];

          if (avgStress > 0.35 && avgPerfusion < 0.5) {
            derivedOutcomes.push(
              "⚠️ Elevated cardiovascular strain with reduced blood perfusion."
            );
          } else if (avgStress > 0.35) {
            derivedOutcomes.push(
              "⚠️ Stress index remains consistently elevated."
            );
          } else {
            derivedOutcomes.push(
              "✅ Circulation indicators appear stable and healthy."
            );
          }

          if (data.trend_summary.risk_trend === "Increasing") {
            derivedOutcomes.push(
              "📈 Trend indicates increasing cardiovascular load over time."
            );
          }

          setOutcomes(derivedOutcomes);

          setGraphData({
            labels: data.metrics.heart_rate.map((p) =>
              new Date(p.x).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })
            ),
            datasets: [
              {
                label: "Heart Rate (bpm)",
                data: data.metrics.heart_rate.map((p) => p.y),
                borderColor: "#22c55e",
                backgroundColor: "rgba(34,197,94,0.2)",
                yAxisID: "y",
                tension: 0.4
              },
              {
                label: "Stress Index",
                data: data.metrics.stress_index.map((p) => p.y),
                borderColor: "#facc15",
                backgroundColor: "rgba(250,204,21,0.2)",
                yAxisID: "y1",
                tension: 0.4
              },
              {
                label: "Perfusion",
                data: data.metrics.perfusion.map((p) => p.y),
                borderColor: "#60a5fa",
                backgroundColor: "rgba(96,165,250,0.2)",
                yAxisID: "y1",
                tension: 0.4
              }
            ]
          });
        }
      });
  }, []);

  // =====================================
  // Scan logic (POST)
  // =====================================
  const handleChooseVideo = () => {
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const handleScanVideo = async () => {
    if (!selectedFile || !user || scanning) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    setScanning(true);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/predict/video?user_id=${user.user_id}`,
        { method: "POST", body: formData }
      );

      const data = await res.json();
      if (data.error) return alert(data.error);

      setLatestResult({
        heart_rate: data.heart_rate,
        blood_flow_quality: data.blood_flow_quality,
        circulation_risk: data.circulation_risk,
        stress_index: data.stress_index
      });

      // ✅ THIS IS THE KEY FIX
      if (data.decision_support) {
        setAiOutcomes(data.decision_support);
      }

      setSelectedFile(null);
    } catch {
      alert("Scan failed");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="profile-avatar">👤</div>
        <h2>Welcome back 👋</h2>
      </header>

      <div className="dashboard-body">
        <aside className="dashboard-sidebar open">
          <div className="profile-card">
            <h3>User Profile</h3>
            <p className="email">{user?.email}</p>
          </div>

          <nav className="sidebar-menu">
            <button>Profile</button>
            <button>Scan History</button>
            <button>Graphs</button>
            <button>Predicted Results</button>
            <button>Settings</button>
            <button>Contact</button>
            <button
              className="logout"
              onClick={() => {
                localStorage.removeItem("user");
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </nav>
        </aside>

        <main className="dashboard-content">
          {/* ROW 1 */}
          <section className="row two-col">
            <div className="card glass">
              <h3>New Scan</h3>
              <button className="primary" onClick={handleChooseVideo}>
                Choose Video
              </button>

              <input
                type="file"
                ref={fileInputRef}
                accept="video/*"
                hidden
                onChange={handleFileSelected}
              />

              {selectedFile && (
                <>
                  <p>Selected: {selectedFile.name}</p>
                  <button
                    className="primary"
                    onClick={handleScanVideo}
                    disabled={scanning}
                  >
                    {scanning ? "Scanning..." : "Scan Video"}
                  </button>
                </>
              )}
            </div>

            <div className="card glass">
              <h3>Latest Result</h3>
              {latestResult ? (
                <>
                  <p>Heart Rate: {latestResult.heart_rate}</p>
                  <p>Blood Flow: {latestResult.blood_flow_quality}</p>
                  <p>Risk: {latestResult.circulation_risk}</p>
                  <p>Stress Index: {latestResult.stress_index}</p>
                </>
              ) : (
                <p>No scan yet</p>
              )}
            </div>
          </section>

          {/* ROW 2 — GRAPH */}
          <section className="row graph-row">
            <div className="card glass graph-card">
              <h3>Scan History Graph</h3>

              {!graphData ? (
                <p>No history available</p>
              ) : (
                <div className="graph-container">
                  <Line
                    data={graphData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      interaction: { mode: "index", intersect: false },
                      scales: {
                        y: {
                          position: "left",
                          title: { display: true, text: "Heart Rate (bpm)" }
                        },
                        y1: {
                          position: "right",
                          grid: { drawOnChartArea: false },
                          title: {
                            display: true,
                            text: "Stress / Perfusion"
                          }
                        }
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </section>

          {/* ROW 3 — POSSIBLE OUTCOMES */}
          <section className="row">
            <div className="card glass">
              <h3>Possible Outcomes</h3>
              <ul>
                {aiOutcomes.map((o, i) => (
                  <li key={`ai-${i}`}>🧠 {o}</li>
                ))}
                {outcomes.map((o, i) => (
                  <li key={`hist-${i}`}>{o}</li>
                ))}
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
