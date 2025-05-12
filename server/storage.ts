import { DirectoryStructure, InsertDirectoryStructure, Scene, User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createDirectoryStructure(directory: InsertDirectoryStructure): Promise<DirectoryStructure>;
  getDirectoryStructure(id: number): Promise<DirectoryStructure | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private directories: Map<number, DirectoryStructure>;
  currentUserId: number;
  currentDirectoryId: number;

  constructor() {
    this.users = new Map();
    this.directories = new Map();
    this.currentUserId = 1;
    this.currentDirectoryId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createDirectoryStructure(directory: InsertDirectoryStructure): Promise<DirectoryStructure> {
    const id = this.currentDirectoryId++;
    const newDirectory: DirectoryStructure = {
      ...directory,
      id,
      createdAt: new Date().toISOString(),
    };
    this.directories.set(id, newDirectory);
    return newDirectory;
  }

  async getDirectoryStructure(id: number): Promise<DirectoryStructure | undefined> {
    return this.directories.get(id);
  }
}

export const storage = new MemStorage();
