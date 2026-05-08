'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { User, Target, CheckCircle, Mail, Calendar, MessageSquare, FileText, DollarSign } from 'lucide-react';

const resultsData = [
  { month: 'Jan', math: 85, science: 90, english: 88, attendance: 95 },
  { month: 'Feb', math: 88, science: 92, english: 85, attendance: 97 },
  { month: 'Mar', math: 90, science: 89, english: 92, attendance: 94 },
  { month: 'Apr', math: 92, science: 91, english: 90, attendance: 96 },
  { month: 'May', math: 89, science: 93, english: 87, attendance: 98 },
  { month: 'Jun', math: 91, science: 95, english: 89, attendance: 97 },
];

const attendanceData = [
  { name: 'Present', value: 142, color: '#10b981' },
  { name: 'Absent', value: 5, color: '#ef4444' },
  { name: 'Late', value: 3, color: '#f59e0b' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {`${entry.dataKey}: ${entry.value}${entry.dataKey === 'attendance' ? '%' : ''}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ParentDashboard() {
  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Student Name</p>
              <p className="text-xl font-bold text-gray-900">Alex Johnson</p>
              <p className="text-xs text-primary font-medium mt-1">Grade 10</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-primary to-blue-600 rounded-xl shadow-lg">
              <User className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-3xl font-bold text-gray-900">89%</p>
              <p className="text-xs text-green-600 font-medium mt-1">+3% this month</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-secondary to-red-600 rounded-xl shadow-lg">
              <Target className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-3xl font-bold text-gray-900">96%</p>
              <p className="text-xs text-blue-600 font-medium mt-1">Excellent</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-accent to-yellow-600 rounded-xl shadow-lg">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread Messages</p>
              <p className="text-3xl font-bold text-gray-900">2</p>
              <p className="text-xs text-orange-600 font-medium mt-1">Requires attention</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl shadow-lg">
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Trend */}
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Academic Performance</h3>
            <p className="text-gray-600">Monthly progress across subjects</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={resultsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMath" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1b1464" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1b1464" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorScience" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff0000" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ff0000" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorEnglish" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffbe00" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ffbe00" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="math" stackId="1" stroke="#1b1464" fill="url(#colorMath)" strokeWidth={3} />
              <Area type="monotone" dataKey="science" stackId="2" stroke="#ff0000" fill="url(#colorScience)" strokeWidth={3} />
              <Area type="monotone" dataKey="english" stackId="3" stroke="#ffbe00" fill="url(#colorEnglish)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Overview */}
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Attendance Overview</h3>
            <p className="text-gray-600">Monthly attendance breakdown</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={attendanceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {attendanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-semibold" style={{ color: data.color }}>{data.name}</p>
                        <p className="text-sm text-gray-600">{data.value} days</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry) => (
                  <span style={{ color: entry.color }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center p-6 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <Calendar className="h-6 w-6 mr-3" />
            <span className="font-medium">Schedule Meeting</span>
          </button>
          <button className="flex items-center p-6 bg-gradient-to-r from-secondary to-red-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <MessageSquare className="h-6 w-6 mr-3" />
            <span className="font-medium">Contact Teacher</span>
          </button>
          <button className="flex items-center p-6 bg-gradient-to-r from-accent to-yellow-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <FileText className="h-6 w-6 mr-3" />
            <span className="font-medium">View Assignments</span>
          </button>
          <button className="flex items-center p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <DollarSign className="h-6 w-6 mr-3" />
            <span className="font-medium">Pay Fees</span>
          </button>
        </div>
      </div>
    </div>
  );
}