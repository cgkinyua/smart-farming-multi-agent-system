# Independent Research Project Proposal

**Project Title:** A Decentralized and Adaptive Multi-Agent System for Heterogeneous Fleet Management in Smart Farming

## 1. Research Problem and Motivation

The literature on Multi-Agent Systems (MAS) in Smart Farming reveals a significant focus on coordinating homogeneous fleets of robots, often relying on centralized control architectures and simulation-based evaluations [2, 6]. While these studies have demonstrated the potential of MAS, they often overlook the practical challenges of real-world agricultural environments. Key research gaps identified include:

- **Scalability and Robustness:** Centralized systems present a single point of failure and may not scale effectively to large farms with many agents.
- **Heterogeneity:** Real-world farms will likely employ a diverse fleet of robots with different capabilities (e.g., ground-based sensors, aerial sprayers), a scenario that is not well-addressed in current research.
- **Adaptability:** Agricultural environments are highly dynamic. Systems must be able to adapt in real-time to changing conditions, such as new pest infestations or changing weather.

This research project aims to address these gaps by designing, implementing, and evaluating a **decentralized and adaptive multi-agent system** for coordinating a **heterogeneous fleet** of agricultural robots.

## 2. Research Question

How can a decentralized multi-agent system effectively coordinate a heterogeneous fleet of agricultural robots (e.g., ground rovers and aerial drones) for a dynamic and complex task like integrated pest management, while remaining scalable and robust to individual agent failures?

## 3. Proposed Methodology

To answer this research question, the following methodology will be employed:

### 3.1. System Design

1.  **Define a Heterogeneous Fleet:** The system will consist of two types of agents:
    *   **Scout Agents (Ground Robots):** Equipped with high-resolution cameras and sensors for detailed crop inspection and pest detection.
    *   **Worker Agents (Aerial Drones):** Equipped with sprayers for targeted pesticide application.

2.  **Design a Decentralized Coordination Mechanism:** A market-based approach, specifically a **contract net protocol**, will be used for task allocation. This decentralized mechanism will allow for robust and scalable coordination without a central controller.
    *   **Task Announcement:** When a Scout Agent detects a pest infestation, it will act as a "manager" and announce a task (e.g., "spray area X with Y pesticide").
    *   **Bidding:** Worker Agents will bid on the task based on their capabilities, current location, energy level, and available pesticide.
    *   **Task Awarding:** The Scout Agent will award the task to the most suitable Worker Agent based on the bids.

3.  **Develop an Adaptive Task Allocation Strategy:** The system will be designed to be adaptive. The priority and parameters of tasks can be dynamically updated based on real-time data. For example, if a Scout Agent detects that an infestation is spreading rapidly, it can increase the priority of the corresponding spraying task.

### 3.2. Implementation

A prototype of the proposed system will be implemented in a simulation environment. The **ABS-SmartComAgri** simulator [3], due to its open-source nature and focus on agricultural scenarios, will be extended to support heterogeneous agents and the contract net protocol. The extended simulator will model the dynamics of both ground robots and aerial drones, as well as the process of pest detection and spraying.

### 3.3. Evaluation

The performance of the proposed system will be evaluated based on the following metrics:

*   **Task Completion Time:** The time taken to successfully manage a set of simulated pest infestations.
*   **Resource Efficiency:** The amount of pesticide used and the total energy consumed by the robot fleet.
*   **Scalability:** The performance of the system will be tested with an increasing number of agents and tasks to evaluate its scalability.
*   **Robustness:** The system's ability to handle agent failures will be tested by simulating the breakdown of individual robots and measuring the impact on overall performance.

The performance of the decentralized, market-based approach will be compared against a centralized, baseline approach to quantify the benefits of the proposed system.

## 4. Expected Contributions

This research is expected to make the following contributions:

- A novel, decentralized coordination mechanism for heterogeneous robot fleets in Smart Farming.
- An adaptive task allocation strategy that can respond to dynamic changes in the agricultural environment.
- A quantitative evaluation of the scalability and robustness of the proposed system.
- An extension to an existing open-source simulator that can be used by other researchers in the field.

By addressing the key challenges of scalability, heterogeneity, and adaptability, this research will contribute to the development of more practical and effective Multi-Agent Systems for real-world agricultural applications.

---

## References

[2] Din, A., Ismail, M. Y., Shah, B., Babar, M., Ali, F., & Baig, S. U. (2022). A deep reinforcement learning-based multi-agent area coverage control for smart agriculture. *Computers and Electrical Engineering*, 101, 108089. https://doi.org/10.1016/j.compeleceng.2022.108089

[3] García-Magariño, I., Lacuesta, R., & Lloret, J. (2018). ABS-SmartComAgri: An Agent-Based Simulator of Smart Communication Protocols in Wireless Sensor Networks for Debugging in Precision Agriculture. *Sensors*, 18(4), 998. https://doi.org/10.3390/s18040998

[6] Lujak, M., Sklar, E., & Semet, F. On Multi-Agent Coordination of Agri-Robot Fleets. *CEUR Workshop Proceedings*, 2701, paper_12.
