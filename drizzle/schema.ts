import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Multi-Agent System Tables
export const agents = mysqlTable("agents", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["scout", "worker"]).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  status: mysqlEnum("status", ["idle", "moving", "working", "charging"]).default("idle").notNull(),
  positionX: int("positionX").default(0).notNull(),
  positionY: int("positionY").default(0).notNull(),
  energyLevel: int("energyLevel").default(100).notNull(), // 0-100
  payloadCapacity: int("payloadCapacity").default(0).notNull(), // in ml
  currentPayload: int("currentPayload").default(0).notNull(), // in ml
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const tasks = mysqlTable("tasks", {
  id: int("id").autoincrement().primaryKey(),
  simulationId: int("simulationId").notNull(),
  type: mysqlEnum("type", ["spray", "inspect"]).notNull(),
  priority: int("priority").default(1).notNull(), // 1-10
  status: mysqlEnum("status", ["pending", "bidding", "assigned", "in_progress", "completed"]).default("pending").notNull(),
  areaX: int("areaX").notNull(),
  areaY: int("areaY").notNull(),
  infestationDensity: int("infestationDensity").default(0).notNull(), // 0-100
  assignedAgentId: int("assignedAgentId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export const simulationRuns = mysqlTable("simulationRuns", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  status: mysqlEnum("status", ["running", "paused", "completed"]).default("running").notNull(),
  totalTasks: int("totalTasks").default(0).notNull(),
  completedTasks: int("completedTasks").default(0).notNull(),
  totalEnergyUsed: int("totalEnergyUsed").default(0).notNull(),
  totalPesticideUsed: int("totalPesticideUsed").default(0).notNull(), // in ml
  startTime: timestamp("startTime").defaultNow().notNull(),
  endTime: timestamp("endTime"),
});

export const taskBids = mysqlTable("taskBids", {
  id: int("id").autoincrement().primaryKey(),
  taskId: int("taskId").notNull(),
  agentId: int("agentId").notNull(),
  bidValue: int("bidValue").notNull(), // lower is better
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = typeof agents.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;
export type SimulationRun = typeof simulationRuns.$inferSelect;
export type InsertSimulationRun = typeof simulationRuns.$inferInsert;
export type TaskBid = typeof taskBids.$inferSelect;
export type InsertTaskBid = typeof taskBids.$inferInsert;