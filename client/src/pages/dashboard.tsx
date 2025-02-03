import { Sidebar } from "@/components/dashboard/sidebar";
import { UserNav } from "@/components/dashboard/user-nav";
import { TaskList } from "@/components/dashboard/TaskList";
import { TaskForm } from "@/components/dashboard/TaskForm";
import { useAuthStore } from "@/lib/auth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Dashboard() {
  const { user } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b px-4 md:px-6 flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
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
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </Button>
            <div className="space-y-1">
              <h1 className="font-semibold">Tasks</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user?.displayName || 'User'}!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Add Task Button - Mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button size="sm" className="md:hidden">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[90%]">
                <SheetHeader>
                  <SheetTitle>Add New Task</SheetTitle>
                  <SheetDescription>
                    Create a new task with details and reminder settings.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4">
                  <TaskForm />
                </div>
              </SheetContent>
            </Sheet>
            {/* Add Task Button - Desktop */}
            <Sheet>
              <SheetTrigger asChild>
                <Button className="hidden md:flex">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Add New Task</SheetTitle>
                  <SheetDescription>
                    Create a new task with details and reminder settings.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4">
                  <TaskForm />
                </div>
              </SheetContent>
            </Sheet>
            <UserNav />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
          <TaskList />
        </main>
      </div>
    </div>
  );
}