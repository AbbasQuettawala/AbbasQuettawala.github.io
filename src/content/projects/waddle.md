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
cover:
  src: /media/waddle/showcase.webp
  thumbnail: /media/waddle/showcase-card.webp
  alt: Abbas discussing Waddle beside its CAD model, simulation display and physical leg assembly
  caption: Sharing Waddle with visitors, with CAD, simulation and physical hardware side by side.
  width: 1600
  height: 1063
mediaIntroduction: Start with the full Sharon AI project breakdown (5 min 45 sec, with audio). Below it are the first minute of the SolidWorks tour, silent model and simulation recordings, and a team photograph. Press play to watch; videos do not autoplay. Optional English captions on the interview are automatically generated and may contain errors.
media:
  - type: video
    src: /media/waddle/sharon-ai-full.mp4
    poster: /media/waddle/sharon-ai-full-poster.webp
    captions: /media/waddle/sharon-ai-full.en.vtt
    captionLabel: English (auto-generated)
    featured: true
    alt: Full Sharon AI Waddle project breakdown featuring the Monash Automation team
    caption: The complete Sharon AI film (5 min 45 sec), with the original audio and full project discussion retained.
  - type: video
    src: /media/waddle/solidworks-tour.mp4
    poster: /media/waddle/solidworks-tour-poster.webp
    alt: SolidWorks rotation of Waddle's outer shell and internal mechanical design
    caption: SolidWorks design tour (first 60 seconds only). CAD visualisation, not physical robot footage. Silent web copy.
    silent: true
  - type: video
    src: /media/waddle/urdf-preview.mp4
    poster: /media/waddle/urdf-preview-poster.webp
    alt: Waddle URDF model with individual joints highlighted during a kinematic preview
    caption: URDF and joint-motion preview. This illustrates model geometry and articulation, not learned walking or a balance test. Silent.
    silent: true
  - type: video
    src: /media/waddle/simulation-development.mp4
    poster: /media/waddle/simulation-development-poster.webp
    alt: Waddle simulation development recording with the robot and diagnostic markers in the editor
    caption: Development recording in simulation, with diagnostic markers visible. Simulation-only evidence, not hardware validation. Silent web copy.
    silent: true
  - type: video
    src: /media/waddle/simulation-playback.mp4
    poster: /media/waddle/simulation-playback-poster.webp
    alt: Playback of the Waddle robot model in a simulated environment
    caption: Robot playback in the simulation environment. This does not demonstrate learned locomotion on the physical robot. Silent web copy.
    silent: true
  - type: video
    src: /media/waddle/parallel-simulation.mp4
    poster: /media/waddle/parallel-simulation-poster.webp
    alt: View pulling back across many Waddle robot instances in parallel simulation environments
    caption: A view across parallel simulation environments. The recording shows the simulation setup, not a measured training-throughput result. Silent web copy.
    silent: true
  - type: image
    src: /media/waddle/team.webp
    alt: Monash Automation team members together in the robotics lab
    caption: The people behind the collaborative robotics work at Monash Automation.
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

Continue validating stability and actuator behaviour, and bring simulation and hardware work together through staged, carefully checked experiments. The media below separates CAD and kinematic previews, simulation recordings and physical project photographs; none is presented as proof of learned walking on hardware.
