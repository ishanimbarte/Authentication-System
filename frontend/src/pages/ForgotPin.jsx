import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPin() {

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpBox, setShowOtpBox] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    alert(data.message);

    if(res.ok){
      setShowOtpBox(true); // show OTP input
    }
  };

  const verifyOtp = async () => {
  const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, otp })
  });

  const data = await res.json();
  alert(data.message);

  if (res.ok) {
    navigate("/reset-pin"); // ✅ IMPORTANT
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">

      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl w-96">

        <h2 className="text-2xl text-white font-bold mb-4 text-center">
          Reset Your PIN 🔐
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700"
          />

          <button
            type="submit"
            className="w-full bg-pink-500 py-2 rounded-lg text-white"
          >
            Verify Email
          </button>

        </form>

        {showOtpBox && (
          <div className="mt-6 space-y-4">

            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e)=>setOtp(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 text-white border text-center tracking-widest"
            />

            <button
              onClick={verifyOtp}
              className="w-full bg-green-500 py-2 rounded-lg text-white"
            >
              Verify OTP
            </button>

          </div>
        )}

      </div>
    </div>
  );
}

export default ForgotPin;