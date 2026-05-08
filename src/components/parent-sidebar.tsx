"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  TrendingUp,
  FileText,
  CalendarDays,
  MessageSquare,
  CreditCard,
  Info,
  Search,
  Menu,
  X,
  ChevronDown,
  School
} from "lucide-react";

const navItems = [
  {
    title: "Overview",
    href: "/parent/dashboard",
    icon: Home,
  },
  {
    title: "Results",
    href: "/parent/results",
    icon: TrendingUp,
  },
  {
    title: "Assignments",
    href: "/parent/assignments",
    icon: FileText,
  },
  {
    title: "Events",
    href: "/parent/events",
    icon: CalendarDays,
  },
  {
    title: "Messages",
    href: "/parent/messages",
    icon: MessageSquare,
  },
  {
    title: "Fees",
    href: "/parent/fees",
    icon: CreditCard,
  },
  {
    title: "Student Info",
    href: "/parent/info",
    icon: Info,
  },
  {
    title: "Search",
    href: "/parent/search",
    icon: Search,
  },
];

export default function ParentSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-slate-200"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-white border-r border-slate-200 transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
          {!isCollapsed && (
            <Link href="/parent/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <School className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-slate-900">Parent Portal</span>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform ${isCollapsed ? "rotate-90" : "-rotate-90"}`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                } ${isCollapsed ? "justify-center" : ""}`}
              >
                <item.icon className={`w-5 h-5 ${isCollapsed ? "" : "mr-2"}`} />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}