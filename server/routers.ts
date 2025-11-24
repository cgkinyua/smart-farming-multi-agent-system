import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Multi-Agent System routers
  agents: router({
    list: publicProcedure.query(async () => {
      const { getAllAgents } = await import("./db");
      return await getAllAgents();
    }),
    create: publicProcedure
      .input(z.object({
        type: z.enum(["scout", "worker"]),
        name: z.string(),
        payloadCapacity: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { createAgent } = await import("./db");
        return await createAgent({
          type: input.type,
          name: input.name,
          payloadCapacity: input.payloadCapacity || (input.type === "worker" ? 5000 : 0),
          currentPayload: input.type === "worker" ? 5000 : 0,
        });
      }),
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const { deleteAgent } = await import("./db");
        return await deleteAgent(input.id);
      }),
  }),

  simulations: router({
    list: publicProcedure.query(async () => {
      const { getAllSimulations } = await import("./db");
      return await getAllSimulations();
    }),
    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { getSimulationById } = await import("./db");
        return await getSimulationById(input.id);
      }),
    create: publicProcedure
      .input(z.object({
        name: z.string(),
        taskCount: z.number().default(10),
      }))
      .mutation(async ({ input }) => {
        const { createSimulation, createTask } = await import("./db");
        
        // Create simulation
        const simResult = await createSimulation({
          name: input.name,
          totalTasks: input.taskCount,
        });
        
        // Extract the insertId from the result
        const insertId = (simResult as any)[0]?.insertId || (simResult as any).insertId;
        const simulationId = Number(insertId);
        
        // Generate random tasks
        for (let i = 0; i < input.taskCount; i++) {
          await createTask({
            simulationId,
            type: "spray",
            priority: Math.floor(Math.random() * 10) + 1,
            areaX: Math.floor(Math.random() * 100),
            areaY: Math.floor(Math.random() * 100),
            infestationDensity: Math.floor(Math.random() * 100),
          });
        }
        
        return { id: simulationId };
      }),
    getTasks: publicProcedure
      .input(z.object({ simulationId: z.number() }))
      .query(async ({ input }) => {
        const { getTasksBySimulation } = await import("./db");
        return await getTasksBySimulation(input.simulationId);
      }),
    step: publicProcedure
      .input(z.object({ simulationId: z.number() }))
      .mutation(async ({ input }) => {
        const { 
          getAllAgents, 
          getPendingTasks, 
          updateTaskStatus, 
          createBid, 
          getBidsByTask,
          updateAgentStatus,
          getSimulationById,
          updateSimulationStats,
        } = await import("./db");
        
        const agents = await getAllAgents();
        const pendingTasks = await getPendingTasks(input.simulationId);
        
        if (pendingTasks.length === 0) {
          return { message: "No pending tasks" };
        }
        
        // Contract Net Protocol: Task Announcement
        const task = pendingTasks[0];
        if (!task) return { message: "No tasks available" };
        
        // Update task status to bidding
        await updateTaskStatus(task.id, "bidding");
        
        // Agents submit bids
        for (const agent of agents) {
          if (agent.type === "worker" && agent.energyLevel > 20 && agent.currentPayload > 0) {
            // Calculate bid value (distance + energy cost)
            const distance = Math.sqrt(
              Math.pow(agent.positionX - task.areaX, 2) + 
              Math.pow(agent.positionY - task.areaY, 2)
            );
            const bidValue = Math.floor(distance + (100 - agent.energyLevel));
            
            await createBid({
              taskId: task.id,
              agentId: agent.id,
              bidValue,
            });
          }
        }
        
        // Select best bid (lowest value)
        const bids = await getBidsByTask(task.id);
        if (bids.length === 0) {
          await updateTaskStatus(task.id, "pending");
          return { message: "No bids received" };
        }
        
        const bestBid = bids.reduce((min, bid) => bid.bidValue < min.bidValue ? bid : min);
        
        // Assign task to winner
        await updateTaskStatus(task.id, "assigned", bestBid.agentId);
        
        // Simulate task execution
        const winningAgent = agents.find(a => a.id === bestBid.agentId);
        if (winningAgent) {
          const distance = Math.sqrt(
            Math.pow(winningAgent.positionX - task.areaX, 2) + 
            Math.pow(winningAgent.positionY - task.areaY, 2)
          );
          
          const energyCost = Math.floor(distance * 0.5);
          const pesticideUsed = Math.floor(task.infestationDensity * 10);
          
          await updateAgentStatus(
            winningAgent.id,
            "working",
            task.areaX,
            task.areaY,
            Math.max(0, winningAgent.energyLevel - energyCost),
            Math.max(0, winningAgent.currentPayload - pesticideUsed)
          );
          
          await updateTaskStatus(task.id, "completed");
          
          // Update simulation stats
          const sim = await getSimulationById(input.simulationId);
          if (sim) {
            await updateSimulationStats(input.simulationId, {
              completedTasks: sim.completedTasks + 1,
              totalEnergyUsed: sim.totalEnergyUsed + energyCost,
              totalPesticideUsed: sim.totalPesticideUsed + pesticideUsed,
            });
          }
        }
        
        return { 
          message: "Step completed",
          taskId: task.id,
          assignedTo: bestBid.agentId,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
