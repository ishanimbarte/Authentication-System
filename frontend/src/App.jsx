import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SetPin from "./pages/SetPin";
import ForgotPin from "./pages/ForgotPin";
import ResetPin from "./pages/ResetPin";
import EnterPin from "./pages/EnterPin";

import Layout from "./Dashboard/Layout"; // ✅ IMPORTANT
import Dashboard from "./Dashboard/Dashboard";
import PhotoVault from "./Dashboard/PhotoVault";

function App() {
  const email = localStorage.getItem("email");
  const pinVerified = sessionStorage.getItem("pinVerified");

  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ ROOT LOGIC */}
        <Route
          path="/"
          element={
            !email
              ? <Signup />
              : (!pinVerified
                  ? <Navigate to="/enter-pin" />
                  : <Navigate to="/dashboard" />)
          }
        />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PIN */}
        <Route path="/set-pin" element={<SetPin />} />
        <Route path="/enter-pin" element={<EnterPin />} />
        <Route path="/forgot-pin" element={<ForgotPin />} />
        <Route path="/reset-pin" element={<ResetPin />} />

        {/* ✅ MAIN APP (SIDEBAR LAYOUT) */}
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="vault" element={<PhotoVault />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;