'use client';

import { CalendarDays } from 'lucide-react';

const events = [
  { id: 1, title: 'Parent-Teacher Meeting', date: '2024-05-15', description: 'Discuss student progress', type: 'meeting', priority: 'high' },
  { id: 2, title: 'School Sports Day', date: '2024-05-20', description: 'Annual sports event', type: 'sports', priority: 'medium' },
  { id: 3, title: 'Science Fair', date: '2024-06-01', description: 'Student projects showcase', type: 'academic', priority: 'high' },
  { id: 4, title: 'School Picnic', date: '2024-06-15', description: 'End of semester celebration', type: 'social', priority: 'low' },
  { id: 5, title: 'Career Guidance Session', date: '2024-06-20', description: 'Future planning workshop', type: 'academic', priority: 'medium' },
];

export default function ParentEvents() {
  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">School Events</h3>
          <p className="text-gray-600">Upcoming events and important dates</p>
        </div>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="border border-gray-200/50 p-6 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      event.priority === 'high' ? 'bg-red-100 text-red-800' :
                      event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {event.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                  <p className="text-gray-500 text-sm">Date: {event.date}</p>
                  <p className="text-gray-500 text-sm">Type: {event.type}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    RSVP
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