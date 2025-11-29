# A Review of Multi-Agent Systems in Smart Farming

**Author:** Charles Kinyua Gitonga  
**Student ID:** SD23/77993/25  
**Department:** Computer Science  
**Institution:** Chuka University  
**Email:** cgkinyua@chuka.ac.ke  
**Course:** COSC 944 - Multi-Agent Systems  
**Instructor:** Prof. Marcel Odhiambo Ohanga  
**Date:** November 29, 2025

## Introduction

The agricultural sector is undergoing a significant transformation, driven by the need to meet the growing global demand for food while addressing challenges such as climate change, resource scarcity, and an aging workforce. In this context, **Smart Farming** has emerged as a new paradigm that leverages advanced technologies to enhance agricultural productivity, sustainability, and efficiency. Among the most promising of these technologies are **Multi-Agent Systems (MAS)**, which offer a powerful framework for developing intelligent, decentralized, and collaborative solutions to complex agricultural problems.

This review provides a comprehensive overview of the application of Multi-Agent Systems in Smart Farming. It begins by defining the fundamental concepts of intelligent agents and MAS, and then explores the key principles that underpin their operation, including decision-making architectures, communication, and learning. The review then examines the practical applications of MAS in various agricultural domains, with a particular focus on **Smart Farming**. Finally, it discusses the key challenges and considerations that must be addressed to realize the full potential of this technology. This review is based on a selection of recent, peer-reviewed articles that highlight the emerging trends and innovations in the field.

## 1. Intelligent Agents, Autonomous Agents, and Multi-Agent Systems (MAS)

A Multi-Agent System is a computerized system composed of multiple interacting intelligent agents. An **intelligent agent** is an autonomous entity which observes through sensors and acts upon an environment using actuators and directs its activity towards achieving goals [1].

### 1.1 Agents Definition and Classification

Agents can be classified based on their characteristics and capabilities. A simple classification distinguishes between **reactive agents**, which act based on the current state of the environment, and **proactive agents**, which are goal-oriented and can take the initiative. More advanced agents, known as **deliberative agents**, can reason about their actions and make plans to achieve their goals. In the context of Smart Farming, we often encounter **hybrid agents** that combine both reactive and deliberative capabilities to respond to dynamic and uncertain environments [2].

### 1.2 Agents Characteristics

Intelligent agents exhibit several key characteristics that make them well-suited for complex applications like Smart Farming:

*   **Autonomy:** Agents can operate without direct human intervention and have control over their own actions and internal state.
*   **Social Ability:** Agents can interact with other agents (and possibly humans) via some kind of agent-communication language [3].
*   **Reactivity:** Agents perceive their environment and respond in a timely fashion to changes that occur in it.
*   **Pro-activeness:** Agents do not simply act in response to their environment; they are able to exhibit goal-directed behavior by taking the initiative.

These characteristics enable agents to work together in a MAS to solve problems that would be difficult or impossible for a single agent or a monolithic system to solve. The following sections will delve deeper into the principles that govern the behavior of these agents and their applications in Smart Farming.

---


## References

[1] Pérez-Pons, M. E., Alonso, R. S., García, O., Marreiros, G., & Corchado, J. M. (2021). Deep Q-Learning and Preference Based Multi-Agent System for Sustainable Agricultural Market. *Sensors (Basel)*, 21(16), 5276. https://doi.org/10.3390/s21165276

[2] Din, A., Ismail, M. Y., Shah, B., Babar, M., Ali, F., & Baig, S. U. (2022). A deep reinforcement learning-based multi-agent area coverage control for smart agriculture. *Computers and Electrical Engineering*, 101, 108089. https://doi.org/10.1016/j.compeleceng.2022.108089

[3] García-Magariño, I., Lacuesta, R., & Lloret, J. (2018). ABS-SmartComAgri: An Agent-Based Simulator of Smart Communication Protocols in Wireless Sensor Networks for Debugging in Precision Agriculture. *Sensors*, 18(4), 998. https://doi.org/10.3390/s18040998

## 2. Key Intelligent Agent Principles

The effectiveness of a Multi-Agent System is largely determined by the underlying principles that govern the behavior of its individual agents and their interactions. This section explores some of the key principles of intelligent agents, including their decision-making architectures, communication and cooperation mechanisms, and learning capabilities.

### 2.1 Agent Decision-Making Architectures

The decision-making architecture of an agent determines how it processes information and chooses its actions. There are several common architectures, each with its own strengths and weaknesses:

*   **Symbolic Architectures:** These architectures, such as the Belief-Desire-Intention (BDI) model, use symbolic representations of the world and explicit reasoning to make decisions. They are well-suited for tasks that require complex planning and reasoning.
*   **Reactive Architectures:** These architectures, such as the subsumption architecture, are based on a set of simple rules that map sensory inputs directly to actions. They are highly responsive and robust but may lack the ability to perform long-term planning.
*   **Hybrid Architectures:** These architectures combine elements of both symbolic and reactive architectures to achieve a balance between responsiveness and goal-directedness. For example, a hybrid agent might use a reactive layer for immediate responses and a deliberative layer for long-term planning.

The choice of architecture depends on the specific requirements of the application. In Smart Farming, where agents must respond to both immediate environmental changes and long-term goals, hybrid architectures are often the most appropriate choice [4].

### 2.2 Cooperation, Communication, and Teamwork

In a MAS, agents must be able to cooperate and work together as a team to achieve their common goals. This requires effective communication and coordination mechanisms.

*   **Communication:** Agents communicate using an **Agent Communication Language (ACL)**, such as FIPA-ACL or KQML. These languages provide a standardized syntax and semantics for exchanging messages, allowing agents to share information, make requests, and negotiate agreements [3].
*   **Coordination:** Coordination mechanisms are used to ensure that the actions of individual agents are coherent and directed towards the overall goal of the system. Common coordination mechanisms include planning, scheduling, and negotiation. For example, in a fleet of agricultural robots, a coordination mechanism would be used to assign tasks to robots and deconflict their paths [6].
*   **Teamwork:** Teamwork involves a deeper level of collaboration, where agents share a common goal and are mutually aware of each other's roles and responsibilities. This requires more sophisticated communication and coordination protocols, as well as a shared understanding of the team's plan.

### 2.3 Multi-Agent Planning

Multi-agent planning is the process of generating a sequence of actions for a team of agents to achieve a common goal. This is a challenging problem, as the actions of one agent can affect the outcomes for other agents. There are two main approaches to multi-agent planning:

*   **Centralized Planning:** In this approach, a single central planner generates a plan for the entire team of agents. This approach can produce globally optimal plans but can be computationally expensive and is not robust to failures of the central planner.
*   **Decentralized Planning:** In this approach, each agent generates its own plan, and the agents coordinate their plans through communication and negotiation. This approach is more scalable and robust but may not produce globally optimal plans.

The choice between centralized and decentralized planning depends on the specific characteristics of the application. For example, in a small, tightly-coupled team of robots, centralized planning may be appropriate. In a large, distributed system of sensors, decentralized planning is likely to be more effective [2].

### 2.4 Learning Agents

Learning is a crucial capability for intelligent agents, as it allows them to adapt to new situations and improve their performance over time. There are several types of learning that are relevant for MAS:

*   **Reinforcement Learning (RL):** RL is a type of learning where agents learn to make decisions by receiving rewards or punishments for their actions. This is a powerful technique for learning in dynamic and uncertain environments, and it has been successfully applied to a wide range of problems in Smart Farming, such as crop monitoring and resource management [2].
*   **Supervised Learning:** Supervised learning is a type of learning where agents learn from a set of labeled examples. This can be used to learn models of the environment or to learn how to perform specific tasks, such as classifying crops or detecting diseases.
*   **Unsupervised Learning:** Unsupervised learning is a type of learning where agents learn from a set of unlabeled examples. This can be used to discover patterns and relationships in data, such as identifying different soil types or customer segments.

By incorporating learning capabilities, MAS can become more intelligent, adaptive, and effective in solving complex agricultural problems.

---

## References

[4] Skobelev, P., Larukchin, V., Mayorov, I., Simonova, E., & Yalovenko, O. (2019). Smart Farming – Open Multi-agent Platform and Eco-System of Smart Services for Precision Farming. In *Advances in Practical Applications of Survivable Agents and Multi-Agent Systems: The PAAMS Collection* (pp. 212–224). Springer.

[6] Lujak, M., Sklar, E., & Semet, F. On Multi-Agent Coordination of Agri-Robot Fleets. *CEUR Workshop Proceedings*, 2701, paper_12.
## 3. Practical Applications

The principles of MAS are being applied to a wide range of practical problems in Smart Farming. This section reviews some of the key application areas, including robotic agents, computational market systems, and human-agent interaction.

### 3.1 Robotic Agents

One of the most promising applications of MAS in Smart Farming is in the coordination of **robotic agents**, such as drones and ground robots, for tasks like crop monitoring, precision spraying, and harvesting. A multi-agent approach is essential for these tasks, as it allows a fleet of robots to work together to cover large areas and perform complex operations that would be impossible for a single robot.

For example, Din et al. (2022) propose a multi-robotic system for crop monitoring that uses a deep reinforcement learning algorithm to learn a coordinated patrolling strategy [2]. This allows the robots to efficiently cover the entire field and identify areas that require attention. Similarly, Seo and Lee (2025) have developed a density-driven optimal control framework for coordinating a fleet of UAVs for precision pesticide spraying, which adapts the spraying based on the density of weed infestations [5]. Lujak et al. also address the coordination of agri-robot fleets, focusing on the challenges of dynamic task assignment and real-time coordination in large-scale agricultural settings [6].

### 3.2 Computational Market Systems

MAS are also being used to develop **computational market systems** that can help farmers make better decisions in the agricultural marketplace. These systems can provide farmers with real-time information on prices, demand, and supply, and can even automate the process of buying and selling agricultural products.

Pérez-Pons et al. (2021) present a MAS for the agricultural market that includes a deep Q-learning agent for forecasting futures market prices [1]. This allows farmers to make more informed decisions about when to sell their products. The system also includes a preference-based multi-objective optimization component that helps farmers select suppliers based on sustainability criteria, such as water consumption and greenhouse gas emissions.

### 3.3 Human-Agent Interaction

Effective **human-agent interaction** is crucial for the successful adoption of MAS in Smart Farming. Farmers and other stakeholders must be able to understand and trust the recommendations of the system, and they must be able to interact with it in a natural and intuitive way.

Skobelev et al. (2019) propose a "virtual round table" framework that facilitates human-agent interaction by simulating a discussion among various expert agents [4]. This allows the farmer to see the different perspectives on a particular decision and to understand the trade-offs involved. Similarly, the agent-based simulator developed by García-Magariño et al. (2018) provides a user interface that allows farmers to visualize the state of their fields and to understand the behavior of the pest management system [3].

---

## References

[5] Seo, S., & Lee, K. (2025). Density-Driven Multi-Agent Coordination for Efficient Farm Coverage and Management in Smart Agriculture. *arXiv preprint arXiv:2511.12492*.
## 4. Challenges and Considerations

Despite the significant potential of MAS in Smart Farming, there are several challenges and considerations that must be addressed to ensure their successful implementation and adoption. This section discusses some of the key challenges, including coordination and communication, conflict resolution, scalability, and security and trust.

### 4.1 Coordination and Communication

Effective coordination and communication are essential for the successful operation of a MAS. In a Smart Farming context, this is particularly challenging due to the dynamic and often unstructured nature of the agricultural environment. For example, a fleet of autonomous robots must be able to coordinate their actions to avoid collisions, ensure complete coverage of the field, and adapt to unexpected events, such as equipment failures or changes in weather conditions.

Several of the reviewed papers address this challenge. For instance, Lujak et al. focus on the problem of dynamic task assignment for agri-robot fleets, which is a key aspect of coordination [6]. García-Magariño et al. (2018) developed a simulator to test different communication protocols for wireless sensor networks in agriculture, highlighting the importance of energy-efficient communication [3].

### 4.2 Conflict Resolution

In any MAS, there is the potential for conflict to arise between agents. For example, two robots may want to access the same resource at the same time, or two agents may have conflicting goals. Effective conflict resolution mechanisms are needed to ensure that these conflicts are resolved in a way that is fair and efficient.

While none of the reviewed papers focus exclusively on conflict resolution, it is an implicit challenge in many of the discussed applications. For example, in the computational market system proposed by Pérez-Pons et al. (2021), there is the potential for conflict between buyers and sellers [1]. The "virtual round table" framework proposed by Skobelev et al. (2019) can be seen as a mechanism for resolving conflicts between different expert agents by finding a consensus or a trade-off among their different perspectives [4].

### 4.3 Scalability

Scalability is a major challenge for MAS in Smart Farming. As the number of agents in the system increases, the complexity of managing their interactions and ensuring efficient operation grows. This is particularly relevant for applications that involve large fleets of robots or extensive sensor networks.

Several of the reviewed papers address the issue of scalability. For example, Seo and Lee (2025) propose a density-driven optimal control framework that is designed to be scalable for large fleets of UAVs [5]. The open multi-agent platform proposed by Skobelev et al. (2019) is also designed to be scalable, allowing for the integration of a large number of smart services [4].

### 4.4 Security and Trust

Security and trust are critical considerations for any MAS, especially in applications that involve sensitive data or critical infrastructure. In a Smart Farming context, it is essential to ensure that the system is secure from cyberattacks and that the data it collects is accurate and reliable. Farmers must also be able to trust the recommendations of the system and be confident that it will operate safely and effectively.

The issue of security and trust is not extensively addressed in the reviewed papers, which represents a significant research gap. Future research should focus on developing robust security protocols for MAS in agriculture, as well as mechanisms for building trust between humans and autonomous agents.

## Conclusion

Multi-Agent Systems represent a powerful and versatile technology with the potential to revolutionize the agricultural sector. From coordinating fleets of autonomous robots to providing intelligent decision support for farmers, MAS offer a wide range of solutions to the challenges facing modern agriculture. This review has provided a comprehensive overview of the state of the art in this exciting field, covering the fundamental principles of MAS, their practical applications in Smart Farming, and the key challenges that must be addressed to realize their full potential.

As the field continues to evolve, we can expect to see even more innovative applications of MAS in agriculture. Future research should focus on addressing the challenges of scalability, security, and human-agent interaction, as well as exploring the use of more advanced AI and machine learning techniques to create even more intelligent and adaptive systems. By continuing to push the boundaries of what is possible with MAS, we can help to create a more sustainable, efficient, and productive future for agriculture.

---
