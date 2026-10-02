---
title: Waddle
subtitle: Small robot. Big learning curve.
summary: Teaching a biped to move in simulation, then connecting that work to the realities of motors, mechanics and electronics.
order: 1
category: Robotics
organisation: Monash Automation
role: RL & simulation lead · shared hardware integration
status: In development · locomotion demonstrated in simulation
tags: [Isaac Sim/Lab, PPO, Python, CAD, CAN bus]
illustration: waddle
---
## The challenge

Waddle is Monash Automation’s bipedal duck robot and future team mascot. The challenge brings together physical design, actuation, control and reinforcement learning: a convincing simulated motion is only one part of building a working robot.

## My part

I own the reinforcement-learning and simulation pipeline for the 10-joint biped. Alongside that software work, I help the team with CAD, mechanical assembly and electronics integration, including CubeMars motor installation and CAN bus communication.

The physical robot is a collaborative build. My RL ownership does not mean I designed or assembled every part of the hardware.

## How it works

- A robot description brings the articulated system into Isaac Lab.
- Phase-conditioned proximal policy optimisation (PPO) learns coordinated movement across 512 parallel simulation environments.
- Standing and gait checks help distinguish policy behaviour from incorrect actuation, reference frames or configuration.
- Physical integration involves motors, communication and mechanical assembly alongside the simulation work.

## Progress & evidence

The policy has produced alternating forward steps in simulation. I have also diagnosed actuation and frame faults and documented standing and gait checks. These are simulation results, not a claim that the learned policy is walking on the physical robot.

## What’s next

Continue validating stability and actuator behaviour, and bring simulation and hardware work together through staged, carefully checked experiments. Project footage will be added after review; the portfolio illustrations are not engineering evidence.
