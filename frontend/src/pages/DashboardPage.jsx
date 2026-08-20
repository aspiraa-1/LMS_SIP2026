import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-hot-toast";
import { FiBookOpen, FiUsers, FiTrendingUp, FiActivity, FiCornerDownRight } from "react-icons/fi";

export default function DashboardPage() {
  const navigate = useNavigate();
  
  // Dynamic state hooks to read data sizes straight from backend collections
  const [bookCount, setBookCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0);
  const [borrowCount, setBorrowCount] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveMetrics();
  }, []);

  const fetchLiveMetrics = async () => {
    try {
      setLoading(true);
      // Simultaneously pull array packets from all 3 operational nodes
      const [booksRes, membersRes, borrowRes] = await Promise.all([
        API.get("/books"),
        API.get("/members"),
        API.get("/borrow")
      ]);

      // Calculate sizes dynamically based on dataset arrays
      setBookCount(booksRes.data.length);
      setMemberCount(membersRes.data.length);
      setBorrowCount(borrowRes.data.length);

      // Generate a dynamic activity stream based on real inventory changes
      const dynamicFeed = [];
      if (borrowRes.data[0]) {
        dynamicFeed.push({
          title: `Lending Event: '${borrowRes.data[0].bookTitle}'`,
          meta: `Assigned to ${borrowRes.data[0].memberName}`,
          status: borrowRes.data[0].status
        });
      }
      if (booksRes.data[0]) {
        dynamicFeed.push({
          title: `Catalog Entry: '${booksRes.data[0].title}'`,
          meta: `Authored by ${booksRes.data[0].author}`,
          status: "New"
        });
      }
      if (membersRes.data[0]) {
        dynamicFeed.push({
          title: `Identity Enrolled: '${membersRes.data[0].name}'`,
          meta: `Profile Tag: ${membersRes.data[0].membershipId}`,
          status: "Active"
        });
      }

      setRecentActivities(dynamicFeed);
    } catch (error) {
      console.error("Dashboard metrics synchronization failure:", error);
      toast.error("Metrics sync failure. Check connection parameters.");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { name: "Total Volumes", count: bookCount, icon: <FiBookOpen />, color: "#f43f5e", desc: "Live catalog stack count" },
    { name: "Active Members", count: memberCount, icon: <FiUsers />, color: "#ec4899", desc: "Enrolled profile tags" },
    { name: "Books Borrowed", count: borrowCount, icon: <FiTrendingUp />, color: "#f43f5e", desc: "Active checkout contracts" },
    { name: "System Load", count: "0.02s", icon: <FiActivity />, color: "#10b981", desc: "Cluster response optimal" },
  ];

  return (
    <div style={{
      backgroundColor: "#07020d", minHeight: "100vh", width: "100%", padding: "32px",
      color: "#ffffff", fontFamily: "monospace", boxSizing: "border-box"
    }}>
      
      {/* Header Workspace Branding */}
      <div style={{ marginBottom: "32px", borderBottom: "1px solid rgba(244, 63, 94, 0.1)", paddingBottom: "16px" }}>
        <span style={{ color: "#f43f5e", fontSize: "11px", tracking: "0.15em", fontWeight: "bold" }}>
          MAIN MANAGEMENT CONTROL WORKSPACE
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: "900", margin: "4px 0 0 0", tracking: "-0.02em" }}>
          CORE ADMINISTRATIVE DASHBOARD
        </h1>
      </div>

      {/* Live Data Ingestion Counting Grids */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            backgroundColor: "#0d0514", border: "1px solid rgba(244, 63, 94, 0.15)",
            borderRadius: "16px", padding: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.4)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>{stat.name}</span>
              <span style={{ fontSize: "18px", color: stat.color, filter: `drop-shadow(0 0 6px ${stat.color})` }}>{stat.icon}</span>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "4px" }}>
              {loading && typeof stat.count === "number" ? "..." : stat.count}
            </div>
            <div style={{ fontSize: "9px", color: "#64748b" }}>{stat.desc}</div>
          </div>
        ))}
      </div>

      {/* Content Columns Grid Structure Splits */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
        
        {/* Dynamic Activity Feed Monitor Console */}
        <div style={{ backgroundColor: "#0d0514", border: "1px solid rgba(244, 63, 94, 0.15)", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "bold", color: "#f43f5e", marginBottom: "16px", tracking: "0.05em" }}>
            LIVE TRANSACTION FEED
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {recentActivities.length === 0 ? (
              <p style={{ color: "#475569", fontSize: "11px", fontStyle: "italic" }}>Waiting for operational data stream updates...</p>
            ) : (
              recentActivities.map((act, index) => (
                <div key={index} style={{ paddingBottom: "12px", borderBottom: index !== recentActivities.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "bold", color: "#ffffff" }}>{act.title}</div>
                    <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>{act.meta}</div>
                  </div>
                  <span style={{
                    fontSize: "9px", padding: "2px 6px", borderRadius: "4px",
                    backgroundColor: "rgba(244, 63, 94, 0.1)", color: "#f43f5e", fontWeight: "bold"
                  }}>{act.status}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ACTIVE CLICKABLE BUTTON CONTROLS */}
        <div style={{ backgroundColor: "#0d0514", border: "1px solid rgba(244, 63, 94, 0.15)", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: "14px", fontWeight: "bold", color: "#f43f5e", marginBottom: "8px", tracking: "0.05em" }}>
              QUICK DATA ENTRY CONTROLS
            </h2>
            <p style={{ fontSize: "11px", color: "#64748b", marginBottom: "20px" }}>
              Execute state navigation triggers to manipulate data cluster sets directly.
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* FIXED: Active navigation router trigger triggers */}
              <button 
                onClick={() => navigate("/books")}
                style={{
                  width: "100%", padding: "14px", backgroundColor: "transparent", border: "1px solid rgba(244, 63, 94, 0.3)",
                  color: "#f43f5e", borderRadius: "10px", fontSize: "11px", fontWeight: "bold", textAlign: "left",
                  cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyBetween: "space-between"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(244,63,94,0.06)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <span>&gt;&gt;&gt; REGISTER NEW BOOK VOLUME</span>
                <FiCornerDownRight style={{ marginLeft: "auto" }} />
              </button>

              {/* FIXED: Active navigation router trigger triggers */}
              <button 
                onClick={() => navigate("/members")}
                style={{
                  width: "100%", padding: "14px", backgroundColor: "transparent", border: "1px solid rgba(244, 63, 94, 0.3)",
                  color: "#f43f5e", borderRadius: "10px", fontSize: "11px", fontWeight: "bold", textAlign: "left",
                  cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyBetween: "space-between"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(244,63,94,0.06)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <span>&gt;&gt;&gt; ENROLL NEW ACCREDITED MEMBER</span>
                <FiCornerDownRight style={{ marginLeft: "auto" }} />
              </button>
            </div>
          </div>
          
          <div style={{ marginTop: "24px", fontSize: "10px", color: "#475569", borderTop: "1px solid rgba(244,63,94,0.1)", paddingTop: "12px" }}>
            DATABASE REPLICA SYNCED STATUS // LOCAL NODE OPTIMAL
          </div>
        </div>
        

      </div>

    </div>
  );
}
