"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Plus, Search, Edit, Trash2, X, AlertCircle } from "lucide-react";

type ClassItem = {
  id: number;
  name: string;
};

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [form, setForm] = useState<{ name: string }>({ name: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API = process.env.NEXT_PUBLIC_API_URL;

  const fetchClasses = useCallback(async () => {
    try {
      const res = await fetch(`${API}/classes`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setClasses(data);
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError("Failed to load classes from server");
    }
  }, [API]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const filtered = useMemo(() => {
    return classes.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [classes, search]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setLoading(true);
    setError("");

    try {
      const url = editId !== null ? `${API}/classes/${editId}` : `${API}/classes`;
      const method = editId !== null ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name }),
      });

      if (!res.ok) throw new Error("Failed to save");

      setForm({ name: "" });
      setEditId(null);
      setIsModalOpen(false);
      fetchClasses();
    } catch (err) {
      setError("Failed to save class");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cls: ClassItem) => {
    setForm({ name: cls.name });
    setEditId(cls.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this class?")) return;
    try {
      await fetch(`${API}/classes/${id}`, { method: "DELETE" });
      fetchClasses();
    } catch (err) {
      console.error("Error deleting class:", err);
    }
  };

  const openAddModal = () => {
    setForm({ name: "" });
    setEditId(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-blue-900">
              Classes Management
            </h1>
            <p className="text-slate-600 mt-1">
              Manage school classes and their details
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl shadow-blue-500/25 font-medium active:scale-95 w-full lg:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Class</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-all">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Total Classes</p>
            <p className="text-2xl font-bold text-blue-600">{classes.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-all">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Filtered</p>
            <p className="text-2xl font-bold text-emerald-600">{filtered.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-all">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Showing</p>
            <p className="text-2xl font-bold text-violet-600">{filtered.length}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            placeholder="Search classes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-slate-400"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              {search ? "No matching classes" : "No classes yet"}
            </h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              {search
                ? "Try adjusting your search"
                : "Click 'Add Class' to create your first class"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-blue-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((cls) => (
                    <tr key={cls.id} className="hover:bg-slate-50/80 transition-colors group">
                      
                      <td className="px-6 py-4 font-medium text-slate-900">{cls.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(cls)}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:scale-95"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cls.id)}
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-95"
                            title="Delete"
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
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {editId !== null ? "Edit Class" : "Add New Class"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Class Name *
                </label>
                <input
                  placeholder="e.g. Class 1, Nursery A"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-slate-400"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
              )}

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
                  {loading ? "Saving..." : editId !== null ? "Update Class" : "Save Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}