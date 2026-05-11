"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Edit,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";

// ======================
// TYPES MATCHING DTO
// ======================
type Parent = {
  id?: number;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  relationshipToStudent: string;
};

type ClassType = {
  id: number;
  name: string;
};

type SubjectType = {
  id: number;
  name: string;
  classes?: ClassType[];
};

type ParentForm = {
  id?: number;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  relationshipToStudent: string;
};

type StudentDTO = {
  studentId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  yearOfStudy: number;
  classId: number;
  subjectIds: number[];
  parentIds: number[];
  registrationStatus: "REGISTERED" | "NOT_REGISTERED";
  notRegisteredReason?: string;
};

type Student = StudentDTO & {
  id?: number;
  className?: string;
  class?: ClassType;
  currentClass?: ClassType;
};

const ITEMS_PER_PAGE = 8;

const emptyForm: StudentDTO = {
  studentId: "",
  firstName: "",
  middleName: "",
  lastName: "",
  gender: "",
  dateOfBirth: "",
  yearOfStudy: 2025,
  classId: 0,
  subjectIds: [],
  parentIds: [],
  registrationStatus: "REGISTERED",
  notRegisteredReason: "",
};

const emptyParentForm: ParentForm = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  relationshipToStudent: "",
};

export default function StudentsPage() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [subjects, setSubjects] = useState<SubjectType[]>([]);
  const [allParents, setAllParents] = useState<Parent[]>([]);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const [form, setForm] = useState<StudentDTO>(emptyForm);

  const [parent1, setParent1] = useState<ParentForm>(emptyParentForm);
  const [parent2, setParent2] = useState<ParentForm>(emptyParentForm);

  // ======================
  // COMPUTED VALUES
  // ======================
  const registeredCount = useMemo(
    () => students.filter((s) => s.registrationStatus === "REGISTERED").length,
    [students]
  );

  const notRegisteredCount = useMemo(
    () => students.filter((s) => s.registrationStatus === "NOT_REGISTERED").length,
    [students]
  );

  const filtered = useMemo(() => {
    let result = students;
    if (selectedClass) {
      result = result.filter((s) => String(s.classId) === selectedClass);
    }
    if (search) {
      const keyword = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.firstName.toLowerCase().includes(keyword) ||
          s.middleName.toLowerCase().includes(keyword) ||
          s.lastName.toLowerCase().includes(keyword) ||
          s.studentId.toLowerCase().includes(keyword)
      );
    }
    return result;
  }, [students, selectedClass, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const pageStart = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(pageStart, pageStart + ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedClass, search]);

   useEffect(() => {
     if (currentPage > totalPages) {
       setCurrentPage(totalPages);
     }
   }, [currentPage, totalPages]);

   const showingStart = filtered.length
    ? (currentPage - 1) * ITEMS_PER_PAGE + 1
    : 0;
  const showingEnd = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length);

  const getClassName = (student: Student) => {
    // First try directly embedded class objects
    if (student.class?.name) return student.class.name;
    if (student.currentClass?.name) return student.currentClass.name;
    // Then look up from classes array using classId
    if (student.classId) {
      const classObj = classes.find((c) => c.id === Number(student.classId));
      if (classObj?.name) return classObj.name;
    }
    return "Unassigned";
  };

   const filteredSubjects = useMemo(() => {
     const classId = form.classId || 0;
     if (classId === 0) return subjects;
     return subjects.filter((subject) => {
       const subjectClasses = subject.classes || [];
       return subjectClasses.some((cls) => cls.id === classId);
     });
   }, [subjects, form.classId]);

  // ======================
  // FETCH DATA
  // ======================
   const fetchData = useCallback(async () => {
     if (!API) return;

     setLoading(true);

     try {
       const [c, s, st, p] = await Promise.all([
         fetch(`${API}/classes`),
         fetch(`${API}/subjects`),
         fetch(`${API}/students`),
         fetch(`${API}/parents`),
       ]);

       if (c.ok) {
         const rawClasses = await c.json();
         const normalizedClasses = Array.isArray(rawClasses)
           ? rawClasses.map((cls: any) => ({
               ...cls,
               id: Number(cls.id),
             }))
           : [];
         setClasses(normalizedClasses);
       }
       if (s.ok) setSubjects(await s.json());
        if (st.ok) {
          const rawStudents = await st.json();
          const normalizedStudents = Array.isArray(rawStudents)
            ? rawStudents.map((stu: any) => {
                // Extract classId from direct field or embedded class object
                const classId = stu.classId ?? stu.class?.id ?? stu.currentClass?.id;
                return {
                  ...stu,
                  classId: Number(classId),
                  parentIds: (stu.parentIds || []).map((id: any) => Number(id)),
                };
              })
            : [];
          setStudents(normalizedStudents);
        }
       if (p.ok) setAllParents(await p.json());
     } catch (err) {
       console.error(err);
       setError("Failed to fetch data");
     } finally {
       setLoading(false);
     }
   }, [API]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ======================
  // HANDLE INPUTS
  // ======================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "yearOfStudy" || name === "classId"
          ? Number(value)
          : value,
    }));
  };

  // ======================
  // PARENT INPUTS
  // ======================
  const handleParentChange = (
    parent: "parent1" | "parent2",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    if (parent === "parent1") {
      setParent1((prev) => ({ ...prev, [name]: value }));
    } else {
      setParent2((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ======================
  // MULTI SELECT SUBJECTS
  // ======================
  const handleMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, (o) =>
      Number(o.value)
    );

    setForm((prev) => ({ ...prev, subjectIds: values }));
  };

  // ======================
  // EDIT STUDENT (FIXED PART 🔥)
  // ======================
   const handleEdit = (student: Student) => {
     setForm({
       studentId: student.studentId || "",
       firstName: student.firstName || "",
       middleName: student.middleName || "",
       lastName: student.lastName || "",
       gender: student.gender || "",
       dateOfBirth: student.dateOfBirth || "",
       yearOfStudy: student.yearOfStudy || 2025,
       classId: Number(student.classId) || 0,
       subjectIds: student.subjectIds || [],
       parentIds: student.parentIds || [],
       registrationStatus: student.registrationStatus || "REGISTERED",
       notRegisteredReason: student.notRegisteredReason || "",
     });

     // reset first
     setParent1(emptyParentForm);
     setParent2(emptyParentForm);

     // safely map parents - convert IDs to numbers for comparison
     const studentParentIds = (student.parentIds || []).map(Number);
     const linkedParents = allParents.filter((p) =>
       studentParentIds.includes(Number(p.id))
     );

     if (linkedParents[0]) {
       setParent1({
         id: linkedParents[0].id,
         fullName: linkedParents[0].fullName,
         phone: linkedParents[0].phone,
         email: linkedParents[0].email,
         address: linkedParents[0].address,
         relationshipToStudent: linkedParents[0].relationshipToStudent,
       });
     }

     if (linkedParents[1]) {
       setParent2({
         id: linkedParents[1].id,
         fullName: linkedParents[1].fullName,
         phone: linkedParents[1].phone,
         email: linkedParents[1].email,
         address: linkedParents[1].address,
         relationshipToStudent: linkedParents[1].relationshipToStudent,
       });
     }

     setEditId(student.id || null);
     setError("");
     setIsModalOpen(true);
   };

  // ======================
  // REST OF YOUR CODE (UNCHANGED UI)
  // ======================

  const openAddModal = () => {
    setForm(emptyForm);
    setParent1(emptyParentForm);
    setParent2(emptyParentForm);
    setEditId(null);
    setError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!API) return;

    setLoading(true);
    setError("");

    try {
      const parentsToSave = [parent1];
      if (parent2.fullName.trim()) parentsToSave.push(parent2);

      const savedParents = await Promise.all(
        parentsToSave.map(async (p) => {
          const isEdit = !!p.id;

          const res = await fetch(
            isEdit ? `${API}/parents/${p.id}` : `${API}/parents`,
            {
              method: isEdit ? "PUT" : "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(p),
            }
          );

          if (!res.ok) throw new Error("Parent save failed");
          return res.json();
        })
      );

      const payload: StudentDTO = {
        ...form,
        parentIds: savedParents.map((p) => p.id),
      };

      const res = await fetch(
        editId ? `${API}/students/${editId}` : `${API}/students`,
        {
          method: editId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Student save failed");

      await fetchData();
      setIsModalOpen(false);
      setEditId(null);
      setForm(emptyForm);
      setParent1(emptyParentForm);
      setParent2(emptyParentForm);
    } catch (err) {
      setError("Failed to save student");
    } finally {
      setLoading(false);
    }
  };


   return (
     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50/30 to-pink-50/30 p-4 md:p-6 lg:p-8">
       <div className="mx-auto max-w-7xl space-y-6">

         {/* HEADER */}
         <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
           <div>
             <p className="text-sm font-semibold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
               Admin Portal
             </p>

             <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
               Students Management
             </h1>

             <p className="mt-2 max-w-2xl text-base text-slate-600">
               View, search, and register students across classes.
             </p>
           </div>

           <button
             onClick={openAddModal}
             className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3.5 font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:scale-[1.02] active:scale-95 sm:w-auto"
           >
             <Plus className="h-5 w-5" />
             <span>Add Student</span>
           </button>
         </div>

         {/* STATS */}
         <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
           <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)]">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
             <div className="relative flex items-center justify-between">
               <div>
                 <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                   Total Students
                 </p>

                 <p className="mt-3 text-4xl font-bold text-slate-900">
                   {students.length}
                 </p>
               </div>

               <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30">
                 <Users className="h-7 w-7" />
               </div>
             </div>
           </div>

           <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)]">
             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
             <div className="relative flex items-center justify-between">
               <div>
                 <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                   Registered
                 </p>

                 <p className="mt-3 text-4xl font-bold text-emerald-600">
                   {registeredCount}
                 </p>
               </div>

               <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30">
                 <CheckCircle2 className="h-7 w-7" />
               </div>
             </div>
           </div>

           <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)]">
             <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.03] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
             <div className="relative flex items-center justify-between">
               <div>
                 <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                   Not Registered
                 </p>

                 <p className="mt-3 text-4xl font-bold text-amber-600">
                   {notRegisteredCount}
                 </p>
               </div>

               <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30">
                 <AlertCircle className="h-7 w-7" />
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
                   placeholder="Search students..."
                   value={search}
                   onChange={(e) =>
                     setSearch(e.target.value)
                   }
                   className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                 />
               </div>

               <select
                 value={selectedClass}
                 onChange={(e) =>
                   setSelectedClass(e.target.value)
                 }
                 className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 text-slate-900"
               >
                 <option value="">
                   All Classes
                 </option>

                 {classes.map((c) => (
                   <option
                     key={c.id}
                     value={c.id.toString()}
                   >
                     {c.name}
                   </option>
                 ))}
               </select>
             </div>
           </div>
          </div>

          {/* TABLE */}
         <div className="overflow-hidden rounded-2xl border-0 bg-white shadow-lg shadow-slate-200/50">
           <div className="overflow-x-auto">
             <table className="min-w-full">
               <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50">
                 <tr>
                   <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                     Student
                   </th>

                   <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                     Student ID
                   </th>

                   <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                     Class
                   </th>

                   <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                     Year
                   </th>

                   <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                     Status
                   </th>

                   <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                     Actions
                   </th>
                 </tr>
               </thead>

               <tbody>
                 {paginated.map((student) => (
                   <tr
                     key={student.id}
                     className="group border-t border-slate-100 transition-colors hover:bg-slate-50/70"
                   >
                     <td className="px-6 py-4 font-medium text-slate-900">
                       {student.firstName}{" "}
                       {student.middleName}{" "}
                       {student.lastName}
                     </td>

                     <td className="px-6 py-4 text-slate-600">
                       {student.studentId}
                     </td>

                     <td className="px-6 py-4">
                       <span className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                         {getClassName(student)}
                       </span>
                     </td>

                     <td className="px-6 py-4 text-slate-600">
                       {student.yearOfStudy}
                     </td>

                     <td className="px-6 py-4">
                       {student.registrationStatus === "REGISTERED" ? (
                         <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                           <CheckCircle2 className="h-3.5 w-3.5" />
                           Registered
                         </span>
                       ) : (
                         <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                           <AlertCircle className="h-3.5 w-3.5" />
                           Not Registered
                         </span>
                       )}
                     </td>

                     <td className="px-6 py-4 text-right">
                       <button
                         onClick={() =>
                           handleEdit(student)
                         }
                         className="rounded-lg bg-blue-50 p-2 text-blue-600 transition-all hover:bg-blue-100 hover:text-blue-700 group-hover:scale-110"
                       >
                         <Edit className="h-4 w-4" />
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>

           {/* PAGINATION */}
           <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-6 py-4">
             <p className="text-sm text-slate-500">
               Showing {showingStart}-{showingEnd} of{" "}
               {filtered.length}
             </p>

             <div className="flex items-center gap-2">
               <button
                 onClick={() =>
                   setCurrentPage((prev) =>
                     Math.max(prev - 1, 1)
                   )
                 }
                 disabled={currentPage === 1}
                 className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
               >
                 <ChevronLeft className="h-4 w-4" />
               </button>

               <button
                 onClick={() =>
                   setCurrentPage((prev) =>
                     Math.min(prev + 1, totalPages)
                   )
                 }
                 disabled={currentPage === totalPages}
                 className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
               >
                 <ChevronRight className="h-4 w-4" />
               </button>
             </div>
           </div>
         </div>

         {/* MODAL */}
         {isModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-black/50 to-black/60 p-4 backdrop-blur-sm">
             <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10">

               {/* HEADER */}
               <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-50/80 px-8 py-5 backdrop-blur-md">
                 <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                   {editId
                     ? "Edit Student"
                     : "Add Student"}
                 </h2>

                 <button
                   onClick={() =>
                     setIsModalOpen(false)
                   }
                   className="rounded-xl p-2 text-slate-400 transition-all hover:bg-slate-200 hover:text-slate-600"
                 >
                   <X className="h-5 w-5" />
                 </button>
               </div>

               <form
                 onSubmit={handleSubmit}
                 className="space-y-6 p-8"
               >
                {/* STUDENT DETAILS */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="group">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Student ID</label>
                    <input
                      name="studentId"
                      value={form.studentId}
                      onChange={handleChange}
                      placeholder="Enter student ID"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="group">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">First Name</label>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="group">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Middle Name</label>
                    <input
                      name="middleName"
                      value={form.middleName}
                      onChange={handleChange}
                      placeholder="Enter middle name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="group">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Last Name</label>
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="group">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Gender</label>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">Select Gender</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                  </div>

                  <div className="group">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={form.dateOfBirth}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                   </div>

                   <div className="group">
                     <label className="mb-1.5 block text-sm font-medium text-slate-700">Year of Study</label>
                    <input
                      type="number"
                      name="yearOfStudy"
                      value={form.yearOfStudy}
                      onChange={handleChange}
                      placeholder="Enter year"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="group">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Class</label>
                    <select
                      name="classId"
                      value={form.classId.toString()}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="0">
                        Select Class
                      </option>

                      {classes.map((c) => (
                        <option
                          key={c.id}
                          value={c.id.toString()}
                        >
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* SUBJECTS */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Subjects
                  </label>
                  <p className="mb-3 text-xs text-slate-500">Hold Ctrl/Cmd to select multiple</p>
                  <select
                    multiple
                    value={form.subjectIds.map(String)}
                    onChange={handleMultiSelect}
                    className="min-h-[150px] w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  >
                    {filteredSubjects.map((s) => (
                      <option
                        key={s.id}
                        value={s.id}
                      >
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PARENT 1 */}
                <div className="space-y-4 rounded-2xl border-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Parent 1
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="group">
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Full Name</label>
                      <input
                        name="fullName"
                        value={parent1.fullName}
                        onChange={(e) =>
                          handleParentChange(
                            "parent1",
                            e
                          )
                        }
                        placeholder="Enter full name"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    <div className="group">
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone</label>
                      <input
                        name="phone"
                        value={parent1.phone}
                        onChange={(e) =>
                          handleParentChange(
                            "parent1",
                            e
                          )
                        }
                        placeholder="Enter phone number"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    <div className="group">
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                      <input
                        name="email"
                        value={parent1.email}
                        onChange={(e) =>
                          handleParentChange(
                            "parent1",
                            e
                          )
                        }
                        placeholder="Enter email address"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    <div className="group">
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Relationship</label>
                      <input
                        name="relationshipToStudent"
                        value={
                          parent1.relationshipToStudent
                        }
                        onChange={(e) =>
                          handleParentChange(
                            "parent1",
                            e
                          )
                        }
                        placeholder="e.g., Father, Mother"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    <div className="group md:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Address</label>
                      <input
                        name="address"
                        value={parent1.address}
                        onChange={(e) =>
                          handleParentChange(
                            "parent1",
                            e
                          )
                        }
                        placeholder="Enter full address"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>
                </div>

                {/* PARENT 2 */}
                <div className="space-y-4 rounded-2xl border-0 bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Parent 2 (Optional)
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="group">
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Full Name</label>
                      <input
                        name="fullName"
                        value={parent2.fullName}
                        onChange={(e) =>
                          handleParentChange(
                            "parent2",
                            e
                          )
                        }
                        placeholder="Enter full name"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    <div className="group">
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone</label>
                      <input
                        name="phone"
                        value={parent2.phone}
                        onChange={(e) =>
                          handleParentChange(
                            "parent2",
                            e
                          )
                        }
                        placeholder="Enter phone number"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    <div className="group">
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                      <input
                        name="email"
                        value={parent2.email}
                        onChange={(e) =>
                          handleParentChange(
                            "parent2",
                            e
                          )
                        }
                        placeholder="Enter email address"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    <div className="group">
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Relationship</label>
                      <input
                        name="relationshipToStudent"
                        value={
                          parent2.relationshipToStudent
                        }
                        onChange={(e) =>
                          handleParentChange(
                            "parent2",
                            e
                          )
                        }
                        placeholder="e.g., Father, Mother"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    <div className="group md:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Address</label>
                      <input
                        name="address"
                        value={parent2.address}
                        onChange={(e) =>
                          handleParentChange(
                            "parent2",
                            e
                          )
                        }
                        placeholder="Enter full address"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>
                </div>

                {/* STATUS */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="group">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Registration Status</label>
                    <select
                      name="registrationStatus"
                      value={
                        form.registrationStatus
                      }
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="REGISTERED">
                        REGISTERED
                      </option>

                      <option value="NOT_REGISTERED">
                        NOT REGISTERED
                      </option>
                    </select>
                  </div>

                  {form.registrationStatus ===
                    "NOT_REGISTERED" && (
                    <div className="group">
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Reason</label>
                      <input
                        name="notRegisteredReason"
                        value={
                          form.notRegisteredReason
                        }
                        onChange={handleChange}
                        placeholder="Enter reason"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  )}
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-red-50/50 p-4 text-sm text-red-600 font-medium">
                    {error}
                  </div>
                )}

                {/* FOOTER */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setIsModalOpen(false)
                    }
                    className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-slate-700 font-medium transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:from-blue-600 disabled:hover:to-purple-600 active:scale-95"
                  >
                    {loading
                      ? "Saving..."
                      : editId
                      ? "Update Student"
                      : "Save Student"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}