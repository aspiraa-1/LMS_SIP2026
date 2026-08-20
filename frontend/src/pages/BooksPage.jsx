import { useState, useEffect } from "react";
import API from "../api/axios";
import { toast } from "react-hot-toast";
import { FiPlus, FiBook, FiUser, FiHash, FiCheckCircle } from "react-icons/fi";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch all books automatically when viewport initialises
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await API.get("/books");
      // Adjust if backend returns a nested property like response.data.books
      setBooks(Array.isArray(response.data) ? response.data : response.data.books || []);
    } catch (error) {
      console.error("Fetch inventory error:", error);
      toast.error("Failed to synchronise catalog records.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!title || !author) {
      return toast.error("Title and Author parameters are mandatory!");
    }

    try {
      setSubmitLoading(true);
      // Calls your clean direct mock/live API schema endpoint
      await API.post("/books", { title, author, isbn });
      
      toast.success("New volume ingested into matrix catalog! 📚");
      setTitle("");
      setAuthor("");
      setIsbn("");
      fetchInventory(); // Reload list directly from core cluster node
    } catch (error) {
      console.error("Add volume error:", error);
      toast.error(error.response?.data?.message || "Failed to commit record mutation.");
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
          CATALOG STORAGE REGISTRY SYSTEM
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: "900", margin: "4px 0 0 0", tracking: "-0.02em" }}>
          BOOK INVENTORY REPOSITORY
        </h1>
      </div>

      {/* Primary Split Viewport Container Layout */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "28px",
        alignItems: "start"
      }}>
        
        {/* Left Interactive Volume Addition Form */}
        <div style={{
          backgroundColor: "#0d0514",
          border: "1px solid rgba(244, 63, 94, 0.15)",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)"
        }}>
          <h2 style={{ fontSize: "14px", fontWeight: "bold", color: "#f43f5e", marginBottom: "20px", tracking: "0.05em" }}>
            INGEST NEW VOLUME RECORD
          </h2>
          <form onSubmit={handleAddBook} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            <div>
              <label style={{ display: "block", fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>
                Book Title Identifier
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "14px", color: "#64748b" }}><FiBook /></span>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Introduction to MERN"
                  style={{
                    width: "100%", padding: "12px 12px 12px 38px", backgroundColor: "rgba(0,0,0,0.3)",
                    border: "1px solid #1e1e1e", borderRadius: "10px", color: "#ffffff", fontSize: "12px", boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>
                Primary Author Name
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "14px", color: "#64748b" }}><FiUser /></span>
                <input 
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Douglas Crockford"
                  style={{
                    width: "100%", padding: "12px 12px 12px 38px", backgroundColor: "rgba(0,0,0,0.3)",
                    border: "1px solid #1e1e1e", borderRadius: "10px", color: "#ffffff", fontSize: "12px", boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>
                ISBN Reference Code (Optional)
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "14px", color: "#64748b" }}><FiHash /></span>
                <input 
                  type="text"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  placeholder="e.g. 978-3-16-148410-0"
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
              <FiPlus />
              <span>{submitLoading ? "COMMITTING RECORD..." : "COMMIT VOLUME TO CLUSTER"}</span>
            </button>
          </form>
        </div>

        {/* Right Active Catalog Monitor Dashboard */}
        <div style={{
          backgroundColor: "#0d0514",
          border: "1px solid rgba(244, 63, 94, 0.15)",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)"
        }}>
          <h2 style={{ fontSize: "14px", fontWeight: "bold", color: "#f43f5e", marginBottom: "20px", tracking: "0.05em" }}>
            ACTIVE ARCHIVE MATRIX
          </h2>

          {loading ? (
            <p style={{ color: "#64748b", fontSize: "12px" }}>Querying system catalog stream nodes...</p>
          ) : books.length === 0 ? (
            <p style={{ color: "#475569", fontSize: "11px", fontStyle: "italic" }}>
              No structural records identified. Input a volume grid to initialize cluster.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {books.map((book) => (
                <div 
                  key={book._id || book.id} 
                  style={{
                    padding: "16px", backgroundColor: "rgba(0,0,0,0.2)", border: "1px solid rgba(244,63,94,0.08)",
                    borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#ffffff", margin: 0 }}>{book.title}</h3>
                    <p style={{ fontSize: "11px", color: "#94a3b8", margin: "4px 0 0 0" }}>by {book.author}</p>
                    {book.isbn && <span style={{ fontSize: "9px", color: "#475569", display: "block", marginTop: "4px" }}>ISBN: {book.isbn}</span>}
                  </div>
                  <span style={{
                    fontSize: "9px", padding: "4px 8px", borderRadius: "6px", backgroundColor: "rgba(16,185,129,0.1)",
                    color: "#10b981", fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px", border: "1px solid rgba(16,185,129,0.2)"
                  }}>
                    <FiCheckCircle />
                    <span>READY</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
