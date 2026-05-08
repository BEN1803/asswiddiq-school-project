'use client';

const assignments = [
  { id: 1, subject: 'Mathematics', title: 'Algebra Assignment', dueDate: '2024-05-18', status: 'pending', grade: null },
  { id: 2, subject: 'Science', title: 'Physics Lab Report', dueDate: '2024-05-20', status: 'submitted', grade: 'A-' },
  { id: 3, subject: 'English', title: 'Essay on Literature', dueDate: '2024-05-22', status: 'pending', grade: null },
  { id: 4, subject: 'History', title: 'World War II Project', dueDate: '2024-05-25', status: 'completed', grade: 'A' },
];

export default function ParentAssignments() {
  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Assignments</h3>
          <p className="text-gray-600">Track and manage student assignments</p>
        </div>
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="border border-gray-200/50 p-6 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      assignment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      assignment.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {assignment.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{assignment.subject}</p>
                  <p className="text-gray-500 text-sm">Due: {assignment.dueDate}</p>
                  {assignment.grade && (
                    <p className="text-green-600 text-sm font-medium mt-1">Grade: {assignment.grade}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}