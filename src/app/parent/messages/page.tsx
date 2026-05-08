'use client';

import { Mail, Send } from 'lucide-react';

const messages = [
  { id: 1, from: 'Mr. Johnson (Math Teacher)', subject: 'Great performance in recent test', time: '2 hours ago', read: false, type: 'teacher' },
  { id: 2, from: 'Mrs. Smith (Principal)', subject: 'School newsletter - May edition', time: '1 day ago', read: true, type: 'admin' },
  { id: 3, from: 'Ms. Davis (Science Teacher)', subject: 'Lab safety reminder', time: '2 days ago', read: true, type: 'teacher' },
  { id: 4, from: 'School Administration', subject: 'Fee payment reminder', time: '3 days ago', read: false, type: 'admin' },
];

export default function ParentMessages() {
  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Messages & Communications</h3>
          <p className="text-gray-600">Communicate with teachers and school administration</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <div className="text-3xl font-bold text-blue-600 mb-2">4</div>
            <div className="text-sm font-medium text-blue-800">Total Messages</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <div className="text-3xl font-bold text-green-600 mb-2">2</div>
            <div className="text-sm font-medium text-green-800">Unread</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
            <div className="text-sm font-medium text-purple-800">Response Rate</div>
          </div>
        </div>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`border border-gray-200/50 p-6 rounded-xl hover:shadow-lg transition-all duration-300 ${message.read ? 'bg-white/50' : 'bg-blue-50/50 border-blue-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${message.read ? 'bg-gray-300' : 'bg-blue-500'}`}></div>
                    <h4 className="font-semibold text-gray-900">{message.from}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      message.type === 'teacher' ? 'bg-green-100 text-green-800' :
                      message.type === 'admin' ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {message.type}
                    </span>
                  </div>
                  <p className="text-gray-800 font-medium mb-1">{message.subject}</p>
                  <p className="text-gray-500 text-sm">{message.time}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Mail className="h-5 w-5" />
                  </button>
                  <button className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200/50">
          <button className="w-full bg-gradient-to-r from-primary to-blue-600 text-white py-3 px-6 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-medium flex items-center justify-center">
            <Send className="h-5 w-5 mr-2" />
            Compose New Message
          </button>
        </div>
      </div>
    </div>
  );
}