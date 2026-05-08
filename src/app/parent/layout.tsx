import ParentSidebar from "@/components/parent-sidebar";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <ParentSidebar />
      <main className="lg:ml-64 p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}