"use client";

import { useEffect, useState, useMemo } from "react";
import { Plus, Search, Edit, Trash2, X, BookOpen } from "lucide-react";

type Subject = {
  id: number;
  name: string;
  className?: string;
  classEntity?: {
    id: number;
    name: string;
  } | null;
};

type ClassItem = {
  id: number;
  name: string;
};

export default function SubjectsPage() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [name, setName] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const subjectsRes = await fetch(`${API}/subjects`);
        if (subjectsRes.ok) setSubjects(await subjectsRes.json());
        const classesRes = await fetch(`${API}/classes`);
        if (classesRes.ok) setClasses(await classesRes.json());
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    loadData();
  }, [API]);

  const filtered = useMemo(() => {
    return subjects.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [subjects, search]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError("");

    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API}/subjects/${editId}` : `${API}/subjects`;

    try {
      const payload: { name: string; classEntity?: { id: number } } = {
        name: name.trim(),
      };
      if (selectedClassId) {
        payload.classEntity = { id: Number(selectedClassId) };
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      setName("");
      setSelectedClassId("");
      setEditId(null);
      setIsModalOpen(false);

      const res2 = await fetch(`${API}/subjects`);
      if (res2.ok) setSubjects(await res2.json());
    } catch {
      setError("Failed to save subject");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;
    try {
      await fetch(`${API}/subjects/${id}`, { method: "DELETE" });
      const res = await fetch(`${API}/subjects`);
      if (res.ok) setSubjects(await res.json());
    } catch {
      console.error("Error deleting subject");
    }
  };

  const openAddModal = () => {
    setName("");
    setSelectedClassId("");
    setEditId(null);
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (s: Subject) => {
    setName(s.name);
    setEditId(s.id);
    // Resolve class ID from classEntity (nested) or className (flat string)
    let classId: string | undefined = s.classEntity?.id?.toString();
    if (!classId && s.className) {
      classId = classes.find((c) => c.name === s.className)?.id?.toString();
    }
    setSelectedClassId(classId || "");
    setError("");
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-blue-900">
              Subjects Management
            </h1>
            <p className="text-slate-600 mt-1">
              Manage school subjects and class assignments
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl shadow-blue-500/25 font-medium active:scale-95 w-full lg:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subject</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-all">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Total Subjects</p>
            <p className="text-2xl font-bold text-blue-600">{subjects.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-all">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Available Classes</p>
            <p className="text-2xl font-bold text-emerald-600">{classes.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-all">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Filtered</p>
            <p className="text-2xl font-bold text-violet-600">{filtered.length}</p>
          </div>
        </div>

        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            placeholder="Search subjects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-slate-400"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              {search ? "No matching subjects" : "No subjects yet"}
            </h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              {search
                ? "Try adjusting your search"
                : "Click 'Add Subject' to create your first subject"}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-blue-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      Subject Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      Assigned Class
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-medium text-slate-900">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {(() => {
                          const className = s.className || s.classEntity?.name;
                          return className ? (
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                              {className}
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-slate-100 text-slate-400 rounded text-xs">
                              Unassigned
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(s)}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden space-y-3">
              {filtered.map((s) => (
                <div key={s.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900 truncate">{s.name}</h3>
                        <p className="text-xs text-slate-500 mt-1 truncate">
                          {s.className || s.classEntity?.name || "Unassigned"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <button
                        onClick={() => openEditModal(s)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {editId !== null ? "Edit Subject" : "Add New Subject"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subject Name *
                </label>
                <input
                  placeholder="e.g. Mathematics, Physics, Chemistry"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Assign to Class
                </label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">Select Class (optional)</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : editId !== null ? "Update Subject" : "Save Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
