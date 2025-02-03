import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { tasks, tags, taskTags } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Tasks endpoints
  app.get("/api/tasks", async (req, res) => {
    try {
      const allTasks = await db.query.tasks.findMany({
        with: {
          tags: {
            with: {
              tag: true
            }
          }
        },
      });

      // Transform the result to match the expected format
      const tasksWithTags = allTasks.map(task => ({
        ...task,
        tags: task.tags.map(tt => tt.tag)
      }));

      res.json(tasksWithTags);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      // Remove any userId if it was sent
      const { userId, ...taskData } = req.body;

      const [newTask] = await db.insert(tasks)
        .values(taskData)
        .returning();

      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { userId, ...taskData } = req.body;

      const [updatedTask] = await db
        .update(tasks)
        .set(taskData)
        .where(eq(tasks.id, id))
        .returning();

      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Update task tags if provided
      if (taskData.tagIds) {
        // First remove all existing tag associations
        await db.delete(taskTags).where(eq(taskTags.taskId, id));

        // Then add new ones
        if (taskData.tagIds.length > 0) {
          await db.insert(taskTags)
            .values(
              taskData.tagIds.map(tagId => ({
                taskId: id,
                tagId: tagId
              }))
            );
        }
      }

      res.json(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      // First delete all tag associations
      await db.delete(taskTags).where(eq(taskTags.taskId, id));

      // Then delete the task
      const [deletedTask] = await db
        .delete(tasks)
        .where(eq(tasks.id, id))
        .returning();

      if (!deletedTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.json(deletedTask);
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Tags endpoints (unchanged)
  app.get("/api/tags", async (_req, res) => {
    try {
      const allTags = await db.select().from(tags);
      res.json(allTags);
    } catch (error) {
      console.error('Error fetching tags:', error);
      res.status(500).json({ message: "Failed to fetch tags" });
    }
  });

  app.post("/api/tags", async (req, res) => {
    try {
      const [newTag] = await db.insert(tags)
        .values(req.body)
        .returning();
      res.status(201).json(newTag);
    } catch (error) {
      console.error('Error creating tag:', error);
      res.status(500).json({ message: "Failed to create tag" });
    }
  });

  // Task-Tags association endpoint
  app.post("/api/task-tags", async (req, res) => {
    try {
      const { taskId, tagId } = req.body;
      const [association] = await db.insert(taskTags)
        .values({ taskId, tagId })
        .returning();
      res.status(201).json(association);
    } catch (error) {
      console.error('Error associating tag with task:', error);
      res.status(500).json({ message: "Failed to associate tag with task" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}