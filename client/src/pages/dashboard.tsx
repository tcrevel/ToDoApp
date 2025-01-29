import { Sidebar } from "@/components/dashboard/sidebar";
import { UserNav } from "@/components/dashboard/user-nav";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { ChartCard } from "@/components/dashboard/chart-card";
import { useAuthStore } from "@/lib/auth";

export default function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div className="flex h-screen">
      <div className="w-64 flex-none">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b px-6 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="font-semibold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.displayName || 'User'}!
            </p>
          </div>
          <UserNav />
        </header>
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <StatsGrid />
          <ChartCard />
        </main>
      </div>
    </div>
  );
}