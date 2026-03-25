import Sidebar from "@/components/dashboard/Sidebar";
import BottomNav from "@/components/dashboard/BottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FDFCFB]">
      <Sidebar />

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          {" "}
          {/* Tambah padding bottom di mobile */}
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8 lg:px-12 lg:py-10">
            {children}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
