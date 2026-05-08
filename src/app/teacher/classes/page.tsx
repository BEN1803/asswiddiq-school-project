'use client';

import { BookOpen } from 'lucide-react';

const classes = [
  { id: 1, name: 'Math 101', students: 25, avgGrade: 'A-', completion: 94 },
  { id: 2, name: 'Science 102', students: 30, avgGrade: 'B+', completion: 89 },
  { id: 3, name: 'History 103', students: 20, avgGrade: 'A', completion: 96 },
  { id: 4, name: 'English 104', students: 28, avgGrade: 'B', completion: 91 },
];

export default function TeacherClasses() {
  return (
    <>
      <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 capitalize">Classes</h2>
            <p className="text-gray-600 mt-1">Monitor and manage your teaching activities</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-green-100 px-3 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Live Data</span>
            </div>
            <div className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors cursor-pointer">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {classes.map((cls) => (
        <div key={cls.id} className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-primary to-blue-600 rounded-xl shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{cls.name}</h3>
                <p className="text-gray-600">{cls.students} students enrolled</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{cls.avgGrade}</p>
              <p className="text-sm text-gray-600">Avg Grade</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Completion Rate</span>
              <span className="text-sm font-semibold text-gray-800">{cls.completion}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${cls.completion}%` }}
              ></div>
            </div>
          </div>
          <div className="mt-6 flex space-x-3">
            <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              View Details
            </button>
            <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
              Manage Students
            </button>
          </div>
        </div>
      ))}
        </div>
      </main>
    </>
  );
}