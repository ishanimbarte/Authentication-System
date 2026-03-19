import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ResetPin() {

  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("email");

      const res = await fetch("http://localhost:5000/api/auth/reset-pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          newPin: pin
        })
      });
    const data = await res.json();

    alert(data.message);
    navigate("/enter-pin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">

      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl w-96">

        <h2 className="text-white text-2xl mb-4 text-center">
          Set New PIN
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="password"
            maxLength="4"
            placeholder="Enter new 4 digit PIN"
            value={pin}
            onChange={(e)=>setPin(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 text-center tracking-widest text-xl"
          />

          <button className="w-full bg-purple-500 py-2 rounded-lg text-white">
            Reset PIN
          </button>

        </form>

      </div>
    </div>
  );
}

export default ResetPin;