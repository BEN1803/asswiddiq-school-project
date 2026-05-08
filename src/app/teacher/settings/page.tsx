'use client';

import { Edit } from 'lucide-react';

export default function TeacherSettings() {
  return (
    <div className="max-w-4xl">
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/20">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800">Teacher Settings</h3>
          <p className="text-gray-600 mt-2">Customize your teaching profile and preferences</p>
        </div>
        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Personal Information</label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      defaultValue="John Teacher"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Email Address</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      defaultValue="john@school.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Professional Details</label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Subject Specialization</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                      <option>Mathematics</option>
                      <option>Science</option>
                      <option>English</option>
                      <option>History</option>
                      <option>Geography</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Experience (Years)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      defaultValue="8"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Qualifications</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="M.Sc. Mathematics, B.Ed."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Bio</label>
            <textarea
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              placeholder="Tell us about your teaching philosophy and experience..."
            />
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-primary transition-all duration-300 font-medium flex items-center shadow-lg hover:shadow-xl"
            >
              <Edit className="h-4 w-4 mr-2" />
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}