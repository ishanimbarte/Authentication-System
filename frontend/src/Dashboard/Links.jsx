import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";

export default function Links() {
  const [links, setLinks] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [editId, setEditId] = useState(null);

  const userId = localStorage.getItem("userId");

  // 🔥 Load links
  useEffect(() => {
    fetch(`http://localhost:5000/api/links/${userId}`)
      .then(res => res.json())
      .then(data => setLinks(data));
  }, []);

  // 🔥 Create / Update
  const handleSubmit = async () => {
    if (!title || !url) return alert("Title & Link required ❗");

    if (editId) {
      // UPDATE
      const res = await fetch(`http://localhost:5000/api/links/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, url, category, note }),
      });

      const updated = await res.json();

      setLinks(links.map(l => (l._id === editId ? updated : l)));
      setEditId(null);

    } else {
      // CREATE
      const res = await fetch("http://localhost:5000/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, url, category, note, userId }),
      });

      const data = await res.json();
      setLinks([...links, data]);
    }

    setTitle("");
    setUrl("");
    setCategory("");
    setNote("");
  };

  // 🔥 Delete
  const deleteLink = async (id) => {
    await fetch(`http://localhost:5000/api/links/${id}`, {
      method: "DELETE",
    });

    setLinks(links.filter(l => l._id !== id));
  };

  // 🔥 Edit
  const editLink = (link) => {
    setTitle(link.title);
    setUrl(link.url);
    setCategory(link.category);
    setNote(link.note);
    setEditId(link._id);
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-purple-100">

      <h1 className="text-3xl font-bold text-purple-700 mb-6">
        🔗 My Cute Links
      </h1>

      {/* FORM */}
      <div className="bg-white/70 backdrop-blur p-4 rounded-2xl shadow mb-6">
        <div className="grid gap-3">

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="✨ Title"
            className="p-2 rounded-lg border"
          />

          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="🔗 Link"
            className="p-2 rounded-lg border"
          />

          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="📂 Category"
            className="p-2 rounded-lg border"
          />

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="📝 Note"
            className="p-2 rounded-lg border"
          />

          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-purple-500 to-pink-400 text-white py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            {editId ? "Update Link" : "Add Link"}
          </button>
        </div>
      </div>

      {/* LINKS LIST */}
      <div className="grid md:grid-cols-3 gap-4">
        {links.map(link => (
          <div
            key={link._id}
            className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition"
          >
            <h2 className="font-bold text-purple-700">{link.title}</h2>

            <a
              href={link.url}
              target="_blank"
              className="text-blue-500 text-sm break-all"
            >
              {link.url}
            </a>

            <p className="text-sm text-gray-500 mt-1">
              📂 {link.category}
            </p>

            <p className="text-sm mt-2">{link.note}</p>

            <div className="flex gap-3 mt-3">
              <button
                onClick={() => editLink(link)}
                className="text-blue-500"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={() => deleteLink(link._id)}
                className="text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}