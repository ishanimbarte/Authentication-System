import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

function Signup() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null); // added for cloudinary
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleImage = (e) => {
  const file = e.target.files[0];
  setImageFile(file); // important

  // preview
  const reader = new FileReader();
  reader.onloadend = () => {
    setImage(reader.result);
  };

  if (file) {
    reader.readAsDataURL(file);
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("image", imageFile);

  try {
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      // ❌ ERROR CASE → show popup
      alert(data.message);
      return;
    }

    // ✅ SUCCESS
    alert("Signup successful");
    navigate("/login");

  } catch (error) {
    alert("Something went wrong");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4">

      <div className="absolute w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-30 animate-pulse top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-30 animate-pulse bottom-10 right-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8"
      >

        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Create Account
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* Name */}
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-gray-400" />
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e)=>setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-900/70 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

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

          {/* Image Upload */}
          <div>
            <input
              type="file"
              accept="image/*"
              required
              // onChange={(e) => setImage(e.target.files[0])}
              onChange={handleImage}
              className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0 file:text-sm file:font-semibold
              file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
            />
          </div>

          {/* Image Preview */}
          {image && (
            <div className="flex justify-center">
              <img
                src={image}
                alt="preview"
                className="w-20 h-20 rounded-full object-cover border border-gray-600"
              />
            </div>
          )}

          {/* Signup Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-2.5 rounded-lg text-white font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg"
          >
            Sign Up
          </motion.button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-2.5 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            <FaGoogle />
            Continue with Google
          </button>

          <p className="text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Login
            </Link>
          </p>

        </form>
      </motion.div>
    </div>
  );
}

export default Signup;