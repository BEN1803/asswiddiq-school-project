"use client";

import { useState, useMemo, type ChangeEvent, type FormEvent } from "react";
import { Plus, Search, Calendar as CalendarIcon, Users, Pencil, Trash2, X, ChevronDown, Clock, Tag } from "lucide-react";

const classOptions = [
  "Nursery",
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
];

type ParticipantType = "class" | "other";

type EventForm = {
  name: string;
  description: string;
  date: string;
  price: string;
  isFree: boolean;
  participantType: ParticipantType;
  classes: string[];
  otherParticipants: string;
};

type EventItem = EventForm & {
  id: number;
};

type StatColor = "blue" | "emerald" | "amber";

const defaultForm: EventForm = {
  name: "",
  description: "",
  date: "",
  price: "",
  isFree: false,
  participantType: "class",
  classes: [],
  otherParticipants: "",
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "free" | "paid">("all");

  const [form, setForm] = useState<EventForm>(defaultForm);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const name = target.name;
    const value = target.value;
    const type = target.type;
    const checked = type === "checkbox" ? target.checked : false;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    } as EventForm));
  };

  const toggleClass = (cls: string) => {
    setForm((prev) => {
      const exists = prev.classes.includes(cls);
      return {
        ...prev,
        classes: exists
          ? prev.classes.filter((c) => c !== cls)
          : [...prev.classes, cls],
      };
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editIndex !== null) {
      const updated = [...events];
      updated[editIndex] = { ...events[editIndex], ...form };
      setEvents(updated);
      setEditIndex(null);
    } else {
      setEvents([...events, { ...form, id: Date.now() }]);
    }

    setForm(defaultForm);
    setIsModalOpen(false);
  };

  const handleEdit = (index: number) => {
    setForm(events[index]);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const filtered = useMemo(() => {
    let result = events.filter((e) =>
      e.name.toLowerCase().includes(search.toLowerCase())
    );

    if (statusFilter === "free") {
      result = result.filter((e) => e.isFree);
    } else if (statusFilter === "paid") {
      result = result.filter((e) => !e.isFree);
    }

    return result;
  }, [events, search, statusFilter]);

  const isUpcoming = (dateStr: string) => {
    return new Date(dateStr) > new Date();
  };

  const getStatusBadge = (event: EventItem) => {
    const upcoming = isUpcoming(event.date);
    if (event.isFree) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Free
        </span>
      );
    }
    return upcoming
      ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Upcoming
          </span>
        )
      : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Past
          </span>
        );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      day: date.getDate(),
      year: date.getFullYear(),
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-purple-50/20 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <CalendarIcon className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -inset-1 bg-blue-600 rounded-2xl opacity-20 blur-lg -z-10" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-blue-600 tracking-tight">
                  Events Management
                </h1>
                <p className="text-slate-500 text-sm">Create and manage school events</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-64">
               <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                placeholder="Search events..."
                className="w-full pl-11 pr-4 py-2.5 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-400 hover:border-slate-300"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

             <div className="relative">
               <select
                 value={statusFilter}
                 onChange={(e) => setStatusFilter(e.target.value as "all" | "free" | "paid")}
                 className="appearance-none pl-4 pr-10 py-2.5 bg-white backdrop-blur-sm border border-slate-200 rounded-xl text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer hover:border-slate-300"
               >
                 <option value="all">All Status</option>
                 <option value="free">Free Only</option>
                 <option value="paid">Paid Only</option>
               </select>
               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
             </div>

            <button
              onClick={() => {
                setEditIndex(null);
                setIsModalOpen(true);
              }}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 font-medium active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event</span>
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {([
            { label: "Total Events", value: events.length, icon: CalendarIcon, color: "blue" as const },
            { label: "Free Events", value: events.filter((e) => e.isFree).length, icon: Tag, color: "emerald" as const },
            { label: "Upcoming", value: events.filter((e) => isUpcoming(e.date)).length, icon: Clock, color: "blue" as const },
            { label: "Participants", value: events.reduce((acc, e) => acc + (e.participantType === "class" ? e.classes.length : 1), 0), icon: Users, color: "amber" as const },
          ] as const).map((stat, idx) => {
            const colorClasses: Record<StatColor, { bg: string; text: string }> = {
              blue: { bg: "bg-blue-100", text: "text-blue-600" },
              emerald: { bg: "bg-emerald-100", text: "text-emerald-600" },
              amber: { bg: "bg-amber-100", text: "text-amber-600" },
            };
            const colors = colorClasses[stat.color];
            return (
              <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                    <p className={`text-2xl md:text-3xl font-bold mt-1 ${colors.text}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-current" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CONTENT AREA */}
        {filtered.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/60 p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-slate-100 to-slate-50 flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No events found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              {search || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Click 'Add Event' to create your first event and get started"}
            </p>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden lg:block bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              <table className="w-full">
                <thead className="bg-blue-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Participants</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-blue-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((e, i) => {
                    const dateInfo = formatDate(e.date);
                    return (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{e.name}</div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2 text-slate-600">
                             <CalendarIcon className="w-4 h-4 text-slate-500" />
                             <span className="text-sm">
                               {dateInfo.weekday}, {dateInfo.month} {dateInfo.day}, {dateInfo.year}
                             </span>
                             <span className="text-xs text-slate-400">at {dateInfo.time}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-semibold ${e.isFree ? 'text-emerald-600' : 'text-slate-700'}`}>
                            {e.isFree ? "Free" : `TZS ${Number(e.price).toLocaleString()}`}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {e.participantType === "class" ? (
                            <div className="flex flex-wrap gap-1.5">
                              {e.classes.slice(0, 3).map((cls, idx) => (
                                <span key={idx} className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium border border-blue-200">
                                  {cls}
                                </span>
                              ))}
                              {e.classes.length > 3 && (
                                <span className="text-xs text-slate-500 flex items-center">+{e.classes.length - 3} more</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-600 text-sm">{e.otherParticipants}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(e)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(i)}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:scale-95"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(i)}
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-95"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="lg:hidden space-y-4">
              {filtered.map((e, i) => {
                const dateInfo = formatDate(e.date);
                return (
                  <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/60 p-5 hover:shadow-md hover:border-slate-300/60 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 text-base mb-1">{e.name}</h3>
                        {getStatusBadge(e)}
                      </div>
                      <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(i)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:scale-95"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(i)}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-95"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                       <div className="flex items-center gap-2 text-sm text-slate-600">
                         <CalendarIcon className="w-4 h-4 text-slate-500" />
                         <span>{dateInfo.weekday}, {dateInfo.month} {dateInfo.day}, {dateInfo.year} at {dateInfo.time}</span>
                       </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className={`font-medium ${e.isFree ? 'text-emerald-600' : 'text-slate-700'}`}>
                          {e.isFree ? "Free Event" : `TZS ${Number(e.price).toLocaleString()}`}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-1.5">Participants</p>
                        {e.participantType === "class" ? (
                          <div className="flex flex-wrap gap-1.5">
                            {e.classes.map((cls, idx) => (
                              <span key={idx} className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                                {cls}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-slate-600">{e.otherParticipants}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* FOOTER STATS */}
        {filtered.length > 0 && (
          <div className="bg-white/60 backdrop-blur-sm rounded-xl px-6 py-3 border border-blue-100">
            <p className="text-sm text-slate-500 text-center">
              Showing <span className="font-semibold text-blue-600">{filtered.length}</span> of <span className="font-semibold text-blue-600">{events.length}</span> total events
            </p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  {editIndex !== null ? "Edit Event" : "Create New Event"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Event Name *</label>
                    <input
                      name="name"
                      placeholder="e.g. Sports Day, Science Fair"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Date & Time *</label>
                    <input
                      type="datetime-local"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    placeholder="Add a brief description of the event..."
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-slate-400 resize-none"
                  />
                </div>

              {/* PRICE */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Pricing</label>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">TZS</span>
                    <input
                      type="number"
                      name="price"
                      placeholder="0"
                      value={form.price}
                      onChange={handleChange}
                      disabled={form.isFree}
                      className="w-full pl-16 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <label className="flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      name="isFree"
                      checked={form.isFree}
                      onChange={(e) => {
                        handleChange(e);
                        if (e.target.checked) {
                          setForm((prev) => ({ ...prev, price: '' }));
                        }
                      }}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Free Event</span>
                  </label>
                </div>
              </div>

              {/* PARTICIPANT TYPE */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Participants</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
                    <input
                      type="radio"
                      name="participantType"
                      value="class"
                      checked={form.participantType === "class"}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Specific Classes</span>
                  </label>

                  <label className="flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
                    <input
                      type="radio"
                      name="participantType"
                      value="other"
                      checked={form.participantType === "other"}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Other Groups</span>
                  </label>
                </div>
              </div>

              {/* CLASS SELECT */}
              {form.participantType === "class" && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700">Select Classes</label>
                  <div className="flex flex-wrap gap-2">
                    {classOptions.map((cls) => (
                      <button
                        type="button"
                        key={cls}
                        onClick={() => toggleClass(cls)}
                        className={`px-4 py-2.5 border rounded-xl font-medium transition-all ${
                          form.classes.includes(cls)
                            ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                            : "bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-blue-50"
                        }`}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                </div>
              )}

                 {/* OTHER INPUT */}
                 {form.participantType === "other" && (
                   <div className="space-y-2">
                     <label className="block text-sm font-medium text-slate-700">Describe Participants</label>
                     <textarea
                       name="otherParticipants"
                       placeholder="e.g. Parents, Guardians, External Guests..."
                       value={form.otherParticipants}
                       onChange={handleChange}
                       rows={3}
                       className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-slate-400 resize-none"
                     />
                   </div>
                 )}

              {/* ACTIONS */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors active:scale-95"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl shadow-blue-500/25 active:scale-95"
                >
                  {editIndex !== null ? "Update Event" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
