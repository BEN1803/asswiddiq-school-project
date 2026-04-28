"use client";

import { useState, FormEvent, ChangeEvent } from "react";

const classOptions = [
  "Nursery",
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
];

const subjectOptions = [
  "Math",
  "English",
  "Science",
  "Kiswahili",
  "Geography",
  "History",
];

interface StudentForm {
  studentId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  className: string;
  subjects: string[];
  phone: string;
  parentName: string;
  email: string;
  address: string;
}

export default function StudentPage() {
  const [students, setStudents] = useState<StudentForm[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [form, setForm] = useState<StudentForm>({
    studentId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    className: "",
    subjects: [],
    phone: "",
    parentName: "",
    email: "",
    address: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleSubject = (subject: string) => {
    setForm((prev) => {
      const exists = prev.subjects.includes(subject);
      return {
        ...prev,
        subjects: exists
          ? prev.subjects.filter((s) => s !== subject)
          : [...prev.subjects, subject],
      };
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editIndex !== null) {
      const updated = [...students];
      updated[editIndex] = form;
      setStudents(updated);
      setEditIndex(null);
    } else {
      setStudents([...students, form]);
    }

    setForm({
      studentId: "",
      firstName: "",
      middleName: "",
      lastName: "",
      className: "",
      subjects: [],
      phone: "",
      parentName: "",
      email: "",
      address: "",
    });

    setIsModalOpen(false);
    validateCurrentPage();
  };

  const handleEdit = (studentId: string) => {
    const index = students.findIndex((s) => s.studentId === studentId);
    if (index !== -1) {
      setForm(students[index]);
      setEditIndex(index);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (studentId: string) => {
    setStudents(students.filter((s) => s.studentId !== studentId));
    validateCurrentPage();
  };

  const filtered = students.filter((s) =>
    `${s.firstName} ${s.lastName} ${s.studentId}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const validateCurrentPage = () => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">
              Student Management
            </h1>
            <p className="text-slate-600 mt-1">
              Register and manage students
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <input
              className="border border-slate-300 bg-white text-slate-900 p-2.5 rounded-lg w-full md:w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-slate-400"
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />

            <button
              onClick={() => {
                setEditIndex(null);
                setForm({
                  studentId: "",
                  firstName: "",
                  middleName: "",
                  lastName: "",
                  className: "",
                  subjects: [],
                  phone: "",
                  parentName: "",
                  email: "",
                  address: "",
                });
                setIsModalOpen(true);
              }}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium shadow-md whitespace-nowrap active:scale-95"
            >
              + Add Student
            </button>
          </div>
        </div>

        {/* STATS BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-lg shadow border border-slate-200">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Total Students</p>
            <p className="text-xl font-bold text-blue-600">{students.length}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow border border-slate-200">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Filtered</p>
            <p className="text-xl font-bold text-emerald-600">{filtered.length}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow border border-slate-200">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Showing</p>
            <p className="text-xl font-bold text-blue-600">{paginatedData.length}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow border border-slate-200">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Pages</p>
            <p className="text-xl font-bold text-violet-600">{totalPages}</p>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow-lg rounded-xl overflow-x-auto border border-slate-200">
        {paginatedData.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <p className="text-lg font-medium">No students found</p>
            <p className="text-sm mt-2">
              {search
                ? "Try adjusting your search criteria"
                : "Click '+ Add Student' to register your first student"}
            </p>
          </div>
        ) : (
           <table className="w-full text-sm">
             <thead className="bg-blue-600 text-white">
               <tr>
                 <th className="p-4 text-left font-semibold">ID</th>
                 <th className="p-4 text-left font-semibold">Name</th>
                 <th className="p-4 text-left font-semibold">Class</th>
                 <th className="p-4 text-left font-semibold">Subjects</th>
                 <th className="p-4 text-left font-semibold">Phone</th>
                 <th className="p-4 text-left font-semibold">Parent</th>
                 <th className="p-4 text-left font-semibold">Email</th>
                 <th className="p-4 text-left font-semibold">Actions</th>
               </tr>
             </thead>

            <tbody>
              {paginatedData.map((s) => (
                <tr
                  key={s.studentId}
                  className="border-b border-slate-200 hover:bg-blue-50 transition-colors"
                >
                  <td className="p-4 font-mono text-slate-700">{s.studentId}</td>
                  <td className="p-4 font-medium text-slate-900">
                    {s.firstName} {s.middleName} {s.lastName}
                  </td>
                   <td className="p-4">
                     <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                       {s.className}
                     </span>
                   </td>
                   <td className="p-4">
                     <div className="flex flex-wrap gap-1">
                       {s.subjects.map((sub) => (
                         <span
                           key={sub}
                           className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                         >
                           {sub}
                         </span>
                       ))}
                     </div>
                   </td>
                  <td className="p-4">
                    <a
                      href={`tel:${s.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {s.phone}
                    </a>
                  </td>
                  <td className="p-4 text-slate-600">{s.parentName}</td>
                  <td className="p-4">
                    <a
                      href={`mailto:${s.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {s.email}
                    </a>
                  </td>
                   <td className="p-4">
                     <div className="flex gap-2">
                       <button
                         onClick={() => handleEdit(s.studentId)}
                         className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition font-medium text-xs active:scale-95"
                       >
                         Edit
                       </button>

                      <button
                        onClick={() => handleDelete(s.studentId)}
                        className="bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 transition font-medium text-xs active:scale-95"
                      >
                        Delete
                      </button>
                     </div>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      {filtered.length > 0 && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 bg-white p-4 rounded-xl shadow-md border border-slate-200">
          <div className="text-sm text-slate-600">
            Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length} student
            {filtered.length !== 1 ? "s" : ""}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-blue-50 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const isActive = page === currentPage;
              const isVisible =
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1);

              if (!isVisible && page !== currentPage - 2 && page !== currentPage + 2)
                return null;

              if (!isVisible && (page === currentPage - 2 || page === currentPage + 2)) {
                return (
                  <span key={page} className="px-2 text-slate-400">
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg font-medium text-sm transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "border border-slate-300 text-slate-700 hover:bg-blue-50 hover:border-blue-200"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-blue-50 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm"
            >
              Next
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const isActive = page === currentPage;
              const isVisible =
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1);

              if (!isVisible && page !== currentPage - 2 && page !== currentPage + 2)
                return null;

              if (!isVisible && (page === currentPage - 2 || page === currentPage + 2)) {
                return (
                  <span key={page} className="px-2 text-slate-400">
                    ...
                  </span>
                );
              }

               return (
                 <button
                   key={page}
                   onClick={() => handlePageChange(page)}
                   className={`w-10 h-10 rounded-lg font-medium text-sm transition ${
                     isActive
                       ? "bg-blue-600 text-white shadow-md"
                       : "border border-slate-300 text-slate-700 hover:bg-blue-50 hover:border-blue-200"
                   }`}
                 >
                   {page}
                 </button>
               );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-blue-900">
                {editIndex !== null ? "Edit Student" : "Add New Student"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition text-2xl font-light"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="studentId"
                  placeholder="Student ID *"
                  value={form.studentId}
                  onChange={handleChange}
                  required
                  className="border border-slate-300 bg-white text-slate-900 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-slate-400"
                />

                <select
                  name="className"
                  value={form.className}
                  onChange={handleChange}
                  required
                  className="border border-slate-300 bg-white text-slate-900 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">Select Class *</option>
                  {classOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  name="firstName"
                  placeholder="First Name *"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="border border-slate-300 bg-white text-slate-900 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-slate-400"
                />
                <input
                  name="middleName"
                  placeholder="Middle Name"
                  value={form.middleName}
                  onChange={handleChange}
                  className="border border-slate-300 bg-white text-slate-900 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-slate-400"
                />
                <input
                  name="lastName"
                  placeholder="Last Name *"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="border border-slate-300 bg-white text-slate-900 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="phone"
                  placeholder="Phone Number *"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="border border-slate-300 bg-white text-slate-900 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-slate-400"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address *"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="border border-slate-300 bg-white text-slate-900 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="parentName"
                  placeholder="Parent/Guardian Name *"
                  value={form.parentName}
                  onChange={handleChange}
                  required
                  className="border border-slate-300 bg-white text-slate-900 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-slate-400"
                />
              </div>

              <textarea
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                className="border border-slate-300 bg-white text-slate-900 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition w-full placeholder:text-slate-400"
              />

              {/* SUBJECTS */}
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="font-semibold text-blue-900 mb-3 text-sm uppercase tracking-wider">
                  Subjects
                </p>
                <div className="flex flex-wrap gap-2">
                  {subjectOptions.map((sub) => (
                    <button
                      type="button"
                      key={sub}
                      onClick={() => toggleSubject(sub)}
                      className={`px-4 py-2 border rounded-lg transition font-medium text-sm ${
                        form.subjects.includes(sub)
                          ? "bg-sky-500 text-white border-sky-500 shadow-md"
                          : "bg-white text-slate-700 border-slate-300 hover:border-sky-400"
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
                {form.subjects.length === 0 && (
                  <p className="text-xs text-amber-600 mt-2">
                    At least one subject should be selected
                  </p>
                )}
              </div>

               <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                 <button
                   type="button"
                   onClick={() => setIsModalOpen(false)}
                   className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium"
                 >
                   Cancel
                 </button>

                 <button
                   type="submit"
                   className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md active:scale-95"
                 >
                   {editIndex !== null ? "Update Student" : "Save Student"}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}