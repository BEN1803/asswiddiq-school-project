"use client";

import { useState } from "react";

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
  "Mathematics",
  "English Language",
  "Science",
  "Social Studies",
  "Physical Education",
  "Art and Craft",
];

export default function ResultsPage() {
  const [selectedClass, setSelectedClass] = useState("");

  const [students] = useState([
    { studentId: "ST001", firstName: "Emmanuel", lastName: "Chacha", className: "Class 1" },
    { studentId: "ST002", firstName: "Aisha", lastName: "Mohammed", className: "Class 2" },
    { studentId: "ST003", firstName: "David", lastName: "Smith", className: "Class 1" },
    { studentId: "ST004", firstName: "Fatima", lastName: "Ali", className: "Class 3" },
    { studentId: "ST005", firstName: "John", lastName: "Doe", className: "Class 2" },
  ]);

  const [results] = useState([
    { studentId: "ST001", subject: "Mathematics", score: 85 },
    { studentId: "ST001", subject: "English Language", score: 78 },
    { studentId: "ST002", subject: "Mathematics", score: 92 },
    { studentId: "ST002", subject: "English Language", score: 88 },
    { studentId: "ST003", subject: "Mathematics", score: 75 },
    { studentId: "ST003", subject: "English Language", score: 80 },
    { studentId: "ST004", subject: "Mathematics", score: 90 },
    { studentId: "ST004", subject: "English Language", score: 85 },
    { studentId: "ST005", subject: "Mathematics", score: 70 },
    { studentId: "ST005", subject: "English Language", score: 65 },
  ]);

  const filteredStudents = students.filter((s) => s.className === selectedClass);

  const getStudentResults = (studentId: string) => {
    return results.filter((r) => r.studentId === studentId);
  };

  const isComplete = (studentId: string) => {
    const studentSubjects = getStudentResults(studentId).map((r) => r.subject);
    return subjectOptions.every((subject) => studentSubjects.includes(subject));
  };

  const getAverage = (studentId: string) => {
    const studentResults = getStudentResults(studentId);
    if (studentResults.length === 0) return "0";
    const total = studentResults.reduce((sum, r) => sum + r.score, 0);
    return (total / studentResults.length).toFixed(1);
  };

  const getPerformanceLabel = (avg: string) => {
    const numAvg = parseFloat(avg);
    if (numAvg >= 90) return { label: "Excellent", color: "bg-emerald-100 text-emerald-700" };
    if (numAvg >= 80) return { label: "Very Good", color: "bg-blue-100 text-blue-700" };
    if (numAvg >= 70) return { label: "Good", color: "bg-sky-100 text-sky-700" };
    if (numAvg >= 60) return { label: "Average", color: "bg-amber-100 text-amber-700" };
    return { label: "Needs Improvement", color: "bg-rose-100 text-rose-700" };
  };

  const totalStudents = filteredStudents.length;
  const completeCount = filteredStudents.filter((s) => isComplete(s.studentId)).length;
  const averageScore = totalStudents > 0
    ? (filteredStudents.reduce((sum, s) => sum + parseFloat(getAverage(s.studentId)), 0) / totalStudents).toFixed(1)
    : "0";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Results Monitoring</h1>
            <p className="text-slate-600 mt-1">Track and analyze student academic performance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow border border-slate-200">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Total Students</p>
            <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border border-slate-200">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Complete Results</p>
            <p className="text-2xl font-bold text-emerald-600">{completeCount}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border border-slate-200">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Class Average</p>
            <p className="text-2xl font-bold text-violet-600">{averageScore}%</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border border-slate-200">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Subjects</p>
            <p className="text-2xl font-bold text-indigo-600">{subjectOptions.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl border border-slate-200 p-4 mb-6">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-full sm:w-64 border border-slate-300 bg-white text-slate-900 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        >
          <option value="">Select Class</option>
          {classOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {selectedClass ? (
        <div className="bg-white shadow-lg rounded-xl overflow-x-auto border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4 text-left font-semibold">Student</th>
                <th className="p-4 text-center font-semibold">Subjects Done</th>
                <th className="p-4 text-center font-semibold">Status</th>
                <th className="p-4 text-center font-semibold">Average</th>
                <th className="p-4 text-center font-semibold">Performance</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const studentResults = getStudentResults(student.studentId);
                  const complete = isComplete(student.studentId);
                  const avg = getAverage(student.studentId);
                  const performance = getPerformanceLabel(avg);

                  return (
                    <>
                      <tr
                        key={student.studentId}
                        className="border-b border-slate-200 hover:bg-blue-50 transition-colors hidden sm:table-row"
                      >
                        <td className="p-4 font-medium text-slate-900">
                          {student.firstName} {student.lastName}
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-slate-600">{studentResults.length}</span>
                          <span className="text-slate-400"> / </span>
                          <span className="font-medium text-slate-700">{subjectOptions.length}</span>
                        </td>
                        <td className="p-4 text-center">
                          {complete ? (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                              Complete
                            </span>
                          ) : (
                            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">
                              Incomplete
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <span className="font-bold text-blue-700 text-lg">{avg}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${performance.color}`}>
                            {performance.label}
                          </span>
                        </td>
                      </tr>

                      <tr
                        key={`${student.studentId}-card`}
                        className="border-b border-slate-200 block sm:hidden bg-white"
                      >
                        <td colSpan={5} className="p-4">
                          <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-slate-900 text-base">
                                {student.firstName} {student.lastName}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${performance.color}`}>
                                {performance.label}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="bg-slate-50 p-2 rounded">
                                <span className="text-xs text-slate-500 block">Subjects</span>
                                <span className="font-medium">{studentResults.length} / {subjectOptions.length}</span>
                              </div>
                              <div className="bg-slate-50 p-2 rounded">
                                <span className="text-xs text-slate-500 block">Average</span>
                                <span className="font-bold text-blue-700">{avg}</span>
                              </div>
                              <div className="bg-slate-50 p-2 rounded col-span-2">
                                <span className="text-xs text-slate-500 block">Status</span>
                                {complete ? (
                                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                    Complete
                                  </span>
                                ) : (
                                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">
                                    Incomplete
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No students found in this class
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-xl border border-slate-200 p-12 text-center">
          <div className="text-6xl text-slate-200 mb-4">📊</div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">Select a Class</h3>
          <p className="text-slate-500">Choose a class from the dropdown above to view results</p>
        </div>
      )}
    </div>
  );
}