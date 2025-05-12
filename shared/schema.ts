import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Directory structure schema
export const directoryStructures = pgTable("directory_structures", {
  id: serial("id").primaryKey(),
  projectName: text("project_name").notNull(),
  username: text("username").notNull(),
  artistType: text("artist_type").notNull(),
  scenes: jsonb("scenes"),
  createdAt: text("created_at").notNull(),
});

export const directorySchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  username: z.string().min(1, "Username is required"),
  artistType: z.enum(["editor", "motion", "cg", "vfx"]),
  scenes: z.array(
    z.object({
      name: z.string(),
      shots: z.array(
        z.object({
          name: z.string()
        })
      )
    })
  ).optional(),
});

export const insertDirectorySchema = createInsertSchema(directoryStructures).pick({
  projectName: true,
  username: true,
  artistType: true,
  scenes: true,
});

export type Scene = {
  name: string;
  shots: { name: string }[];
};

export type DirectoryStructure = z.infer<typeof directorySchema>;
export type InsertDirectoryStructure = z.infer<typeof insertDirectorySchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
