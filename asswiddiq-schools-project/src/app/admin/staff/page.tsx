"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";

type ClassAssignment = {
  class: string;
  subjects: string[];
};

type StaffMember = {
  staffId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  title: string;
  phone: string;
  email: string;
  address: string;
  classAssignments: ClassAssignment[];
};

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

const initialFormState: StaffMember = {
  staffId: "",
  firstName: "",
  middleName: "",
  lastName: "",
  title: "",
  phone: "",
  email: "",
  address: "",
  classAssignments: [],
};

export default function StaffPage() {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [form, setForm] = useState<StaffMember>(initialFormState);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as keyof StaffMember;
    setForm((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const addClassAssignment = (className: string) => {
    if (!form.classAssignments.some((a) => a.class === className)) {
      setForm((prev) => ({
        ...prev,
        classAssignments: [...prev.classAssignments, { class: className, subjects: [] }],
      }));
    }
  };

  const removeClassAssignment = (className: string) => {
    setForm((prev) => ({
      ...prev,
      classAssignments: prev.classAssignments.filter((a) => a.class !== className),
    }));
  };

  const toggleSubjectForClass = (className: string, subject: string) => {
    setForm((prev) => ({
      ...prev,
      classAssignments: prev.classAssignments.map((assignment) => {
        if (assignment.class === className) {
          const exists = assignment.subjects.includes(subject);
          return {
            ...assignment,
            subjects: exists
              ? assignment.subjects.filter((s) => s !== subject)
              : [...assignment.subjects, subject],
          };
        }
        return assignment;
      }),
    }));
  };

  const getStaffClasses = (staff: StaffMember) => {
    return staff.classAssignments.map((a) => a.class);
  };

  const getStaffSubjects = (staff: StaffMember) => {
    return [...new Set(staff.classAssignments.flatMap((a) => a.subjects))];
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editIndex !== null) {
      const updated = [...staffList];
      updated[editIndex] = form;
      setStaffList(updated);
      setEditIndex(null);
    } else {
      setStaffList([...staffList, form]);
    }

    setForm(initialFormState);
    setIsModalOpen(false);
  };

  const handleEdit = (staffId: string) => {
    const index = staffList.findIndex((s) => s.staffId === staffId);
    if (index !== -1) {
      const existing = staffList[index];
      const legacy = existing as StaffMember & { classes?: string[]; subjects?: string[] };
      const staffData: StaffMember = legacy.classes
        ? {
            staffId: legacy.staffId,
            firstName: legacy.firstName,
            middleName: legacy.middleName,
            lastName: legacy.lastName,
            title: legacy.title,
            phone: legacy.phone,
            email: legacy.email,
            address: legacy.address,
            classAssignments: legacy.classes.map((c) => ({
              class: c,
              subjects: legacy.subjects ?? [],
            })),
          }
        : {
            ...existing,
            classAssignments: existing.classAssignments ?? [],
          };

      setForm(staffData);
      setEditIndex(index);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (staffId: string) => {
    setStaffList(staffList.filter((s) => s.staffId !== staffId));
  };

  const filtered = staffList.filter((s) =>
    `${s.firstName} ${s.lastName} ${s.staffId}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const displayPage = filtered.length === 0 ? 1 : Math.min(currentPage, totalPages);
  const startIndex = (displayPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* HEADER */}
       <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-600">
                Asswiddiq Schools Staff
              </h1>
              <p className="text-slate-600 mt-1">
                Manage teachers and staff members
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
                  setForm(initialFormState);
                  setIsModalOpen(true);
                }}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium shadow-md whitespace-nowrap active:scale-95"
>
                + Add Staff
              </button>
            </div>
          </div>

          {/* STATS BAR */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-lg shadow border border-slate-200">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Total Staff</p>
              <p className="text-xl font-bold text-blue-600">{staffList.length}</p>
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
            <p className="text-lg font-medium">No staff members found</p>
            <p className="text-sm mt-2">
              {search
                ? "Try adjusting your search criteria"
                : "Click '+ Add Staff' to add your first staff member"}
            </p>
          </div>
        ) : (
           <table className="w-full text-sm">
             <thead className="bg-blue-600 text-white">
               <tr>
                 <th className="p-4 text-left font-semibold">ID</th>
                 <th className="p-4 text-left font-semibold">Name</th>
                 <th className="p-4 text-left font-semibold">Title</th>
                 <th className="p-4 text-left font-semibold">Phone</th>
                 <th className="p-4 text-left font-semibold">Email</th>
                 <th className="p-4 text-left font-semibold">Classes</th>
                 <th className="p-4 text-left font-semibold">Subjects</th>
                 <th className="p-4 text-left font-semibold">Actions</th>
               </tr>
             </thead>

            <tbody>
              {paginatedData.map((s) => (
                <tr
                  key={s.staffId}
                  className="border-b border-slate-200 hover:bg-blue-50 transition-colors"
                >
                  <td className="p-4 font-mono text-slate-700">{s.staffId}</td>
                  <td className="p-4 font-medium text-slate-900">
                    {s.firstName} {s.middleName} {s.lastName}
                  </td>
                  <td className="p-4 text-slate-600">{s.title}</td>
                  <td className="p-4">
                    <a
                      href={`tel:${s.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {s.phone}
                    </a>
                  </td>
                  <td className="p-4">
                    <a
                      href={`mailto:${s.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {s.email}
                    </a>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      {getStaffClasses(s).length > 0 ? (
                        getStaffClasses(s).map((className) => {
                          const assignment = s.classAssignments.find((a) => a.class === className);
                          const subjects = assignment?.subjects || [];
                          return (
                            <div key={className} className="text-xs">
                              <span className="font-semibold text-slate-700">{className}</span>
                              {subjects.length > 0 && (
                                <span className="text-slate-500 ml-1">
                                  ({subjects.join(", ")})
                                </span>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <span className="text-slate-400 text-xs">None assigned</span>
                      )}
                    </div>
                  </td>
                   <td className="p-4">
                     <div className="flex flex-wrap gap-1">
                       {getStaffSubjects(s).map((sub) => (
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(s.staffId)}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition font-medium text-xs active:scale-95"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(s.staffId)}
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
            Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length} staff member
            {filtered.length !== 1 ? "s" : ""}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(displayPage - 1)}
              disabled={displayPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-blue-50 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const isActive = page === displayPage;
              const isVisible =
                page === 1 ||
                page === totalPages ||
                (page >= displayPage - 1 && page <= displayPage + 1);

              if (!isVisible && page !== displayPage - 2 && page !== displayPage + 2)
                return null;

              if (!isVisible && (page === displayPage - 2 || page === displayPage + 2)) {
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
              onClick={() => handlePageChange(displayPage + 1)}
              disabled={displayPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-blue-50 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm"
            >
              Next
            </button>

             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
               const isActive = page === displayPage;
               const isVisible =
                 page === 1 ||
                 page === totalPages ||
                 (page >= displayPage - 1 && page <= displayPage + 1);

               if (!isVisible && page !== displayPage - 2 && page !== displayPage + 2)
                 return null;

               if (!isVisible && (page === displayPage - 2 || page === displayPage + 2)) {
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
              onClick={() => handlePageChange(displayPage + 1)}
              disabled={displayPage === totalPages}
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
          <div className="bg-white w-full max-w-3xl rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-blue-900">
                {editIndex !== null ? "Edit Staff Member" : "Add New Staff"}
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
                  name="staffId"
                  placeholder="Staff ID *"
                  value={form.staffId}
                  onChange={handleChange}
                  required
                  className="border border-slate-300 bg-white text-slate-900 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-slate-400"
                />

                <input
                  name="title"
                  placeholder="Title *"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="border border-slate-300 bg-white text-slate-900 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-slate-400"
                />
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

              <textarea
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                className="border border-slate-300 bg-white text-slate-900 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition w-full placeholder:text-slate-400"
              />

              {/* CLASS & SUBJECT ASSIGNMENTS */}
              <div className="bg-slate-50 p-4 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-blue-900 text-sm uppercase tracking-wider">
                    Class & Subject Assignments
                  </p>
                  <div className="flex gap-2">
                      <select
                        value=""
                        onChange={(e) => {
                          const selectedClass = e.target.value;
                          if (selectedClass && !form.classAssignments.some((a) => a.class === selectedClass)) {
                            addClassAssignment(selectedClass);
                          }
                          e.target.value = "";
                        }}
                        className="border border-slate-300 bg-white text-slate-900 px-3 py-1.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                      >
                      <option value="" disabled>
                        Add class...
                      </option>
                      {classOptions
                        .filter((c) => !form.classAssignments.some((a) => a.class === c))
                        .map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {form.classAssignments.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">
                    No classes assigned. Select a class above to add assignments.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {form.classAssignments.map((assignment) => (
                      <div
                        key={assignment.class}
                        className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-slate-800 text-sm">
                              {assignment.class}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeClassAssignment(assignment.class)}
                              className="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {subjectOptions.map((subject) => {
                            const isSelected = assignment.subjects.includes(subject);
                            return (
                              <button
                                type="button"
                                key={subject}
                                onClick={() => toggleSubjectForClass(assignment.class, subject)}
                                 className={`px-3 py-1.5 border rounded-lg transition text-sm font-medium ${
                                   isSelected
                                     ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                     : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"
                                 }`}
                               >
                                {subject}
                              </button>
                            );
                          })}
                        </div>
                        {assignment.subjects.length === 0 && (
                          <p className="text-xs text-amber-600 mt-2">
                            No subjects assigned for this class
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 bg-slate-400 text-white rounded-lg hover:bg-slate-500 transition font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md active:scale-95"
                >
                  {editIndex !== null ? "Update Staff" : "Save Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}