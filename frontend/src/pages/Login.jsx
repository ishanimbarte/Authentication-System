import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json(); // ✅ MUST be here first

    if (!response.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // ✅ Save user data
    localStorage.setItem("userId", data.user._id);
    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.user.email);

    alert("Login successful");

    // 👇 NEXT LOGIC (IMPORTANT)
    if (data.user.pin) {
      navigate("/enter-pin"); // already has PIN
    } else {
      navigate("/set-pin"); // first time
    }

  } catch (error) {
    console.log("Network error:", error);
    alert("Something went wrong");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4">

      {/* Background glow */}
      <div className="absolute w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-30 animate-pulse top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-30 animate-pulse bottom-10 right-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8"
      >

        <h2 className="text-center text-3xl font-bold text-white mb-6">
          Sign in to your account
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-900/70 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-10 pr-10 py-2 rounded-lg bg-gray-900/70 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />

            <button
              type="button"
              onClick={()=>setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400"
            >
              {showPassword ? <FaEyeSlash/> : <FaEye/>}
            </button>
          </div>

          {/* Sign in button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-2.5 rounded-lg text-white font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg"
          >
            LogIn
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-2.5 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            <FaGoogle />
            Continue with Google
          </button>

          <p className="text-center text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Signup
            </Link>
          </p>

        </form>

        {/* Show profile image after login */}
        {userImage && (
          <div className="flex flex-col items-center mt-6">
            <p className="text-gray-300 mb-2">Logged in User</p>
            <img
              src={userImage}
              alt="profile"
              className="w-20 h-20 rounded-full border-2 border-indigo-500 object-cover"
            />
          </div>
        )}

        {isLoggedIn && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/set-pin")}
            className="mt-5 w-full py-2.5 rounded-lg text-white font-semibold bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg"
          >
            Set Your Secret PIN 🔐
          </motion.button>
        )}

      </motion.div>
    </div>
  );
}

export default Login;