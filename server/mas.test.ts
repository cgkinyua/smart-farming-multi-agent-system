import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { 
  createAgent, 
  createSimulation, 
  createTask,
  getAllAgents,
  getTasksBySimulation,
  deleteAgent,
} from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("Multi-Agent System", () => {
  describe("Agent Management", () => {
    it("should create a worker agent", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agents.create({
        type: "worker",
        name: "Test Worker",
        payloadCapacity: 5000,
      });

      expect(result).toBeDefined();
    });

    it("should create a scout agent", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agents.create({
        type: "scout",
        name: "Test Scout",
      });

      expect(result).toBeDefined();
    });

    it("should list all agents", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      // Create a test agent first
      await caller.agents.create({
        type: "worker",
        name: "List Test Agent",
      });

      const agents = await caller.agents.list();
      expect(Array.isArray(agents)).toBe(true);
      expect(agents.length).toBeGreaterThan(0);
    });

    it("should delete an agent", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      // Create an agent
      const createResult = await caller.agents.create({
        type: "worker",
        name: "Agent to Delete",
      });

      // Extract the insertId from the result
      const insertId = (createResult as any)[0]?.insertId || (createResult as any).insertId;
      const agentId = Number(insertId);

      // Delete the agent
      await caller.agents.delete({ id: agentId });

      // Verify it's deleted
      const agents = await getAllAgents();
      const deletedAgent = agents.find(a => a.id === agentId);
      expect(deletedAgent).toBeUndefined();
    });
  });

  describe("Simulation Management", () => {
    it("should create a simulation with tasks", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.simulations.create({
        name: "Test Simulation",
        taskCount: 5,
      });

      expect(result).toBeDefined();
      expect(result.id).toBeGreaterThan(0);

      // Verify tasks were created
      const tasks = await caller.simulations.getTasks({
        simulationId: result.id,
      });

      expect(tasks.length).toBe(5);
    });

    it("should list all simulations", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      // Create a test simulation
      await caller.simulations.create({
        name: "List Test Simulation",
        taskCount: 3,
      });

      const simulations = await caller.simulations.list();
      expect(Array.isArray(simulations)).toBe(true);
      expect(simulations.length).toBeGreaterThan(0);
    });

    it("should get simulation by id", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const createResult = await caller.simulations.create({
        name: "Get Test Simulation",
        taskCount: 2,
      });

      const simulation = await caller.simulations.get({
        id: createResult.id,
      });

      expect(simulation).toBeDefined();
      expect(simulation?.name).toBe("Get Test Simulation");
      expect(simulation?.totalTasks).toBe(2);
    });
  });

  describe("Contract Net Protocol", () => {
    it("should execute a simulation step with task allocation", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      // Create agents
      await caller.agents.create({
        type: "worker",
        name: "Worker 1",
        payloadCapacity: 5000,
      });

      await caller.agents.create({
        type: "worker",
        name: "Worker 2",
        payloadCapacity: 5000,
      });

      // Create simulation
      const simResult = await caller.simulations.create({
        name: "Contract Net Test",
        taskCount: 3,
      });

      // Execute a step
      const stepResult = await caller.simulations.step({
        simulationId: simResult.id,
      });

      expect(stepResult).toBeDefined();
      expect(stepResult.message).toBeDefined();

      // If a task was assigned, verify it
      if (stepResult.taskId) {
        expect(stepResult.assignedTo).toBeGreaterThan(0);
      }
    });

    it("should handle no available agents gracefully", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      // Delete all existing agents first
      const existingAgents = await getAllAgents();
      for (const agent of existingAgents) {
        await deleteAgent(agent.id);
      }

      // Create simulation without agents
      const simResult = await caller.simulations.create({
        name: "No Agents Test",
        taskCount: 2,
      });

      // Execute a step
      const stepResult = await caller.simulations.step({
        simulationId: simResult.id,
      });

      expect(stepResult).toBeDefined();
      expect(stepResult.message).toBe("No bids received");
    });

    it("should update simulation stats after task completion", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      // Create an agent
      await caller.agents.create({
        type: "worker",
        name: "Stats Test Worker",
        payloadCapacity: 5000,
      });

      // Create simulation
      const simResult = await caller.simulations.create({
        name: "Stats Test",
        taskCount: 1,
      });

      // Execute a step
      await caller.simulations.step({
        simulationId: simResult.id,
      });

      // Check updated stats
      const updatedSim = await caller.simulations.get({
        id: simResult.id,
      });

      expect(updatedSim).toBeDefined();
      // Stats should be updated if task was completed
      if (updatedSim && updatedSim.completedTasks > 0) {
        expect(updatedSim.totalEnergyUsed).toBeGreaterThan(0);
      }
    });
  });
});
