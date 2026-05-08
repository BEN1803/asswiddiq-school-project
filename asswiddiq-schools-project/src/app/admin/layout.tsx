import Sidebar from "@/components/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="lg:ml-64 p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}