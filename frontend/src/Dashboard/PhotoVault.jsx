import { useState, useEffect } from "react";
import { Plus, Folder, ArrowLeft, Upload, Trash2 } from "lucide-react";

export default function PhotoVault() {
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [images, setImages] = useState([]);
  const [newFolder, setNewFolder] = useState("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  // console.log("TOKEN:", token);

  // ✅ Load folders (SAFE)
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/vault/folders/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          console.log("ERROR:", data);
          setFolders([]);
          return;
        }

        setFolders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log("FETCH ERROR:", err);
        setFolders([]);
      }
    };

    fetchFolders();
  }, [userId, token]);

  // ✅ Create folder
  const createFolder = async () => {
    if (!newFolder.trim()) return;

    try {
      const res = await fetch(
        "http://localhost:5000/api/vault/create-folder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: newFolder, userId }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error creating folder");
        return;
      }

      setFolders((prev) => [...prev, data]);
      setNewFolder("");
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Open folder
  const openFolder = async (folder) => {
    setCurrentFolder(folder);

    try {
      const res = await fetch(
        `http://localhost:5000/api/vault/folder/${folder._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert("Failed to load images");
        return;
      }

      setImages(Array.isArray(data.images) ? data.images : []);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Upload image
  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return alert("No file selected ❗");
    if (!currentFolder?._id) return alert("Select folder first ❗");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("folderId", currentFolder._id);
    formData.append("type", "vault");
    formData.append("userId", userId);
    formData.append("folderName", currentFolder.name);

    try {
      const res = await fetch(
        "http://localhost:5000/api/vault/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Upload failed");
        return;
      }

      setImages(Array.isArray(data.images) ? data.images : []);
    } catch (err) {
      console.log("UPLOAD ERROR:", err);
    }
  };

  // ✅ Delete image
  const deleteImage = async (imageId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/vault/image/${currentFolder._id}/${imageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setImages((prev) => prev.filter((img) => img._id !== imageId));
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Back handler (FIXED)
  const goBack = () => {
    setCurrentFolder(null);
    setImages([]); // 🔥 IMPORTANT
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-purple-100">

      {/* BACK */}
      {currentFolder && (
        <button
          onClick={goBack}
          className="flex items-center gap-2 mb-6 text-purple-700 font-semibold"
        >
          <ArrowLeft /> Back
        </button>
      )}

      {/* FOLDERS */}
      {!currentFolder && (
        <>
          <h1 className="text-4xl font-bold text-purple-700 mb-6">
            💜 GirlSpace Vault
          </h1>

          <div className="flex gap-3 mb-6">
            <input
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value)}
              placeholder="Enter Folder Name"
              className="border p-3 rounded-xl w-64"
            />
            <button
              onClick={createFolder}
              className="bg-purple-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <Plus size={18} /> Create
            </button>
          </div>

          {/* Empty State */}
          {folders.length === 0 && (
            <p className="text-gray-500">No folders yet 😢</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {folders.map((folder) => (
              <div
                key={folder._id}
                onClick={() => openFolder(folder)}
                className="bg-white p-5 rounded-xl shadow cursor-pointer hover:scale-105"
              >
                <Folder className="text-purple-500 mb-2" />
                <p className="font-semibold">{folder.name}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* IMAGES */}
      {currentFolder && (
        <>
          <h2 className="text-2xl font-bold text-purple-700 mb-5">
            📂 {currentFolder.name}
          </h2>

          <label className="inline-flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-xl cursor-pointer">
            <Upload size={18} /> Upload
            <input type="file" hidden onChange={handleUpload} />
          </label>

          {images.length === 0 && (
            <p className="mt-5 text-gray-500">No images yet 📷</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-6">
            {images.map((img) => (
              <div key={img._id} className="relative group">
                <img
                  src={img.url}
                  className="w-full h-40 object-cover rounded-xl"
                />

                <button
                  onClick={() => deleteImage(img._id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}