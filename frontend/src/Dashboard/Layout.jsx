import { Outlet, useNavigate } from "react-router-dom";
import { Image, Link as LinkIcon, CheckSquare, Smile } from "lucide-react";

export default function Layout() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-100 to-pink-100">

      {/* Sidebar */}
      <div className="w-64 bg-white/70 backdrop-blur-lg shadow-xl p-5 flex flex-col">

        <h1 className="text-3xl font-extrabold text-purple-600 mb-10 text-center">
          👑 GirlSpace
        </h1>

        <nav className="flex flex-col gap-4">
          <SidebarItem
            icon={<Image size={20} />}
            label="Photo Vault"
            onClick={() => navigate("/vault")}
          />
          <SidebarItem
            icon={<LinkIcon size={20} />}
            label="Links"
          />
          <SidebarItem
            icon={<CheckSquare size={20} />}
            label="ToDo"
          />
          <SidebarItem
            icon={<Smile size={20} />}
            label="Mood"
          />
        </nav>

        <div className="mt-auto text-center text-sm text-purple-400">
          Made with 💜
        </div>
      </div>

      {/* 🔥 Dynamic Content */}
      <div className="flex-1 p-10 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-purple-200 transition"
    >
      <div className="text-purple-600">{icon}</div>
      <span className="text-gray-700 font-medium">{label}</span>
    </div>
  );
}