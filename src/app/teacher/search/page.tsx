'use client';

import { useState } from 'react';
import { Users, FileText, TrendingUp, BookOpen, Clock } from 'lucide-react';

export default function TeacherSearch() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Search & Find</h3>
          <p className="text-gray-600">Search for students, assignments, grades, and records</p>
        </div>
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search for students, assignments, grades..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-medium flex flex-col items-center">
            <Users className="h-8 w-8 mb-2" />
            Students
          </button>
          <button className="p-4 bg-gradient-to-r from-secondary to-red-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-medium flex flex-col items-center">
            <FileText className="h-8 w-8 mb-2" />
            Assignments
          </button>
          <button className="p-4 bg-gradient-to-r from-accent to-yellow-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-medium flex flex-col items-center">
            <TrendingUp className="h-8 w-8 mb-2" />
            Grades
          </button>
          <button className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-medium flex flex-col items-center">
            <BookOpen className="h-8 w-8 mb-2" />
            Classes
          </button>
        </div>
      </div>

      {searchQuery && (
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
          <h4 className="text-lg font-bold text-gray-800 mb-4">Search Results for "{searchQuery}"</h4>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="font-medium text-blue-800">Found 15 students matching your search</p>
              <p className="text-sm text-blue-600 mt-1">John Doe, Jane Smith, Alex Johnson...</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <p className="font-medium text-green-800">Found 8 assignments matching your search</p>
              <p className="text-sm text-green-600 mt-1">Mathematics, Science, English assignments</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="font-medium text-purple-800">Found 5 classes matching your search</p>
              <p className="text-sm text-purple-600 mt-1">Math 101, Science 102, History 103...</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Search Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
          <h4 className="text-lg font-bold text-gray-800 mb-4">Recent Searches</h4>
          <div className="space-y-3">
            {['John Doe', 'Math Assignment 5', 'Grade 10A', 'Science Project'].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors cursor-pointer">
                <span className="text-gray-700">{item}</span>
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
          <h4 className="text-lg font-bold text-gray-800 mb-4">Popular Searches</h4>
          <div className="space-y-3">
            {['Outstanding Students', 'Pending Assignments', 'Low Performers', 'Recent Grades'].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors cursor-pointer">
                <span className="text-gray-700">{item}</span>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}