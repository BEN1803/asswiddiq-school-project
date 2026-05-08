'use client';

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const subjectPerformance = [
  { subject: 'Mathematics', score: 92, color: '#1b1464', trend: '+5%' },
  { subject: 'Science', score: 89, color: '#ff0000', trend: '+3%' },
  { subject: 'English', score: 87, color: '#ffbe00', trend: '+2%' },
  { subject: 'History', score: 91, color: '#10b981', trend: '+4%' },
  { subject: 'Geography', score: 85, color: '#8b5cf6', trend: '+1%' },
];

const skillsData = [
  { skill: 'Problem Solving', current: 88, target: 95 },
  { skill: 'Communication', current: 92, target: 90 },
  { skill: 'Teamwork', current: 85, target: 88 },
  { skill: 'Creativity', current: 90, target: 92 },
  { skill: 'Leadership', current: 87, target: 85 },
  { skill: 'Discipline', current: 94, target: 95 },
];

export default function ParentResults() {
  return (
    <div className="space-y-8">
      {/* Subject Performance */}
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Subject-wise Performance</h3>
          <p className="text-gray-600">Detailed analysis of academic subjects</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectPerformance.map((subject, index) => (
            <div key={index} className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800">{subject.subject}</h4>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: subject.color }}>{subject.score}%</p>
                  <p className="text-xs text-green-600 font-medium">{subject.trend}</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${subject.score}%`, backgroundColor: subject.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Assessment */}
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Skills Development</h3>
          <p className="text-gray-600">Progress towards skill development goals</p>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={skillsData}>
            <PolarGrid stroke="#e0e0e0" />
            <PolarAngleAxis dataKey="skill" fontSize={12} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} fontSize={10} />
            <Radar name="Current Level" dataKey="current" stroke="#1b1464" fill="#1b1464" fillOpacity={0.1} strokeWidth={2} />
            <Radar name="Target Level" dataKey="target" stroke="#ff0000" fill="#ff0000" fillOpacity={0.1} strokeWidth={2} />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Results Table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Detailed Results</h3>
              <p className="text-gray-600 mt-1">Complete academic record</p>
            </div>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
              Export Report
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Test 1</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Test 2</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Final</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Average</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Grade</th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-200/50">
              {[
                { subject: 'Mathematics', test1: 88, test2: 92, final: 95, average: 92, grade: 'A' },
                { subject: 'Science', test1: 85, test2: 90, final: 88, average: 89, grade: 'B+' },
                { subject: 'English', test1: 90, test2: 85, final: 87, average: 87, grade: 'B+' },
                { subject: 'History', test1: 92, test2: 89, final: 93, average: 91, grade: 'A-' },
                { subject: 'Geography', test1: 83, test2: 87, final: 85, average: 85, grade: 'B' },
              ].map((result, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{result.test1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{result.test2}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{result.final}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{result.average}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      result.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                      result.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {result.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}