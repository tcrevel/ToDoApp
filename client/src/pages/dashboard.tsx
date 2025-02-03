import { UserNav } from "@/components/dashboard/user-nav";
import { TaskList } from "@/components/dashboard/TaskList";
import { TaskForm } from "@/components/dashboard/TaskForm";
import { useAuthStore } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="h-16 px-4 flex items-center justify-between border-b">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <span className="sr-only">Open menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Tasks</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.displayName || 'User'}!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="default" className="rounded-full w-10 h-10">
                <Plus className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add Task</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <TaskForm />
              </div>
            </SheetContent>
          </Sheet>
          <UserNav />
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <TaskList />
      </main>
    </div>
  );
}