import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { insertTaskSchema } from "@db/schema";
import type { InsertTask, SelectTask, SelectTag } from "@db/schema";

const CATEGORIES = [
  "Work",
  "Personal",
  "Shopping",
  "Health",
  "Finance",
  "Others",
] as const;

interface TaskFormProps {
  taskToEdit?: SelectTask & { tags?: SelectTag[] };
}

export function TaskForm({ taskToEdit }: TaskFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const { data: tags } = useQuery({
    queryKey: ['/api/tags'],
    queryFn: async () => {
      const response = await fetch('/api/tags');
      if (!response.ok) throw new Error('Failed to fetch tags');
      return response.json() as Promise<SelectTag[]>;
    },
  });

  const form = useForm<InsertTask>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      title: taskToEdit?.title || "",
      description: taskToEdit?.description || "",
      priority: taskToEdit?.priority || "medium",
      category: taskToEdit?.category || "others",
      completed: taskToEdit?.completed || false,
      dueDate: taskToEdit?.dueDate || undefined,
    },
  });

  useEffect(() => {
    if (taskToEdit?.tags) {
      setSelectedTags(taskToEdit.tags.map(tag => tag.id));
    }
  }, [taskToEdit]);

  const { mutate } = useMutation({
    mutationFn: async (values: InsertTask) => {
      const endpoint = taskToEdit 
        ? `/api/tasks/${taskToEdit.id}`
        : "/api/tasks";

      const method = taskToEdit ? "PUT" : "POST";
      console.log(`${method}ing task with data:`, values);

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, tagIds: selectedTags }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to ${taskToEdit ? 'update' : 'create'} task: ${error}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      form.reset();
      setSelectedTags([]);
      toast({
        title: "Success",
        description: `Task ${taskToEdit ? 'updated' : 'created'} successfully`,
      });
    },
    onError: (error: Error) => {
      console.error('Task mutation error:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${taskToEdit ? 'update' : 'create'} task`,
        variant: "destructive",
      });
    },
    onSettled: () => setIsSubmitting(false),
  });

  function onSubmit(values: InsertTask) {
    console.log('Form submitted with values:', values);
    setIsSubmitting(true);
    mutate(values);
  }

  const toggleTag = (tagId: number) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Task description" 
                  {...field} 
                  value={field.value || ''} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <Input 
                  type="datetime-local" 
                  {...field} 
                  value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''} 
                  onChange={e => field.onChange(e.target.value ? new Date(e.target.value) : null)} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Tags</FormLabel>
          <div className="flex flex-wrap gap-2">
            {tags?.map((tag) => (
              <Badge
                key={tag.id}
                variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                className="cursor-pointer"
                style={{
                  backgroundColor: selectedTags.includes(tag.id) ? tag.color : 'transparent',
                  borderColor: tag.color,
                }}
                onClick={() => toggleTag(tag.id)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (taskToEdit ? "Updating..." : "Creating...") : (taskToEdit ? "Update Task" : "Create Task")}
        </Button>
      </form>
    </Form>
  );
}