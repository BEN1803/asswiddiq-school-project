import { BarChart3, Users, Calendar, CreditCard, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  // Sample data - in a real app, this would come from an API
  const stats = [
    { title: "Total Students", value: "1,245", icon: Users, color: "bg-blue-600", bg: "bg-blue-50" },
    { title: "Upcoming Events", value: "12", icon: Calendar, color: "bg-emerald-600", bg: "bg-emerald-50" },
    { title: "Staff Members", value: "89", icon: Users, color: "bg-violet-600", bg: "bg-violet-50" },
    { title: "Total Revenue", value: "TZS 45,000", icon: CreditCard, color: "bg-amber-600", bg: "bg-amber-50" },
  ];

  // Sample recent activities
  const activities = [
    {
      id: 1,
      title: "New student registered",
      description: "John Doe registered for Class 3",
      time: "2 minutes ago",
      icon: Users,
      color: "blue",
    },
    {
      id: 2,
      title: "Event created",
      description: "Sports Day scheduled for next week",
      time: "1 hour ago",
      icon: Calendar,
      color: "emerald",
    },
    {
      id: 3,
      title: "Staff meeting",
      description: "Monthly staff meeting scheduled",
      time: "3 hours ago",
      icon: BarChart3,
      color: "violet",
    },
    {
      id: 4,
      title: "Payment received",
      description: "Fee payment for Class 5",
      time: "Yesterday",
      icon: CreditCard,
      color: "amber",
    },
  ];

  // Sample performance data
  const performanceMetrics = [
    { label: "Attendance Rate", value: 94, color: "bg-blue-600" },
    { label: "Test Scores", value: 87, color: "bg-emerald-600" },
    { label: "Parent Satisfaction", value: 96, color: "bg-violet-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-blue-600 rounded-2xl p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
           <div>
             <h2 className="text-2xl md:text-3xl font-bold">Welcome back, Admin!</h2>
             <p className="text-blue-100 mt-1">Here&apos;s what&apos;s happening at Asswiddiq School today</p>
           </div>
          <div className="flex gap-3">
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2">
              View Reports
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl text-sm font-medium transition-all">
              Quick Actions
            </button>
          </div>
        </div>
      </div>

       {/* Stats Cards */}
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
         {stats.map((stat) => (
           <div
             key={stat.title}
             className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all group cursor-pointer"
           >
             <div className="flex items-center justify-between">
               <div className="space-y-2">
                 <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.title}</p>
                 <p className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
                 <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                   </svg>
                   <span>+12.5%</span>
                 </div>
               </div>
               <div className={`w-14 h-14 rounded-xl ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                 <stat.icon className="w-6 h-6 text-white" />
               </div>
             </div>
             <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-blue-600 rounded-full" style={{ width: "70%" }}></div>
             </div>
           </div>
         ))}
       </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Performance Metrics */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Performance Overview</h3>
            <select className="text-sm border border-slate-200 rounded-xl px-3 py-1.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="space-y-5">
            {performanceMetrics.map((metric) => (
              <div key={metric.label}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700">{metric.label}</span>
                  <span className="text-sm font-bold text-slate-900">{metric.value}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`${metric.color} h-full rounded-full transition-all duration-500`} style={{ width: `${metric.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Recent Activities</h3>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </a>
          </div>
          <div className="space-y-4 p-6">
             {activities.map((activity) => {
               const colorMap = {
                 blue: "bg-blue-100 text-blue-600",
                 emerald: "bg-emerald-100 text-emerald-600",
                 violet: "bg-violet-100 text-violet-600",
                 amber: "bg-amber-100 text-amber-600",
               };
               return (
                <div key={activity.id} className="flex items-start gap-4 group">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorMap[activity.color]} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <activity.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-900 truncate">{activity.title}</h4>
                    <p className="text-sm text-slate-500 truncate">{activity.description}</p>
                    <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

       {/* Quick Actions Grid */}
       <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {["Events", "Students", "Staff", "Reports"].map((item) => (
           <button
             key={item}
             className="bg-white rounded-2xl border border-slate-200 p-6 text-left hover:shadow-lg hover:border-blue-200 transition-all group"
           >
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 002-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
               </svg>
             </div>
             <div className="flex items-center justify-between">
               <span className="font-semibold text-slate-900">Manage {item}</span>
               <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
             </div>
           </button>
         ))}
       </div>
    </div>
  );
}