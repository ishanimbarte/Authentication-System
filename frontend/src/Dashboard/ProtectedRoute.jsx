import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isVerified = sessionStorage.getItem("pinVerified");

  return isVerified ? children : <Navigate to="/enter-pin" />;
}

export default ProtectedRoute;