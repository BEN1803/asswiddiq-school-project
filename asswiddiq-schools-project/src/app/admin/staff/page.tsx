"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  UserCheck,
  Mail,
  Phone,
  BookOpen,
  Users,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Teacher = {
  id?: number;
  staffId: string;
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  address: string;
  email: string;
  phone: string;

  // MANY TO MANY
  classes: {
    id: number;
    name: string;
  }[];

  subjects: {
    id: number;
    name: string;
  }[];
};

type ClassType = {
  id: number;
  name: string;
};

type SubjectType = {
  id: number;
  name: string;
  class_id?: number;
  classId?: number;
  classes?: {
    id: number;
    name: string;
  }[];
  classEntity?: {
    id: number;
    name: string;
  } | null;
  className?: string;
  teacher?: {
    id: number;
  } | null;
  teacher_id?: number | null;
  teacherId?: number | null;
};

const TITLES = ["Mr", "Mrs", "Miss", "Dr", "Prof"];

export default function TeachersPage() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const ITEMS_PER_PAGE = 8;

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [subjects, setSubjects] = useState<SubjectType[]>([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);

  const [form, setForm] = useState<Teacher>({
    staffId: "",
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    address: "",
    email: "",
    phone: "",
    classes: [],
    subjects: [],
  });

  // =========================
  // FETCH DATA
  // =========================

  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${API}/teachers`);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed: ${res.status} ${errorText}`);
      }

      const data = await res.json();

      setTeachers(data);
    } catch (err) {
      console.error("Error fetching teachers", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [teachersRes, classesRes, subjectsRes] = await Promise.all([
          fetch(`${API}/teachers`),
          fetch(`${API}/classes`),
          fetch(`${API}/subjects`),
        ]);

        if (teachersRes.ok) setTeachers(await teachersRes.json());
        if (classesRes.ok) setClasses(await classesRes.json());
        if (subjectsRes.ok) setSubjects(await subjectsRes.json());
      } catch (err) {
        console.error("Error loading teacher form data", err);
      }
    };

    loadData();
  }, [API]);

  // =========================
  // FILTER SUBJECTS BY CLASS
  // =========================

  const getSubjectClasses = useCallback((subject: SubjectType) => {
    if (subject.classes && subject.classes.length > 0) return subject.classes;
    if (subject.classEntity) return [subject.classEntity];

    const classId = subject.class_id ?? subject.classId;
    if (classId) {
      const matchedClass = classes.find((cls) => cls.id === classId);
      if (matchedClass) return [matchedClass];
    }

    if (subject.className) {
      const matchedClass = classes.find((cls) => cls.name === subject.className);
      if (matchedClass) return [matchedClass];
      return [{ id: 0, name: subject.className }];
    }

    return [];
  }, [classes]);

  const selectedClassIds = useMemo(
    () => new Set((Array.isArray(form.classes) ? form.classes : []).map((cls) => cls.id)),
    [form.classes]
  );

  const filteredSubjects = useMemo(() => {
    if (selectedClassIds.size === 0) return [];

    return subjects.filter((subject) => {
      return getSubjectClasses(subject).some((cls) => selectedClassIds.has(cls.id));
    });
  }, [subjects, selectedClassIds, getSubjectClasses]);

  const getTeacherSubjectId = (subject: SubjectType) =>
    subject.teacher?.id ?? subject.teacher_id ?? subject.teacherId ?? null;

  const getAssignedSubjectsForTeacher = (teacher: Teacher) => {
    const assignedFromTeacher = Array.isArray(teacher.subjects) ? teacher.subjects : [];
    const assignedFromSubjects = subjects
      .filter((subject) => teacher.id && getTeacherSubjectId(subject) === teacher.id)
      .map((subject) => ({ id: subject.id, name: subject.name }));

    return [...assignedFromTeacher, ...assignedFromSubjects].filter(
      (subject, index, allSubjects) =>
        allSubjects.findIndex((item) => item.id === subject.id) === index
    );
  };

  const getAssignedClassesForTeacher = (teacher: Teacher) => {
    const assignedClasses = Array.isArray(teacher.classes) ? teacher.classes : [];
    const classesFromSubjects = subjects
      .filter((subject) => teacher.id && getTeacherSubjectId(subject) === teacher.id)
      .flatMap(getSubjectClasses);

    return [...assignedClasses, ...classesFromSubjects].filter(
      (cls, index, allClasses) =>
        allClasses.findIndex((item) => item.id === cls.id && item.name === cls.name) === index
    );
  };

  const getSubjectDisplayName = (subject: { id: number; name: string }) => {
    const fullSubject = subjects.find((item) => item.id === subject.id);
    const classNames = fullSubject ? getSubjectClasses(fullSubject).map((cls) => cls.name) : [];

    return classNames.length > 0
      ? `${subject.name} (${classNames.join(", ")})`
      : subject.name;
  };
  // =========================
  // SEARCH
  // =========================

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const fullName =
        `${teacher.firstName} ${teacher.lastName}`.toLowerCase();

      return (
        fullName.includes(search.toLowerCase()) ||
        teacher.staffId.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [teachers, search]);

  const totalPages = Math.max(1, Math.ceil(filteredTeachers.length / ITEMS_PER_PAGE));
  const pageStart = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTeachers = filteredTeachers.slice(
    pageStart,
    pageStart + ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, teachers.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // =========================
  // HANDLE INPUTS
  // =========================

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // HANDLE CLASS SELECTION
  // =========================

  const handleClassToggle = (classItem: ClassType) => {
    const currentClasses = Array.isArray(form.classes) ? form.classes : [];
    const isSelected = currentClasses.some((cls) => cls.id === classItem.id);
    const nextClasses = isSelected
      ? currentClasses.filter((cls) => cls.id !== classItem.id)
      : [...currentClasses, classItem];

    setForm({
      ...form,
      classes: nextClasses,
      subjects: (Array.isArray(form.subjects) ? form.subjects : []).filter((subject) => {
        const subjectClasses = getSubjectClasses(subject);
        return subjectClasses.some((cls) =>
          nextClasses.some((selectedClass) => selectedClass.id === cls.id)
        );
      }),
    });
  };

  // =========================
  // HANDLE SUBJECTS
  // =========================

  const handleSubjectToggle = (subject: SubjectType) => {
    const currentSubjects = Array.isArray(form.subjects) ? form.subjects : [];
    const alreadySelected = currentSubjects.some((s) => s.id === subject.id);

    setForm({
      ...form,
      subjects: alreadySelected
        ? currentSubjects.filter((s) => s.id !== subject.id)
        : [...currentSubjects, subject],
    });
  };

  // =========================
  // SAVE TEACHER
  // =========================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const method = editId ? "PUT" : "POST";

      const url = editId
        ? `${API}/teachers/${editId}`
        : `${API}/teachers`;

      const selectedSubjectAssignments = Array.isArray(form.subjects)
        ? form.subjects
        : [];

      const payload = {
        staffId: form.staffId,
        title: form.title,
        firstName: form.firstName,
        middleName: form.middleName,
        lastName: form.lastName,
        address: form.address,
        email: form.email,
        phone: form.phone,
        classes: (Array.isArray(form.classes) ? form.classes : []).map((c) => ({ id: c.id })),
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed: ${res.status} ${errorText}`);
      }

      const responseText = await res.text();
      const savedTeacher = responseText ? JSON.parse(responseText) : null;
      const teacherId = savedTeacher?.id ?? editId;

      if (teacherId && selectedSubjectAssignments.length > 0) {
        await Promise.all(
          selectedSubjectAssignments.map((subject) =>
            fetch(`${API}/subjects/${subject.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: subject.name,
                classes: getSubjectClasses(subject)
                  .filter((cls) => cls.id > 0)
                  .map((cls) => ({ id: cls.id })),
                teacher: { id: teacherId },
              }),
            }).then(async (subjectRes) => {
              if (!subjectRes.ok) {
                const errorText = await subjectRes.text();
                throw new Error(
                  `Failed to assign ${subject.name}: ${subjectRes.status} ${errorText}`
                );
              }
            })
          )
        );
      }

      setIsModalOpen(false);

      setEditId(null);

      setForm({
        staffId: "",
        title: "",
        firstName: "",
        middleName: "",
        lastName: "",
        address: "",
        email: "",
        phone: "",
        classes: [],
        subjects: [],
      });

      await fetchTeachers();

      const subjectsRes = await fetch(`${API}/subjects`);
      if (subjectsRes.ok) setSubjects(await subjectsRes.json());
    } catch (err) {
      console.error("Error saving teacher", err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this teacher?")) return;

    try {
      const res = await fetch(`${API}/teachers/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed: ${res.status} ${errorText}`);
      }

      fetchTeachers();
    } catch (err) {
      console.error("Error deleting teacher", err);
    }
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (teacher: Teacher) => {
    const teacherClasses = getAssignedClassesForTeacher(teacher);
    const teacherSubjects = getAssignedSubjectsForTeacher(teacher);

    setForm({
      ...teacher,
      classes: teacherClasses,
      subjects: teacherSubjects,
    });

    setEditId(teacher.id!);

    setIsModalOpen(true);
  };

  // =========================
  // ADD
  // =========================

  const openAddModal = () => {
    setEditId(null);

    setForm({
      staffId: "",
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      address: "",
      email: "",
      phone: "",
      classes: [],
      subjects: [],
    });

    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Teachers
            </h1>
            <p className="text-slate-500 mt-1">
              Manage your teaching staff
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-blue-600/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-600/30"
          >
            <Plus className="w-5 h-5" />
            Add Teacher
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search teachers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
        </div>

        {/* STATS BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{teachers.length}</p>
                <p className="text-sm text-slate-500">Total Teachers</p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{subjects.length}</p>
                <p className="text-sm text-slate-500">Subjects</p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{classes.length}</p>
                <p className="text-sm text-slate-500">Classes</p>
              </div>
            </div>
          </div>
        </div>

        {/* TEACHER CARDS - DESKTOP TABLE / MOBILE CARDS */}
        {paginatedTeachers.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <UserCheck className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No teachers found</h3>
            <p className="text-slate-500">Add your first teacher to get started</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Staff ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Teacher</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Subjects</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Classes</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedTeachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {teacher.staffId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">
                            {teacher.title} {teacher.firstName} {teacher.lastName}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {getAssignedSubjectsForTeacher(teacher).map((subject) => (
                            <span
                              key={subject.id}
                              className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium"
                            >
                              {getSubjectDisplayName(subject)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {getAssignedClassesForTeacher(teacher).map((cls) => (
                            <span
                              key={cls.id}
                              className="px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium"
                            >
                              {cls.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Mail className="w-3.5 h-3.5" />
                            <span className="text-sm">{teacher.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Phone className="w-3.5 h-3.5" />
                            <span className="text-sm">{teacher.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(teacher)}
                            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(teacher.id!)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
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

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {paginatedTeachers.map((teacher) => (
                <div key={teacher.id} className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {teacher.title} {teacher.firstName} {teacher.lastName}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 mt-1">
                        {teacher.staffId}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(teacher)}
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(teacher.id!)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-slate-500 mb-1.5">Subjects</p>
                      <div className="flex flex-wrap gap-1.5">
                        {getAssignedSubjectsForTeacher(teacher).map((subject) => (
                          <span
                            key={subject.id}
                            className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium"
                          >
                            {getSubjectDisplayName(subject)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1.5">Classes</p>
                      <div className="flex flex-wrap gap-1.5">
                        {getAssignedClassesForTeacher(teacher).map((cls) => (
                          <span
                            key={cls.id}
                            className="px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium"
                          >
                            {cls.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-slate-600 mb-1">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="text-sm">{teacher.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Phone className="w-3.5 h-3.5" />
                        <span className="text-sm">{teacher.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* PAGINATION */}
        {paginatedTeachers.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-4 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm text-slate-500 text-center sm:text-left">
              Page <span className="font-semibold text-slate-800">{currentPage}</span> of{" "}
              <span className="font-semibold text-slate-800">{totalPages}</span>
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {editId ? "Edit Teacher" : "Add Teacher"}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  {editId ? "Update teacher information" : "Add a new teacher to your staff"}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
              {/* Basic Info Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Staff ID</label>
                    <input
                      name="staffId"
                      placeholder="e.g., TCH001"
                      value={form.staffId}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Title</label>
                    <select
                      name="title"
                      value={form.title}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                    >
                      <option value="" className="text-slate-400">Select title</option>
                      {TITLES.map((title) => (
                        <option key={title} value={title}>
                          {title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">First Name</label>
                    <input
                      name="firstName"
                      placeholder="John"
                      value={form.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Middle Name</label>
                    <input
                      name="middleName"
                      placeholder="Optional"
                      value={form.middleName}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Last Name</label>
                    <input
                      name="lastName"
                      placeholder="Doe"
                      value={form.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Contact Information</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Address</label>
                    <input
                      name="address"
                      placeholder="Street address"
                      value={form.address}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Email</label>
                      <input
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Phone</label>
                      <input
                        name="phone"
                        placeholder="+1 (555) 000-0000"
                        value={form.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Class & Subjects Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Teaching Assignments</h3>
                
                {/* Class Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Classes</label>
                  <div className="border border-slate-300 rounded-xl bg-white p-3 min-h-[96px] grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {classes.map((cls) => (
                      <label
                        key={cls.id}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-800 hover:bg-green-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={(Array.isArray(form.classes) ? form.classes : []).some(
                            (selectedClass) => selectedClass.id === cls.id
                          )}
                          onChange={() => handleClassToggle(cls)}
                          className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                        />
                        <span>{cls.name}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">Select one or more classes to show their subjects</p>
                </div>

                {/* Subjects - Filtered by selected classes */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Subjects</label>
                  {selectedClassIds.size > 0 ? (
                    <div className="border border-slate-300 rounded-xl bg-white p-3 min-h-[120px] space-y-2">
                      {filteredSubjects.length > 0 ? (
                        filteredSubjects.map((subject) => (
                          <label
                            key={subject.id}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-800 hover:bg-blue-50 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={form.subjects?.some((s) => s.id === subject.id) ?? false}
                              onChange={() => handleSubjectToggle(subject)}
                              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="flex flex-col">
                              <span>{subject.name}</span>
                              <span className="text-xs text-slate-500">
                                {getSubjectClasses(subject).map((cls) => cls.name).join(", ")}
                              </span>
                            </span>
                          </label>
                        ))
                      ) : (
                        <p className="px-3 py-2 text-sm text-slate-500">
                          No subjects for the selected classes
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="w-full border border-slate-300 rounded-xl px-4 py-3 min-h-[120px] text-sm text-slate-400 bg-slate-50">
                      Select at least one class first
                    </div>
                  )}
                  <p className="text-xs text-slate-500">Tick one or more subjects across the selected classes</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-medium shadow-lg shadow-blue-600/25 disabled:opacity-50 transition-all duration-200 hover:shadow-xl hover:shadow-blue-600/30"
                >
                  {loading ? "Saving..." : editId ? "Update Teacher" : "Save Teacher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
