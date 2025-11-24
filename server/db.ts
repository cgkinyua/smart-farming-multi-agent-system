import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Multi-Agent System Queries

import { agents, tasks, simulationRuns, taskBids, Agent, Task, SimulationRun, TaskBid, InsertAgent, InsertTask, InsertSimulationRun, InsertTaskBid } from "../drizzle/schema";
import { desc, and } from "drizzle-orm";

export async function createAgent(agent: InsertAgent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(agents).values(agent);
  return result;
}

export async function getAllAgents() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(agents);
}

export async function getAgentById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(agents).where(eq(agents.id, id)).limit(1);
  return result[0];
}

export async function updateAgentStatus(id: number, status: Agent["status"], positionX?: number, positionY?: number, energyLevel?: number, currentPayload?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData: Partial<Agent> = { status };
  if (positionX !== undefined) updateData.positionX = positionX;
  if (positionY !== undefined) updateData.positionY = positionY;
  if (energyLevel !== undefined) updateData.energyLevel = energyLevel;
  if (currentPayload !== undefined) updateData.currentPayload = currentPayload;
  return await db.update(agents).set(updateData).where(eq(agents.id, id));
}

export async function deleteAgent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(agents).where(eq(agents.id, id));
}

export async function createTask(task: InsertTask) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(tasks).values(task);
  return result;
}

export async function getTasksBySimulation(simulationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(tasks).where(eq(tasks.simulationId, simulationId));
}

export async function getPendingTasks(simulationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(tasks).where(and(eq(tasks.simulationId, simulationId), eq(tasks.status, "pending")));
}

export async function updateTaskStatus(id: number, status: Task["status"], assignedAgentId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData: Partial<Task> = { status };
  if (assignedAgentId !== undefined) updateData.assignedAgentId = assignedAgentId;
  if (status === "completed") updateData.completedAt = new Date();
  return await db.update(tasks).set(updateData).where(eq(tasks.id, id));
}

export async function createSimulation(simulation: InsertSimulationRun) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(simulationRuns).values(simulation);
  return result;
}

export async function getAllSimulations() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(simulationRuns).orderBy(desc(simulationRuns.startTime));
}

export async function getSimulationById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(simulationRuns).where(eq(simulationRuns.id, id)).limit(1);
  return result[0];
}

export async function updateSimulationStats(id: number, stats: Partial<SimulationRun>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(simulationRuns).set(stats).where(eq(simulationRuns.id, id));
}

export async function createBid(bid: InsertTaskBid) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(taskBids).values(bid);
  return result;
}

export async function getBidsByTask(taskId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(taskBids).where(eq(taskBids.taskId, taskId));
}
