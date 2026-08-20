import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  FiGrid, 
  FiBook, 
  FiUsers, 
  FiRepeat, 
  FiLogOut 
} from "react-icons/fi";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FiGrid /> },
    { name: "Book Inventory", path: "/books", icon: <FiBook /> },
    { name: "Member Catalog", path: "/members", icon: <FiUsers /> },
    { name: "Borrow Registry", path: "/borrow", icon: <FiRepeat /> },
  ];

  return (
    <div style={{
      position: 'fixed',
      left: 0,
      top: 0,
      height: '100vh',
      width: '260px',
      backgroundColor: '#0d0514',
      borderRight: '1px solid rgba(244, 63, 94, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'between',
      zIndex: 50,
      boxShadow: '5px 0 30px rgba(244,63,94,0.05)',
      fontFamily: 'monospace'
    }}>
      
      {/* Top Identity Block */}
      <div style={{ flex: 1 }}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid rgba(244, 63, 94, 0.1)',
          background: 'linear-gradient(to bottom, rgba(76, 5, 25, 0.2), transparent)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px', filter: 'drop-shadow(0 0 8px rgba(244,63,94,0.6))' }}>📚</span>
            <div>
              <h2 style={{ fontSize: '14px', fontWeight: '900', color: '#ffffff', tracking: '0.1em', margin: 0 }}>NEXUS CORE</h2>
              {/* Fixed: Removed "//" comment styling and changed to clean formal text */}
              <p style={{ fontSize: '9px', color: '#f43f5e', tracking: '0.2em', margin: 0, fontWeight: 'bold' }}>ADMINISTRATION NODE</p>
            </div>
          </div>
        </div>

        {/* Real-time Status System Matrix */}
        <div style={{
          margin: '16px',
          padding: '12px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid #1e1e1e',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px #10b981' }} />
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>
            <div>NODE STATUS: <span style={{ color: '#10b981', fontWeight: 'bold' }}>ONLINE</span></div>
            <div style={{ fontSize: '8px', opacity: 0.6 }}>SECURE TUNNEL ACTIVE</div>
          </div>
        </div>

        {/* Links Container */}
        <nav style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  textDecoration: 'none',
                  letterSpacing: '0.05em',
                  transition: 'all 0.3s',
                  backgroundColor: isActive ? 'rgba(244, 63, 94, 0.1)' : 'transparent',
                  border: isActive ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid transparent',
                  color: isActive ? '#f43f5e' : '#94a3b8',
                  boxShadow: isActive ? 'inset 0 0 15px rgba(244, 63, 94, 0.1)' : 'none'
                }}
              >
                <span style={{ fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                  {item.icon}
                </span>
                <span style={{ textTransform: 'uppercase' }}>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Identity & Sign Out */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(244, 63, 94, 0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '0 8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'rgba(244, 63, 94, 0.2)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: '#f43f5e',
            fontSize: '12px'
          }}>
            SU
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#ffffff' }}>{user?.name || "Supervisor"}</div>
            <div style={{ fontSize: '9px', color: '#64748b' }}>{user?.email || "admin@core.com"}</div>
          </div>
        </div>

        <button
          onClick={logout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '12px 0',
            backgroundColor: 'rgba(127, 29, 29, 0.2)',
            color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ef4444';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(127, 29, 29, 0.2)';
            e.currentTarget.style.color = '#ef4444';
          }}
        >
          <FiLogOut style={{ fontSize: '14px' }} />
          <span>TERMINATE SESSION</span>
        </button>
      </div>

    </div>
  );
}
