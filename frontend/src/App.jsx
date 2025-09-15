import React, { useContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import LeavesList from "./pages/LeavesList";
import LeaveDetails from "./pages/LeaveDetails";
import ApplyLeave from "./pages/ApplyLeave";
import ProtectedRoute from "./components/ProtectedRoute";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation(); // ✅ to check current page

  return (
    <nav className="p-4 bg-gray-100 flex justify-between items-center">
      <div className="flex gap-4">
        {/* Everyone can apply leave */}
        {user && (
          <Link to="/apply-leave" className="hover:underline">
            Apply Leave
          </Link>
        )}

        {/* Everyone can see leaves */}
        {user && (
          <Link to="/leaves" className="hover:underline">
            Leaves
          </Link>
        )}
      </div>

      <div className="flex gap-4 items-center">
        {user && (
          <span className="text-sm">
            {user.name} ({user.role})
          </span>
        )}

        {user ? (
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        ) : (
          // ✅ Hide Login button when already on /login
          location.pathname !== "/login" && (
            <Link to="/login" className="hover:underline">
              Login
            </Link>
          )
        )}
      </div>
    </nav>
  );
}

// ✅ wrapper for login page
function LoginRedirectWrapper({ children }) {
  const { user } = useContext(AuthContext);
  if (user) {
    // Role-based landing page
    if (user.role === "Employee") {
      return <Navigate to="/apply-leave" replace />;
    } else {
      return <Navigate to="/leaves" replace />;
    }
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Redirect root (/) to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Login route with redirect if already logged in */}
          <Route
            path="/login"
            element={
              <LoginRedirectWrapper>
                <Login />
              </LoginRedirectWrapper>
            }
          />

          {/* Protected routes */}
          <Route
            path="/leaves"
            element={
              <ProtectedRoute>
                <LeavesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leave/:id"
            element={
              <ProtectedRoute>
                <LeaveDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/apply-leave"
            element={
              <ProtectedRoute>
                <ApplyLeave />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
