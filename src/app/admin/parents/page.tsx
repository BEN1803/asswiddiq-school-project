"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  UserCog,
  Mail,
  Phone,
  Home,
  Users,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  User,
} from "lucide-react";

type Student = {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
};

type Parent = {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  relationshipToStudent: string;
  students?: Student[];
};

const ITEMS_PER_PAGE = 8;

const emptyForm = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  relationshipToStudent: "",
};

const RELATIONSHIP_OPTIONS = [
  "Father",
  "Mother",
  "Guardian",
  "Grandparent",
  "Other",
];

export default function ParentsPage() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState(emptyForm);

  const fetchParents = useCallback(async () => {
    if (!API) {
      setError("NEXT_PUBLIC_API_URL is missing");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/parents`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to load parents");
      }

      const data = await res.json();

      const normalized: Parent[] = (Array.isArray(data) ? data : []).map(
        (p: Parent) => ({
          ...p,
          students: Array.isArray(p.students) ? p.students : [],
        })
      );

      setParents(normalized);
    } catch (err) {
      console.error("Error fetching parents:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load parents from server"
      );
    } finally {
      setLoading(false);
    }
  }, [API]);

  useEffect(() => {
    fetchParents();
  }, [fetchParents]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!API) {
      setError("NEXT_PUBLIC_API_URL is missing");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        relationshipToStudent: form.relationshipToStudent.trim(),
      };

      const url =
        editId !== null
          ? `${API}/parents/${editId}`
          : `${API}/parents`;

      const method = editId !== null ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Failed to save parent");
      }

      const saved: Parent = await res.json();

      const normalizedSaved: Parent = {
        ...saved,
        students: Array.isArray(saved.students) ? saved.students : [],
      };

      if (editId !== null) {
        setParents((prev) =>
          prev.map((p) => (p.id === normalizedSaved.id ? normalizedSaved : p))
        );
      } else {
        setParents((prev) => [normalizedSaved, ...prev]);
      }

      setForm(emptyForm);
      setEditId(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving parent:", err);

      setError(
        err instanceof Error ? err.message : "Failed to save parent"
      );
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();

    return parents.filter((p) => {
      const searchable = [
        p.fullName,
        p.phone,
        p.email,
        p.address,
        p.relationshipToStudent,
        ...(p.students || []).map(
          (s) => `${s.firstName} ${s.lastName} ${s.studentId}`
        ),
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(keyword);
    });
  }, [parents, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / ITEMS_PER_PAGE)
  );

  const activePage = Math.min(currentPage, totalPages);

  const showingStart = filtered.length
    ? (activePage - 1) * ITEMS_PER_PAGE + 1
    : 0;

  const showingEnd = Math.min(
    activePage * ITEMS_PER_PAGE,
    filtered.length
  );

  const paginated = filtered.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE
  );

  const handleEdit = (parent: Parent) => {
    setForm({
      fullName: parent.fullName || "",
      phone: parent.phone || "",
      email: parent.email || "",
      address: parent.address || "",
      relationshipToStudent:
        parent.relationshipToStudent || "",
    });

    setEditId(parent.id);
    setError("");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!API) {
      setError("NEXT_PUBLIC_API_URL is missing");
      return;
    }

    const confirmed = confirm(
      "Are you sure you want to delete this parent? This will also remove them from all associated students."
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`${API}/parents/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete parent");
      }

      setParents((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting parent:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete parent"
      );
    }
  };

  const openAddModal = () => {
    setForm(emptyForm);
    setEditId(null);
    setError("");
    setIsModalOpen(true);
  };

  const withStudentsCount = parents.filter(
    (p) => p.students && p.students.length > 0
  ).length;

  const withoutStudentsCount = parents.filter(
    (p) => !p.students || p.students.length === 0
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-cyan-50/20 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Portal
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Parents Management
            </h1>

            <p className="mt-2 max-w-2xl text-base text-slate-600">
              Manage parent and guardian information.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3.5 font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:scale-[1.02] active:scale-95 sm:w-auto"
          >
            <Plus className="h-5 w-5" />
            <span>Add Parent</span>
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-red-50/50 p-4 text-sm text-red-600 font-medium">
            {error}
          </div>
        )}

        {/* STATS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total Parents
                </p>
                <p className="mt-3 text-4xl font-bold text-slate-900">
                  {parents.length}
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30">
                <UserCog className="h-7 w-7" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  With Students
                </p>
                <p className="mt-3 text-4xl font-bold text-emerald-600">
                  {withStudentsCount}
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30">
                <Users className="h-7 w-7" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)]">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.03] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Without Students
                </p>
                <p className="mt-3 text-4xl font-bold text-amber-600">
                  {withoutStudentsCount}
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30">
                <Users className="h-7 w-7" />
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.03] to-transparent" />
            <div className="relative space-y-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search parents..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-10 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                />
                {search && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setCurrentPage(1);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    title="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        {loading && parents.length === 0 ? (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 text-slate-600">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="font-medium">
                Loading parents...
              </span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <UserCog className="h-8 w-8" />
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
              {search ? "No matching parents" : "No parents yet"}
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
              {search
                ? "Try another name, phone, email, or relationship."
                : "Add your first parent to begin managing guardians."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-2xl border-0 bg-white shadow-lg shadow-slate-200/50 md:block">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Parent</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Contact</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Relationship</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Students</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((parent) => (
                      <tr key={parent.id} className="group border-t border-slate-100 transition-colors hover:bg-slate-50/70">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{parent.fullName}</p>
                              <p className="text-sm text-slate-500">{parent.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone className="h-3.5 w-3.5 text-slate-400" />
                              {parent.phone}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Home className="h-3.5 w-3.5 text-slate-400" />
                              {parent.address}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                            {parent.relationshipToStudent}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {parent.students && parent.students.length > 0 ? (
                            <div className="space-y-1">
                              {parent.students.slice(0, 2).map((student) => (
                                <div key={student.id} className="text-sm text-slate-600">
                                  {student.firstName} {student.lastName}
                                  <span className="ml-1 text-xs text-slate-400">({student.studentId})</span>
                                </div>
                              ))}
                              {parent.students.length > 2 && (
                                <p className="text-xs text-slate-400">
                                  +{parent.students.length - 2} more
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400">No students</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(parent)}
                              className="rounded-lg bg-blue-50 p-2 text-blue-600 transition-all hover:bg-blue-100 hover:text-blue-700"
                              title="Edit parent"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(parent.id)}
                              className="rounded-lg bg-red-50 p-2 text-red-600 transition-all hover:bg-red-100 hover:text-red-700"
                              title="Delete parent"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-6 py-4">
                <p className="text-sm text-slate-500">
                  Showing {showingStart}-{showingEnd} of {filtered.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 md:hidden">
              {paginated.map((parent) => (
                <div
                  key={parent.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{parent.fullName}</p>
                        <p className="text-sm text-slate-500">{parent.relationshipToStudent}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(parent)}
                        className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(parent.id)}
                        className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="h-4 w-4 text-slate-400" />
                      {parent.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="h-4 w-4 text-slate-400" />
                      {parent.phone}
                    </div>
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                      <Home className="h-4 w-4 text-slate-400" />
                      {parent.address}
                    </div>
                  </div>

                  {parent.students && parent.students.length > 0 && (
                    <div className="mt-3 border-t border-slate-100 pt-3">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Students ({parent.students.length})
                      </p>
                      <div className="space-y-1">
                        {parent.students.map((student) => (
                          <div key={student.id} className="text-sm text-slate-600">
                            {student.firstName} {student.lastName}
                            <span className="ml-1 text-xs text-slate-400">({student.studentId})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* PAGINATION FOOTER */}
        {filtered.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  if (totalPages <= 5) return true;
                  if (page === 1 || page === totalPages) return true;
                  if (Math.abs(page - currentPage) <= 1) return true;
                  return false;
                })
                .map((page, idx, arr) => {
                  if (idx > 0 && arr[idx - 1] !== page - 1) {
                    return (
                      <span key={`ellipsis-${page}`} className="px-2 text-slate-400">
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[40px] rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                          : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-black/50 to-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10">

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-50/80 px-8 py-5 backdrop-blur-md">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {editId ? "Edit Parent" : "Add Parent"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 transition-all hover:bg-slate-200 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-8">
              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="group">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Relationship</label>
                  <select
                    name="relationshipToStudent"
                    value={form.relationshipToStudent}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">Select relationship</option>
                    {RELATIONSHIP_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="group">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="group md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Address</label>
                  <div className="relative">
                    <Home className="absolute left-3.5 top-3 text-slate-400" />
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Enter full address"
                      rows={2}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 resize-none"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-red-50/50 p-4 text-sm text-red-600 font-medium">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-slate-700 font-medium transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:from-blue-600 disabled:hover:to-purple-600 active:scale-95"
                >
                  {loading ? "Saving..." : editId ? "Update Parent" : "Save Parent"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
