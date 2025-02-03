import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { SelectTask, SelectTag } from "@db/schema";

interface TaskWithTags extends SelectTask {
  tags?: SelectTag[];
}

export function TaskList() {
  const { toast } = useToast();
  const { data: tasks, isLoading } = useQuery<TaskWithTags[]>({
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
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{task.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  {task.category}
                </Badge>
              </div>
              {task.description && (
                <p className="text-sm text-gray-500">{task.description}</p>
              )}
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {task.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      className="text-xs"
                      style={{
                        backgroundColor: tag.color,
                        color: getContrastColor(tag.color),
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
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

function getContrastColor(bgColor: string) {
  // Convert hex to RGB
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#ffffff';
}