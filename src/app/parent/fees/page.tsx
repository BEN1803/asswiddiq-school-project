'use client';

import { CreditCard, DollarSign } from 'lucide-react';

export default function ParentFees() {
  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Fee Management</h3>
          <p className="text-gray-600">View and pay school fees</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <div className="text-3xl font-bold text-green-600 mb-2">$2,500</div>
            <div className="text-sm font-medium text-green-800">Paid This Year</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
            <div className="text-3xl font-bold text-red-600 mb-2">$500</div>
            <div className="text-sm font-medium text-red-800">Outstanding</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <div className="text-3xl font-bold text-blue-600 mb-2">$3,000</div>
            <div className="text-sm font-medium text-blue-800">Total Annual</div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="border border-gray-200/50 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">Tuition Fee - May 2024</h4>
                <p className="text-gray-600 text-sm">Due Date: May 15, 2024</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">$500</p>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Pending</span>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-primary to-blue-600 text-white py-3 px-6 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-medium flex items-center justify-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Pay Now
            </button>
          </div>
          <div className="border border-gray-200/50 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">Activity Fee - April 2024</h4>
                <p className="text-gray-600 text-sm">Paid on April 10, 2024</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">$200</p>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Paid</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}