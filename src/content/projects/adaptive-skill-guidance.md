---
title: Multimodal FSM for Adaptive Skill Guidance
shortTitle: Adaptive Skill Guidance
tagline: Real-time hand-washing guidance fusing VLM vision and audio classification with a 12-state machine.
period: 2026 winter
role: Solo project
org: "University of Michigan · SURE Project 9: Seeing Skill with States"
built: ["VLM + audio sensing", "State machine", "Voice guidance"]
work: ["Task and state-machine design", "Multimodal sensing", "Model serving on HPC", "Real-time GUI", "Voice feedback", "Scoring design"]
skills: ["Finite-state machines", "Qwen3-VL on vLLM", "Gemini 2.5 Flash", "YAMNet audio classification", "TensorFlow Hub", "Round-robin GPU dispatch", "OpenCV", "Text-to-speech", "Python"]
courseName: "Summer Undergraduate Research in Engineering, Project 9: Seeing Skill with States"
course: "SURE #9"
tags: [HCI, VLM, multimodal, context-aware]
status: done
order: 2
themes: [context]
cover: /projects/adaptive-skill-guidance/cover.webp
links:
  - { label: Code, url: "https://github.com/Links2568/FSM_Zuchen_Li" }
hero:
  src: /projects/adaptive-skill-guidance/loop-towel-score.mp4
  poster: /projects/adaptive-skill-guidance/loop-towel-score.webp
  width: 1280
  height: 720
videos:
  - label: Full demo
    src: /projects/adaptive-skill-guidance/demo.mp4
    poster: /projects/adaptive-skill-guidance/poster-demo.webp
    duration: "5:25"
gallery:
  - { src: /projects/adaptive-skill-guidance/04_live-rinsing.webp, alt: "Live view: vision and audio cue confidences on the left, the state machine on the right.", width: 1436, height: 794 }
  - { src: /projects/adaptive-skill-guidance/02_fsm-flowchart.webp, alt: "The 12-state machine, with re-soap, skip-soap and skip-rinse paths and per-step scoring.", width: 1600, height: 900 }
  - { src: /projects/adaptive-skill-guidance/01_system-architecture.webp, alt: "Sensing, FSM and voice run on a laptop; three Qwen3-VL-8B instances run on the UMich HPC.", width: 1600, height: 900 }
  - { src: /projects/adaptive-skill-guidance/03_round-robin.webp, alt: "Round-robin across three GPUs: a 1.1 s VLM call becomes a fresh answer every 0.36 s.", width: 1600, height: 900 }
  - { src: /projects/adaptive-skill-guidance/05_live-blower-drying.webp, alt: "One of three ways to dry: the hand dryer branch.", width: 1436, height: 794 }
  - { src: /projects/adaptive-skill-guidance/06_live-score.webp, alt: "A finished session, scored out of 100 from the quality of each step.", width: 1436, height: 794 }
---

Built for the University of Michigan SURE program (Project #9, *Seeing Skill with States*): a
real-time system that watches and listens while someone washes their hands, tracks where they
are in the procedure with a 12-state finite-state machine, and talks them through it.

**Why hand washing.** The task had to break into clear steps with distinct cues between them,
run in real time, and be cheap to repeat. Hand washing fits all three. (Searing a steak was the
runner-up: great sizzle and smoke cues, but hard to repeat.)

**Cue design.** Running water and a hand dryer are easy to hear, so YAMNet audio classification
on the laptop CPU handles them cheaply. Questions that need eyes — are the hands under the
faucet, is there soap, is a towel in use — go to a small VLM as binary (0/1) prompts, and a cue
must hold for a moment before it moves the state machine, so noisy frames don't make it flicker.

**Latency.** One Qwen3-VL-8B call through an SSH tunnel to the UMich HPC took about 1.1 s end to
end. Three instances on three GPUs with round-robin dispatch give a fresh answer every ~0.36 s.
The same config switches to ensemble voting, or to Gemini 2.5 Flash with a one-line change.

**Not just a straight line.** Stand idle too long and the machine falls back to Idle; soap can be
re-applied mid-rinse; there are three ways to dry (towel, clothes, hand dryer); longer rinsing
scores higher. When a step keeps failing, adaptive level-of-detail guidance makes the voice
instructions progressively more specific. Each session ends with a score out of 100 and a log.

**What I'd change next.** The delays compound — every cue waits on a VLM query and then has to be
sustained before a transition fires — so the system feels slower than its 0.36 s refresh. And
hand washing is still fairly linear; a task with real branching and priorities, such as tidying
a room, would test the state machine much harder.
