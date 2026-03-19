import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SetPin() {
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value) && value.length <= 4) {
      setPin(value);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (pin.length !== 4) {
    alert("PIN must be 4 digits");
    return;
  }

  const email = localStorage.getItem("email");

  try {
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

    const data = await res.json(); // ✅ ALWAYS AFTER fetch

    if (!res.ok) {
      alert(data.message || "Error setting PIN");
      return;
    }

    alert("PIN set successfully ✅");

    localStorage.setItem("pinSet", "true");

    navigate("/enter-pin");

  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100">

      <div className="bg-white p-10 rounded-3xl shadow-xl w-96 text-center">

        <h1 className="text-3xl font-bold text-pink-500 mb-3">
          GirlSpace 🌸
        </h1>

        <p className="text-gray-600 mb-6">
          Set a 4 digit lock to secure your space
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="password"
            value={pin}
            onChange={handleChange}
            maxLength="4"
            className="w-full text-center text-3xl tracking-[15px] border-2 border-pink-300 rounded-xl p-3 outline-none focus:border-pink-500"
            placeholder="••••"
          />

          <button
            type="submit"
            // onClick={() => navigate("/dashboard")}
            className="mt-6 w-full bg-pink-400 hover:bg-pink-500 text-white py-3 rounded-xl font-semibold transition"
          >
            Set PIN
          </button>

          <p className="text-center mt-4 text-sm text-gray-400">
            Forgot your PIN?{" "}
            <span
                onClick={() => navigate("/forgot-pin")}
                className="text-pink-400 cursor-pointer hover:text-pink-300"
            >
                Reset PIN
            </span>
           </p>

        </form>
      </div>
    </div>
  );
}

export default SetPin;