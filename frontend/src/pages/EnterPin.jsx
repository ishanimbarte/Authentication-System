import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EnterPin() {
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("email");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/verify-pin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, pin })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    if (pin.length !== 4) {
      alert("Enter 4 digit PIN");
      return;
    }

    // ✅ mark PIN verified
    sessionStorage.setItem("pinVerified", "true");

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4">

  {/* Glow effects */}
  <div className="absolute w-72 h-72 bg-pink-500 rounded-full blur-3xl opacity-30 animate-pulse top-10 left-10"></div>
  <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-30 animate-pulse bottom-10 right-10"></div>

  <div className="relative w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 text-center">

    <h2 className="text-3xl font-bold text-white mb-2">
      Enter PIN 🔐
    </h2>

    <p className="text-gray-400 mb-6">
      Unlock your GirlSpace
    </p>

    <form onSubmit={handleSubmit} className="space-y-6">

      {/* PIN Input */}
      <input
        type="password"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        maxLength="4"
        placeholder="••••"
        className="w-full text-center text-3xl tracking-[15px] py-3 rounded-xl bg-gray-900/70 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 outline-none transition"
      />

      {/* Button */}
      <button
        type="submit"
        className="w-full py-2.5 rounded-lg text-white font-semibold bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg hover:scale-105 transition"
      >
        Verify PIN
      </button>

    </form>

    {/* ✅ Signup Link */}
    <p className="mt-6 text-sm text-gray-400">
      New user?{" "}
      <span
        onClick={() => navigate("/signup")}
        className="text-pink-400 cursor-pointer hover:text-pink-300 font-medium"
      >
        Create Account
      </span>
    </p>

    <p className="mt-2 text-sm text-gray-400">
  Forgot your PIN?{" "}
  <span
    onClick={() => navigate("/set-pin")}
    className="text-purple-400 cursor-pointer hover:text-purple-300 font-medium"
  >
    Reset PIN
  </span>
</p>

  </div>
</div>
  );
}

export default EnterPin;