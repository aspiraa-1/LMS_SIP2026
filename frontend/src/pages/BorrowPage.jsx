import { useState, useEffect } from "react";
import API from "../api/axios";
import { toast } from "react-hot-toast";
import { FiGitCommit, FiBook, FiUser, FiCornerUpLeft, FiActivity } from "react-icons/fi";

export default function BorrowPage() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [logs, setLogs] = useState([]);
  
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchCoreContextData();
  }, []);

  const fetchCoreContextData = async () => {
    try {
      setLoading(true);
      const [booksRes, membersRes, logsRes] = await Promise.all([
        API.get("/books"),
        API.get("/members"),
        API.get("/borrow")
      ]);
      setBooks(booksRes.data);
      setMembers(membersRes.data);
      setLogs(logsRes.data);
    } catch (error) {
      console.error("Context matrix compilation error:", error);
      toast.error("Failed to gather relational record references.");
    } finally {
      setLoading(false);
    }
  };

  const handleIssueTransaction = async (e) => {
    e.preventDefault();
    if (!selectedBook || !selectedMember) {
      return toast.error("Please allocate both book and member variables!");
    }

    try {
      setSubmitLoading(true);
      await API.post("/borrow", { bookId: selectedBook, memberId: selectedMember });
      toast.success("Checkout allocation finalized successfully! 📜");
      setSelectedBook("");
      setSelectedMember("");
      fetchCoreContextData(); // Refresh transaction stream live
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to finalize checkout.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReturnTransaction = async (logId) => {
    try {
      await API.post(`/borrow/return/${logId}`);
      toast.success("Volume returned to catalog matrix warehouse.");
      fetchCoreContextData();
    } catch (error) {
      toast.error("Failed to modify transaction registry status.");
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
      <div style={{ marginBottom: "32px", borderBottom: "1px solid rgba(244, 63, 94, 0.1)", paddingBottom: "16px" }}>
        <span style={{ color: "#f43f5e", fontSize: "11px", tracking: "0.15em", fontWeight: "bold" }}>
          LENDING DISPATCH ARCHIVE INTERFACES
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: "900", margin: "4px 0 0 0", tracking: "-0.02em" }}>
          BORROW REGISTRY TERMINAL
        </h1>
      </div>

      {/* Main Structural Twin Columns Viewport Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px", alignItems: "start" }}>
        
        {/* Left Side: Dynamic Dispatch Ingestion Console */}
        <div style={{ backgroundColor: "#0d0514", border: "1px solid rgba(244, 63, 94, 0.15)", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "bold", color: "#f43f5e", marginBottom: "20px", tracking: "0.05em" }}>
            INITIALIZE CHECKOUT ROUTINE
          </h2>
          <form onSubmit={handleIssueTransaction} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            <div>
              <label style={{ display: "block", fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>
                Select Catalog Book Volume
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "14px", color: "#64748b" }}><FiBook /></span>
                <select
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 12px 12px 38px", backgroundColor: "#07020d",
                    border: "1px solid #1e1e1e", borderRadius: "10px", color: "#ffffff", fontSize: "12px", boxSizing: "border-box"
                  }}
                >
                  <option value="">-- Choose Volume Identifier --</option>
                  {books.map(b => <option key={b._id} value={b._id}>{b.title}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>
                Select Targeted System Member
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "14px", color: "#64748b" }}><FiUser /></span>
                <select
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 12px 12px 38px", backgroundColor: "#07020d",
                    border: "1px solid #1e1e1e", borderRadius: "10px", color: "#ffffff", fontSize: "12px", boxSizing: "border-box"
                  }}
                >
                  <option value="">-- Choose Account Identity --</option>
                  {members.map(m => <option key={m._id} value={m._id}>{m.name} ({m.membershipId})</option>)}
                </select>
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
              <FiGitCommit />
              <span>{submitLoading ? "DISPATCHING LOG..." : "EXECUTE VOLUME SHIPMENT"}</span>
            </button>
          </form>
        </div>

        {/* Right Side: Active Real-time Ledger Log Feed */}
        <div style={{ backgroundColor: "#0d0514", border: "1px solid rgba(244, 63, 94, 0.15)", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "bold", color: "#f43f5e", marginBottom: "20px", tracking: "0.05em" }}>
            TRANSACTION FEED JOURNAL LIST
          </h2>

          {loading ? (
            <p style={{ color: "#64748b", fontSize: "12px" }}>Querying relational stream blocks...</p>
          ) : logs.length === 0 ? (
            <p style={{ color: "#475569", fontSize: "11px", fontStyle: "italic" }}>No lending contracts registered.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {logs.map((log) => (
                <div 
                  key={log._id} 
                  style={{
                    padding: "16px", backgroundColor: "rgba(0,0,0,0.2)", border: "1px solid rgba(244,63,94,0.08)",
                    borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#ffffff", margin: 0 }}>{log.bookTitle}</h3>
                    <p style={{ fontSize: "11px", color: "#94a3b8", margin: "4px 0 0 0" }}>Issued to: {log.memberName}</p>
                    <span style={{ fontSize: "9px", color: "#475569", display: "block", marginTop: "4px" }}>Date: {log.borrowDate}</span>
                  </div>
                  
                  <div>
                    {log.status === "Issued" ? (
                      <button
                        onClick={() => handleReturnTransaction(log._id)}
                        style={{
                          backgroundColor: "rgba(244,63,94,0.1)", color: "#f43f5e", border: "1px solid rgba(244,63,94,0.2)",
                          fontSize: "10px", padding: "6px 10px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer",
                          display: "flex", alignItems: "center", gap: "4px"
                        }}
                      >
                        <FiCornerUpLeft />
                        <span>RETURN</span>
                      </button>
                    ) : (
                      <span style={{
                        fontSize: "9px", padding: "4px 8px", borderRadius: "6px", backgroundColor: "rgba(16,185,129,0.06)",
                        color: "#10b981", fontWeight: "bold", border: "1px solid rgba(16,185,129,0.2)"
                      }}>
                        RESTOCKED
                      </span>
                    )}
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
