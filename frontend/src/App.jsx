import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Layout/Sidebar";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import BooksPage from "./pages/BooksPage";
import MembersPage from "./pages/MembersPage";
import BorrowPage from "./pages/BorrowPage";

function PrivateLayout({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/dashboard" element={<PrivateLayout><DashboardPage /></PrivateLayout>} />
      <Route path="/books"     element={<PrivateLayout><BooksPage /></PrivateLayout>} />
      <Route path="/members"   element={<PrivateLayout><MembersPage /></PrivateLayout>} />
      <Route path="/borrow"    element={<PrivateLayout><BorrowPage /></PrivateLayout>} />
      <Route path="*"          element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
