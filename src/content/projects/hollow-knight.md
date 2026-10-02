---
title: Hollow Knight RL
subtitle: Learning to play, one rollout at a time.
summary: A from-scratch PPO implementation, a custom C# game mod and four game instances for GPU-accelerated training.
order: 4
category: AI/software
organisation: Personal project
role: PPO implementation, game-mod bridge & training pipeline
status: In development · ongoing training
tags: [PyTorch, PPO, C#, Python, Reinforcement learning]
illustration: hollow-knight
---
## The challenge

Build a reinforcement-learning agent for Hollow Knight and understand the full learning loop: observing the game, choosing actions, collecting experience and updating a policy.

## My part

I implemented PPO myself in Python/PyTorch and built a custom C# mod to connect the game to the training system. Four simultaneous game instances provide experience for GPU-accelerated training, with over 200 hours of actual training runtime.

## Inside the loop

1. The C# mod exposes structured game observations and receives actions.
2. A PyTorch policy selects actions through the game bridge.
3. Rollouts collect observations, actions and rewards across game instances.
4. PPO updates the policy using clipped objectives and advantage estimates.
5. Logging and checkpoints support inspection and further experiments.

The personal rebuild focuses on PPO; earlier DQN experiments are not evidence about this agent’s performance.

## Progress & evidence

The implementation includes the policy, rollout storage, training updates and game bridge. The 200+ hours describe training runtime, not a win rate or a claim that the agent has completed the game.

## What’s next

Continue training and evaluating behaviour, and add representative gameplay alongside clearly labelled training traces. The diagram on this page illustrates the data flow; it is not a recorded result or gameplay screenshot.
