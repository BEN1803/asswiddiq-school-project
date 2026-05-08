import Link from "next/link";
import { GraduationCap, Users, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-secondary relative overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Student Management System
            </h1>
            <p className="text-xl md:text-2xl text-white text-opacity-90 max-w-2xl mx-auto">
              A modern platform connecting teachers, parents, and students for better educational outcomes
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 group">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl mr-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Teacher Portal</h2>
              </div>
              <p className="text-white text-opacity-90 mb-6 leading-relaxed">
                Manage classes, track student performance, view analytics, and update your profile.
              </p>
              <Link
                href="/teacher"
                className="inline-flex items-center px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-accent hover:text-white transition-all duration-300 group-hover:shadow-lg"
              >
                Access Portal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 group">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl mr-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Parent Portal</h2>
              </div>
              <p className="text-white text-opacity-90 mb-6 leading-relaxed">
                Monitor your child's progress, view results, check attendance, and stay updated with school events.
              </p>
              <Link
                href="/parent"
                className="inline-flex items-center px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-accent hover:text-white transition-all duration-300 group-hover:shadow-lg"
              >
                Access Portal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-white mb-8">Key Features</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                <div className="text-accent mb-3">
                  <GraduationCap className="h-8 w-8 mx-auto" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Academic Tracking</h4>
                <p className="text-white text-opacity-80 text-sm">Real-time monitoring of student performance and progress</p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                <div className="text-accent mb-3">
                  <Users className="h-8 w-8 mx-auto" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Communication</h4>
                <p className="text-white text-opacity-80 text-sm">Seamless interaction between teachers, parents, and students</p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                <div className="text-accent mb-3">
                  <ArrowRight className="h-8 w-8 mx-auto" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Data Analytics</h4>
                <p className="text-white text-opacity-80 text-sm">Comprehensive insights with beautiful visualizations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
