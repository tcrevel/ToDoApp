import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { SelectTask } from "@db/schema";

export function TaskList() {
  const { toast } = useToast();
  const { data: tasks, isLoading } = useQuery<SelectTask[]>({
    queryKey: ['/api/tasks'],
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks?.map((task) => (
        <Card key={task.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{task.title}</h3>
              {task.description && (
                <p className="text-sm text-gray-500">{task.description}</p>
              )}
            </div>
            <div className={`px-2 py-1 rounded text-xs ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span>Due: {new Date(task.dueDate!).toLocaleDateString()}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

function getPriorityColor(priority: string) {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
