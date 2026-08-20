import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blinkActive, setBlinkActive] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleScreenInteraction = () => {
    setBlinkActive(true);
    setTimeout(() => setBlinkActive(false), 150);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleScreenInteraction();
    
    if (!email || !password) {
      return toast.error("All authentication coordinates are required!");
    }

    try {
      setLoading(true);
      const response = await API.post("/auth/login", { email, password });
      login(response.data);
      toast.success("Access Granted. Welcome to Core Terminal! 🚀");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      const errorMsg = error.response?.data?.message || "Invalid coordinates. Use admin@library.com / admin123!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      onClick={handleScreenInteraction}
      style={{
        minHeight: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center",
        backgroundColor: "#07020d", margin: 0, padding: 0, fontFamily: "monospace", overflow: "hidden", position: "relative"
      }}
    >
      {/* Dynamic Screen Blinker Overlay */}
      <div style={{
        position: "absolute", inset: 0, backgroundColor: "rgba(244, 63, 94, 0.05)", zIndex: 50,
        pointerEvents: "none", transition: "opacity 0.15s", opacity: blinkActive ? 1 : 0
      }} />
      
      {/* Background Neo-Glow Orbs */}
      <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "500px", height: "500px", borderRadius: "50%", backgroundColor: "rgba(244, 63, 94, 0.1)", filter: "blur(120px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "500px", height: "500px", borderRadius: "50%", backgroundColor: "rgba(244, 63, 94, 0.08)", filter: "blur(120px)", pointerEvents: "none" }} />

      {/* Main Structural Layout Box Split */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        style={{
          position: "relative", width: "100%", maxWidth: "800px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          backgroundColor: "rgba(13, 5, 20, 0.8)", border: "1px solid rgba(244, 63, 94, 0.3)", borderRadius: "24px",
          boxShadow: "0 0 40px rgba(244, 63, 94, 0.15)", backdropFilter: "blur(12px)", overflow: "hidden", margin: "16px", zIndex: 10
        }}
      >
        
        {/* Left Visual Panel */}
        <div style={{
          background: "linear-gradient(135deg, #4c0519, #160621, #0d0514)", padding: "32px",
          display: "flex", flexDirection: "column", justifyContent: "space-between", borderRight: "1px solid rgba(244, 63, 94, 0.2)", position: "relative"
        }}>
          <div>
            <div style={{ color: "#f43f5e", fontSize: "10px", tracking: "0.2em", textTransform: "uppercase", marginBottom: "4px" }}>System Node // v1.0</div>
            <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#ffffff", letterSpacing: "-0.02em", margin: 0, textTransform: "uppercase", lineHeight: 1.1 }}>
              Nexus <br/><span style={{ color: "#f43f5e", textShadow: "0 0 10px rgba(244,63,94,0.4)" }}>Library</span>
            </h1>
          </div>

          {/* Floating Central Book Core */}
          <div style={{ margin: "40px 0", display: "flex", justifyContent: "center", alignItems: "center", position: "relative", minHeight: "120px" }}>
            <div style={{ position: "absolute", width: "110px", height: "110px", border: "1px solid rgba(244, 63, 94, 0.3)", borderRadius: "50%" }} />
            <div style={{ fontSize: "56px", filter: "drop-shadow(0 0 12px rgba(244, 63, 94, 0.6))" }}>📚</div>
          </div>

          <div style={{ color: "#94a3b8", fontSize: "11px", lineHeight: "1.4" }}>
            // Secure access protocol active. Authorized admin entities only.
          </div>
        </div>

        {/* Right Form Input Panel */}
        <div style={{ padding: "32px", display: "flex", flexDirection: "column", justifyContent: "center", backgroundColor: "#0d0514" }}>
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#ffffff", margin: 0 }}>Initialize Core Session</h2>
            <p style={{ color: "#94a3b8", fontSize: "11px", marginTop: "4px", margin: 0 }}>Input your administrative cryptographic keys below.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* Email Field */}
            <div>
              <label style={{ display: "block", fontSize: "10px", color: "#f43f5e", textTransform: "uppercase", marginBottom: "6px" }}>
                [ ADMIN_EMAIL_IDENTIFIER ]
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%", padding: "14px", backgroundColor: "rgba(0,0,0,0.4)", border: "1px solid #1e1e1e",
                  borderRadius: "12px", color: "#ffffff", fontSize: "13px", boxSizing: "border-box", outline: "none"
                }}
                placeholder="admin@library.com"
                disabled={loading}
              />
            </div>

            {/* Password Field with Interactive Visibility Eye */}
            <div style={{ position: "relative" }}>
              <label style={{ display: "block", fontSize: "10px", color: "#f43f5e", textTransform: "uppercase", marginBottom: "6px" }}>
                [ ACCESS_PASSPHRASE ]
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%", padding: "14px 44px 14px 14px", backgroundColor: "rgba(0,0,0,0.4)", border: "1px solid #1e1e1e",
                  borderRadius: "12px", color: "#ffffff", fontSize: "13px", boxSizing: "border-box", outline: "none"
                }}
                placeholder="••••••••"
                disabled={loading}
              />
              
              <button
                type="button"
                onClick={() => { setShowPassword(!showPassword); handleScreenInteraction(); }}
                style={{
                  position: "absolute", right: "12px", bottom: "12px", backgroundColor: "transparent",
                  border: "none", color: "#64748b", cursor: "pointer", outline: "none", fontSize: "14px"
                }}
              >
                {showPassword ? "🔒" : "👁️"}
              </button>
            </div>

            {/* Execution Button */}
            <div style={{ marginTop: "8px" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", background: "linear-gradient(to right, #f43f5e, #e11d48)", color: "#ffffff",
                  fontSize: "12px", fontWeight: "bold", padding: "16px", borderRadius: "12px", border: "none",
                  cursor: "pointer", boxShadow: "0 0 20px rgba(244, 63, 94, 0.3)", letterSpacing: "0.05em",
                  transition: "opacity 0.2s", opacity: loading ? 0.5 : 1
                }}
              >
                {loading ? ">>> COGNITIVE KEY VERIFICATION..." : ">>> EXECUTE SYSTEM LOGIN"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
