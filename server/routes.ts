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
      const [newTask] = await db.insert(tasks)
        .values(req.body)
        .returning();
      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  // Tags endpoints
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