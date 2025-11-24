import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Play, Pause, RotateCcw, Plus } from "lucide-react";

export default function Simulation() {
  const [currentSimulationId, setCurrentSimulationId] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [newSimName, setNewSimName] = useState("");
  const [newSimTasks, setNewSimTasks] = useState(10);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentType, setNewAgentType] = useState<"scout" | "worker">("worker");

  const { data: simulations, refetch: refetchSimulations } = trpc.simulations.list.useQuery();
  const { data: agents, refetch: refetchAgents } = trpc.agents.list.useQuery();
  const { data: currentSim, refetch: refetchCurrentSim } = trpc.simulations.get.useQuery(
    { id: currentSimulationId! },
    { enabled: !!currentSimulationId }
  );
  const { data: tasks, refetch: refetchTasks } = trpc.simulations.getTasks.useQuery(
    { simulationId: currentSimulationId! },
    { enabled: !!currentSimulationId }
  );

  const createSimMutation = trpc.simulations.create.useMutation({
    onSuccess: (data) => {
      toast.success("Simulation created");
      setCurrentSimulationId(data.id);
      refetchSimulations();
      setNewSimName("");
    },
  });

  const createAgentMutation = trpc.agents.create.useMutation({
    onSuccess: () => {
      toast.success("Agent created");
      refetchAgents();
      setNewAgentName("");
    },
  });

  const deleteAgentMutation = trpc.agents.delete.useMutation({
    onSuccess: () => {
      toast.success("Agent deleted");
      refetchAgents();
    },
  });

  const stepMutation = trpc.simulations.step.useMutation({
    onSuccess: () => {
      refetchAgents();
      refetchTasks();
      refetchCurrentSim();
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && currentSimulationId) {
      interval = setInterval(() => {
        stepMutation.mutate({ simulationId: currentSimulationId });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, currentSimulationId]);

  const handleCreateSimulation = () => {
    if (!newSimName) {
      toast.error("Please enter a simulation name");
      return;
    }
    createSimMutation.mutate({ name: newSimName, taskCount: newSimTasks });
  };

  const handleCreateAgent = () => {
    if (!newAgentName) {
      toast.error("Please enter an agent name");
      return;
    }
    createAgentMutation.mutate({ name: newAgentName, type: newAgentType });
  };

  const pendingTasks = tasks?.filter(t => t.status === "pending") || [];
  const completedTasks = tasks?.filter(t => t.status === "completed") || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Smart Farming Multi-Agent System
          </h1>
          <p className="text-gray-600">
            Decentralized Heterogeneous Fleet Management for Precision Agriculture
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent Management */}
          <Card>
            <CardHeader>
              <CardTitle>Agent Fleet</CardTitle>
              <CardDescription>Manage your robot fleet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Agent Name</Label>
                <Input
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  placeholder="Enter agent name"
                />
              </div>
              <div className="space-y-2">
                <Label>Agent Type</Label>
                <select
                  value={newAgentType}
                  onChange={(e) => setNewAgentType(e.target.value as "scout" | "worker")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="worker">Worker (Aerial Drone)</option>
                  <option value="scout">Scout (Ground Robot)</option>
                </select>
              </div>
              <Button onClick={handleCreateAgent} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Agent
              </Button>

              <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                {agents?.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{agent.name}</div>
                      <div className="text-sm text-gray-500">
                        {agent.type === "worker" ? "🚁 Drone" : "🤖 Scout"} • Energy: {agent.energyLevel}%
                      </div>
                      <div className="text-xs text-gray-400">
                        Position: ({agent.positionX}, {agent.positionY})
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteAgentMutation.mutate({ id: agent.id })}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Simulation Control */}
          <Card>
            <CardHeader>
              <CardTitle>Simulation Control</CardTitle>
              <CardDescription>Create and manage simulations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Simulation Name</Label>
                <Input
                  value={newSimName}
                  onChange={(e) => setNewSimName(e.target.value)}
                  placeholder="Enter simulation name"
                />
              </div>
              <div className="space-y-2">
                <Label>Number of Tasks</Label>
                <Input
                  type="number"
                  value={newSimTasks}
                  onChange={(e) => setNewSimTasks(parseInt(e.target.value) || 10)}
                  min={1}
                  max={100}
                />
              </div>
              <Button onClick={handleCreateSimulation} className="w-full">
                Create Simulation
              </Button>

              {currentSimulationId && (
                <div className="mt-4 space-y-2">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setIsRunning(!isRunning)}
                      variant={isRunning ? "destructive" : "default"}
                      className="flex-1"
                    >
                      {isRunning ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => stepMutation.mutate({ simulationId: currentSimulationId })}
                      variant="outline"
                    >
                      Step
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                {simulations?.map((sim) => (
                  <div
                    key={sim.id}
                    className={`p-3 rounded-lg border cursor-pointer ${
                      currentSimulationId === sim.id ? "bg-blue-50 border-blue-300" : "bg-white"
                    }`}
                    onClick={() => {
                      setCurrentSimulationId(sim.id);
                      setIsRunning(false);
                    }}
                  >
                    <div className="font-medium">{sim.name}</div>
                    <div className="text-sm text-gray-500">
                      {sim.completedTasks}/{sim.totalTasks} tasks completed
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Simulation Metrics</CardTitle>
              <CardDescription>Real-time performance data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentSim ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium">{currentSim.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Tasks:</span>
                      <span className="font-medium">{currentSim.totalTasks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-medium text-green-600">{currentSim.completedTasks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pending:</span>
                      <span className="font-medium text-orange-600">{pendingTasks.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Energy Used:</span>
                      <span className="font-medium">{currentSim.totalEnergyUsed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pesticide Used:</span>
                      <span className="font-medium">{currentSim.totalPesticideUsed} ml</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium mb-2">Efficiency Metrics</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completion Rate:</span>
                        <span>
                          {((currentSim.completedTasks / currentSim.totalTasks) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avg Energy/Task:</span>
                        <span>
                          {currentSim.completedTasks > 0
                            ? (currentSim.totalEnergyUsed / currentSim.completedTasks).toFixed(1)
                            : "0"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avg Pesticide/Task:</span>
                        <span>
                          {currentSim.completedTasks > 0
                            ? (currentSim.totalPesticideUsed / currentSim.completedTasks).toFixed(1)
                            : "0"}{" "}
                          ml
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Create or select a simulation to view metrics
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Field Visualization */}
        {currentSimulationId && (
          <Card>
            <CardHeader>
              <CardTitle>Field Visualization</CardTitle>
              <CardDescription>Real-time view of agents and tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-96 bg-gradient-to-br from-green-100 to-green-200 rounded-lg border-2 border-green-300 overflow-hidden">
                {/* Grid background */}
                <svg className="absolute inset-0 w-full h-full">
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="green" strokeWidth="0.5" opacity="0.2" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Tasks */}
                {tasks?.map((task) => (
                  <div
                    key={task.id}
                    className="absolute"
                    style={{
                      left: `${task.areaX}%`,
                      top: `${task.areaY}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {task.status === "pending" && (
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" title={`Task ${task.id}: Pending`} />
                    )}
                    {task.status === "completed" && (
                      <div className="w-3 h-3 bg-green-500 rounded-full" title={`Task ${task.id}: Completed`} />
                    )}
                    {task.status === "assigned" && (
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" title={`Task ${task.id}: Assigned`} />
                    )}
                  </div>
                ))}

                {/* Agents */}
                {agents?.map((agent) => (
                  <div
                    key={agent.id}
                    className="absolute transition-all duration-500"
                    style={{
                      left: `${agent.positionX}%`,
                      top: `${agent.positionY}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div className="relative">
                      <div className={`text-2xl ${agent.status === "working" ? "animate-bounce" : ""}`}>
                        {agent.type === "worker" ? "🚁" : "🤖"}
                      </div>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs bg-white px-1 rounded shadow">
                        {agent.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-4 justify-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span>Pending Task</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span>Assigned Task</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span>Completed Task</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🚁</span>
                  <span>Worker Drone</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🤖</span>
                  <span>Scout Robot</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
