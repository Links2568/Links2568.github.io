---
title: Multimodal FSM for Adaptive Skill Guidance
tagline: Real-time hand-washing guidance fusing VLM vision and audio classification with a 12-state machine.
period: 2026 winter
role: Builder
org: University of Michigan
tags: [HCI, VLM, multimodal, context-aware]
status: done
order: 2
links: []
---

A real-time skill-guidance system that watches and listens: VLM-based visual cues and
YAMNet audio classification feed a 12-state finite-state machine that tracks where the
user is in a hand-washing procedure — and adapts the level of voice-instruction detail
when they stall or deviate.

Engineering highlights: switchable local Qwen3-VL and cloud Gemini backends,
sustained-condition state transitions (no flicker on noisy frames), non-blocking TTS,
a split-screen live state visualization, and post-session scoring and logging.
