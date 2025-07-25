import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CloudArrowUpIcon,
  FolderIcon,
  TrashIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

function App() {
  const [role, setRole] = useState("user");
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedResume, setSelectedResume] = useState("");
  const [results, setResults] = useState([]);

  // Whenever role changes: clear query/results and reset to "All Resumes"
  useEffect(() => {
    setQuery("");
    setResults([]);
    setSelectedResume("");
    fetchFiles();
  }, [role]);

  // Fetch list of files (resumes)
  const fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:8000/files/", {
        headers: { "x-role": role },
      });
      setFiles(res.data.files);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a file");
    try {
      const form = new FormData();
      form.append("file", file);
      await axios.post("http://localhost:8000/upload/", form, {
        headers: { "x-role": role, "Content-Type": "multipart/form-data" },
      });
      setFile(null);
      fetchFiles();
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleDownload = (fname) =>
    window.open(`http://localhost:8000/download/${fname}`, "_blank");

  const handleDelete = async (fname) => {
    try {
      await axios.delete(`http://localhost:8000/delete/${fname}`, {
        headers: { "x-role": role },
      });
      fetchFiles();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleQuery = async () => {
    if (!query.trim()) return;
    try {
      const form = new URLSearchParams();
      form.append("query", query);
      if (selectedResume) form.append("filename", selectedResume);
      const res = await axios.post("http://localhost:8000/query/", form);
      setResults(res.data.results);
    } catch (err) {
      console.error("Query failed:", err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-white via-blue-50 to-indigo-50">
      <header className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-5xl font-extrabold text-indigo-700 mb-2">
          Resume Search
        </h1>
        <p className="text-lg text-indigo-500">
          Upload, manage & query candidate resumes with ease
        </p>
      </header>

      <main className="max-w-3xl mx-auto space-y-8">
        {/* Role Selector */}
        <div className="flex justify-end">
          <select
            className="border rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            value={role}
            onChange={(e) => {
              const picked = e.target.value;
              if (picked === "admin") {
                const pwd = window.prompt("Enter admin password:");
                if (pwd === "adminpass") {
                  setRole("admin");
                } else {
                  alert("Wrong password — staying as User.");
                  setRole("user");
                }
              } else {
                setRole("user");
              }
            }}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Admin Panel */}
        {role === "admin" && (
          <section className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-400">
            <div className="flex items-center mb-4">
              <CloudArrowUpIcon className="w-5 h-5 text-indigo-500 mr-2" />
              <h2 className="text-xl font-semibold text-indigo-700">
                Upload Resume
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="text-gray-700"
              />
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Upload
              </button>
            </div>

            <div className="mt-6">
              <div className="flex items-center mb-2">
                <FolderIcon className="w-5 h-5 text-green-500 mr-2" />
                <h3 className="text-lg font-semibold text-green-700">
                  Manage Resumes
                </h3>
              </div>
              <ul className="space-y-2">
                {files.map((f) => (
                  <li
                    key={f}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm"
                  >
                    <span className="text-gray-800">{f}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDownload(f)}
                        className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition"
                      >
                        <DocumentTextIcon className="w-5 h-5 text-green-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(f)}
                        className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition"
                      >
                        <TrashIcon className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Query Panel */}
        <section className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-400">
          <div className="flex items-center mb-4">
            <MagnifyingGlassIcon className="w-5 h-5 text-purple-500 mr-2" />
            <h2 className="text-xl font-semibold text-purple-700">
              Query Resumes
            </h2>
          </div>
          <select
            className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-300"
            value={selectedResume}
            onChange={(e) => {
              setSelectedResume(e.target.value);
              // clear query & results on resume switch
              setQuery("");
              setResults([]);
            }}
          >
            <option value="">— All Resumes —</option>
            {files.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <div className="flex space-x-3">
            <input
              type="text"
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Type your question..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              onClick={handleQuery}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Search
            </button>
          </div>
          {results.length > 0 && (
            <div className="mt-4 space-y-2">
              {results.map((r, i) => (
                <div
                  key={i}
                  className="bg-gray-100 p-4 rounded-lg shadow-sm border-l-4 border-purple-300"
                >
                  {r}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
