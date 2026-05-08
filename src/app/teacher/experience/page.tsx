'use client';

import { Star, Users, Award } from 'lucide-react';

export default function TeacherExperience() {
  return (
    <div className="space-y-8">
      {/* Teaching Experience Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
          <div className="text-center">
            <div className="p-4 bg-gradient-to-br from-primary to-blue-600 rounded-xl shadow-lg w-fit mx-auto mb-4">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">8 Years</h3>
            <p className="text-gray-600">Teaching Experience</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
          <div className="text-center">
            <div className="p-4 bg-gradient-to-br from-secondary to-red-600 rounded-xl shadow-lg w-fit mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">450+</h3>
            <p className="text-gray-600">Students Taught</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
          <div className="text-center">
            <div className="p-4 bg-gradient-to-br from-accent to-yellow-600 rounded-xl shadow-lg w-fit mx-auto mb-4">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">15</h3>
            <p className="text-gray-600">Certifications</p>
          </div>
        </div>
      </div>

      {/* Professional Development */}
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Professional Development</h3>
          <p className="text-gray-600">Continuous learning and skill enhancement</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Certifications & Training</h4>
            <div className="space-y-3">
              {[
                { title: 'Advanced Mathematics Teaching', issuer: 'State Board', year: '2023' },
                { title: 'Digital Learning Tools', issuer: 'EdTech Institute', year: '2022' },
                { title: 'Student Assessment Methods', issuer: 'National Education', year: '2021' },
                { title: 'Classroom Management', issuer: 'Professional Development', year: '2020' },
              ].map((cert, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50/50 rounded-xl">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Award className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{cert.title}</p>
                    <p className="text-sm text-gray-600">{cert.issuer} • {cert.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Skills & Expertise</h4>
            <div className="space-y-4">
              {[
                { skill: 'Mathematics', level: 95 },
                { skill: 'Teaching Methodology', level: 90 },
                { skill: 'Student Assessment', level: 88 },
                { skill: 'Digital Tools', level: 85 },
                { skill: 'Classroom Management', level: 92 },
              ].map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">{skill.skill}</span>
                    <span className="text-primary font-semibold">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Teaching Philosophy */}
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Teaching Philosophy</h3>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed mb-4">
            I believe that every student has the potential to succeed when given the right guidance, support, and learning environment.
            My teaching approach focuses on creating an inclusive classroom where students feel valued and motivated to learn.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Through innovative teaching methods, personalized attention, and the integration of technology, I strive to make learning
            engaging and relevant to real-world applications. I am committed to continuous professional development to stay current
            with the latest educational trends and technologies.
          </p>
          <p className="text-gray-700 leading-relaxed">
            My goal is not just to impart knowledge, but to inspire a lifelong love of learning and equip students with the skills
            they need to thrive in an ever-changing world.
          </p>
        </div>
      </div>
    </div>
  );
}