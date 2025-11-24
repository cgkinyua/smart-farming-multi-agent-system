CREATE TABLE `agents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('scout','worker') NOT NULL,
	`name` varchar(100) NOT NULL,
	`status` enum('idle','moving','working','charging') NOT NULL DEFAULT 'idle',
	`positionX` int NOT NULL DEFAULT 0,
	`positionY` int NOT NULL DEFAULT 0,
	`energyLevel` int NOT NULL DEFAULT 100,
	`payloadCapacity` int NOT NULL DEFAULT 0,
	`currentPayload` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `agents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `simulationRuns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`status` enum('running','paused','completed') NOT NULL DEFAULT 'running',
	`totalTasks` int NOT NULL DEFAULT 0,
	`completedTasks` int NOT NULL DEFAULT 0,
	`totalEnergyUsed` int NOT NULL DEFAULT 0,
	`totalPesticideUsed` int NOT NULL DEFAULT 0,
	`startTime` timestamp NOT NULL DEFAULT (now()),
	`endTime` timestamp,
	CONSTRAINT `simulationRuns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `taskBids` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taskId` int NOT NULL,
	`agentId` int NOT NULL,
	`bidValue` int NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `taskBids_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`simulationId` int NOT NULL,
	`type` enum('spray','inspect') NOT NULL,
	`priority` int NOT NULL DEFAULT 1,
	`status` enum('pending','bidding','assigned','in_progress','completed') NOT NULL DEFAULT 'pending',
	`areaX` int NOT NULL,
	`areaY` int NOT NULL,
	`infestationDensity` int NOT NULL DEFAULT 0,
	`assignedAgentId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
