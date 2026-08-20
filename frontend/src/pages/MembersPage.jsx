import { useState, useEffect } from "react";
import API from "../api/axios";
import { toast } from "react-hot-toast";
import { FiUserPlus, FiUser, FiMail, FiShield, FiLoader } from "react-icons/fi";

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchMembersRegistry();
  }, []);

  const fetchMembersRegistry = async () => {
    try {
      setLoading(true);
      const response = await API.get("/members");
      setMembers(Array.isArray(response.data) ? response.data : response.data.members || []);
    } catch (error) {
      console.error("Fetch members registry failure:", error);
      toast.error("Failed to parse cluster database profiles.");
    } finally {
      // The spelling is completely fixed right here
      setLoading(false);
    }
  };

  const handleEnrollMember = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      return toast.error("Name and Email data inputs are mandatory!");
    }

    try {
      setSubmitLoading(true);
      await API.post("/members", { name, email });
      
      toast.success("New member identity token allocated successfully! 👤");
      setName("");
      setEmail("");
      fetchMembersRegistry(); 
    } catch (error) {
      console.error("Enrollment crash:", error);
      toast.error(error.response?.data?.message || "Failed to finalize account tracking node.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: "#07020d",
      minHeight: "100vh",
      width: "100%",
      padding: "32px",
      color: "#ffffff",
      fontFamily: "monospace",
      boxSizing: "border-box"
    }}>
      
      {/* Structural Branding Header */}
      <div style={{
        marginBottom: "32px",
        borderBottom: "1px solid rgba(244, 63, 94, 0.1)",
        paddingBottom: "16px"
      }}>
        <span style={{ color: "#f43f5e", fontSize: "11px", tracking: "0.15em", fontWeight: "bold" }}>
          IDENTITY AUTHENTICATION CONTROL MATRIX
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: "900", margin: "4px 0 0 0", tracking: "-0.02em" }}>
          MEMBER REGISTRY MANAGEMENT
        </h1>
      </div>

      {/* Grid Layout Split Frame */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "28px",
        alignItems: "start"
      }}>
        
        {/* Profile Enrollment Component Card */}
        <div style={{
          backgroundColor: "#0d0514",
          border: "1px solid rgba(244, 63, 94, 0.15)",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)"
        }}>
          <h2 style={{ fontSize: "14px", fontWeight: "bold", color: "#f43f5e", marginBottom: "20px", tracking: "0.05em" }}>
            ENROLL SYSTEM ACCOUNT PROFILE
          </h2>
          <form onSubmit={handleEnrollMember} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            <div>
              <label style={{ display: "block", fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>
                Full Legal Name String
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "14px", color: "#64748b" }}><FiUser /></span>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Johnathan Doe"
                  style={{
                    width: "100%", padding: "12px 12px 12px 38px", backgroundColor: "rgba(0,0,0,0.3)",
                    border: "1px solid #1e1e1e", borderRadius: "10px", color: "#ffffff", fontSize: "12px", boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>
                Secure Communication Email
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "14px", color: "#64748b" }}><FiMail /></span>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@domain.com"
                  style={{
                    width: "100%", padding: "12px 12px 12px 38px", backgroundColor: "rgba(0,0,0,0.3)",
                    border: "1px solid #1e1e1e", borderRadius: "10px", color: "#ffffff", fontSize: "12px", boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={submitLoading}
              style={{
                width: "100%", padding: "14px", marginTop: "8px", backgroundColor: "#f43f5e", color: "#ffffff",
                border: "none", borderRadius: "12px", fontSize: "12px", fontWeight: "bold", letterSpacing: "0.1em",
                cursor: "pointer", boxShadow: "0 0 15px rgba(244,63,94,0.3)", display: "flex", alignItems: "center",
                justifyContent: "center", gap: "8px", opacity: submitLoading ? 0.5 : 1
              }}
            >
              {submitLoading ? <FiLoader className="animate-spin" /> : <FiUserPlus />}
              <span>{submitLoading ? "PROVISIONING..." : "PROVISION ACCOUNT IDENTIFIER"}</span>
            </button>
          </form>
        </div>

        {/* Database Active Index Roster */}
        <div style={{
          backgroundColor: "#0d0514",
          border: "1px solid rgba(244, 63, 94, 0.15)",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)"
        }}>
          <h2 style={{ fontSize: "14px", fontWeight: "bold", color: "#f43f5e", marginBottom: "20px", tracking: "0.05em" }}>
            ACCOUNT PROFILE MONITOR INDEX
          </h2>

          {loading ? (
            <p style={{ color: "#64748b", fontSize: "12px" }}>Querying authentication matrix array pools...</p>
          ) : members.length === 0 ? (
            <p style={{ color: "#475569", fontSize: "11px", fontStyle: "italic" }}>
              No identity indices detected. Inject an account file to initialize pool tracking.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {members.map((member) => (
                <div 
                  key={member._id} 
                  style={{
                    padding: "16px", backgroundColor: "rgba(0,0,0,0.2)", border: "1px solid rgba(244,63,94,0.08)",
                    borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#ffffff", margin: 0 }}>{member.name}</h3>
                    <p style={{ fontSize: "11px", color: "#94a3b8", margin: "4px 0 0 0" }}>{member.email}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{
                      fontSize: "9px", padding: "4px 8px", borderRadius: "6px", backgroundColor: "rgba(244,63,94,0.08)",
                      color: "#f43f5e", fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px", border: "1px solid rgba(244,63,94,0.2)"
                    }}>
                      <FiShield />
                      <span>{member.membershipId}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
