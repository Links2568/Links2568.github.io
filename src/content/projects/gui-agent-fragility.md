---
title: How Fragile Are GUI Agents?
tagline: A controlled perturbation benchmark for interface evolution, built on the VisualWebArena harness.
period: 2026 winter
role: Project lead
org: "University of Michigan · EECS 545: Machine Learning"
teamNote: "Equal contribution; all five shared the ideation, the presentation and the writing."
team: 
  - { name: Zuchen Li, did: "Organized and led the project; ran the experiments; liaison with GSIs and faculty" }
  - { name: Opeyemi Akinniyi, did: "Ran the experiments; co-organized the second half; data synthesis" }
  - { name: Carol Kang, did: "Led data collection and website synthesis" }
  - { name: Xiangnong Wu, did: "Led data collection and website synthesis" }
  - { name: Hao Yin, did: "Led data collection and website synthesis" }
built: ["Benchmark", "Web synthesis", "Agent evaluation"]
courseName: Machine Learning
course: EECS 545
tags: [GUI-agents, benchmark, LLM, evaluation]
status: done
order: 3
themes: [hai]
cover: /projects/gui-agent-fragility/cover.webp
links:
  - { label: Poster, url: /projects/gui-agent-fragility/poster.pdf }
  - { label: Report, url: /projects/gui-agent-fragility/report.pdf }
gallery:
  - { src: /projects/gui-agent-fragility/01_three-eras.webp, alt: "One listing in three interface eras; vision-only success falls from 57.9% to 16.5%.", width: 1600, height: 641 }
  - { src: /projects/gui-agent-fragility/02_hidden-content.webp, alt: "Vision-only success drops to about 0% when the answer sits behind a tab or a click.", width: 1600, height: 713 }
  - { src: /projects/gui-agent-fragility/03_trs.webp, alt: "Robustness per agent: a 7B GUI specialist beats a 30B generalist on house renting.", width: 1600, height: 453 }
  - { src: /projects/gui-agent-fragility/04_recovery.webp, alt: "Memory recovers up to 52% of failures on one site and almost none on another.", width: 1600, height: 460 }
  - { src: /projects/gui-agent-fragility/05_three-styles.webp, alt: "One job-application site, generated in three visual styles.", width: 1600, height: 429 }
  - { src: /projects/gui-agent-fragility/06_taxonomy.webp, alt: "Five typed perturbations, each at three intensity levels.", width: 1524, height: 380 }
  - { src: /projects/gui-agent-fragility/07_wayback.webp, alt: "Preliminary study: Reddit snapshots from 2014 to 2023.", width: 1474, height: 900 }
  - { src: /projects/gui-agent-fragility/08_poster.webp, alt: "The EECS 545 poster.", width: 2400, height: 1698 }
---

GUI agents are usually tested on frozen copies of websites, but real interfaces keep changing:
buttons get renamed, layouts reflow, forms turn into wizards. An agent that works today can
quietly fail after the next redesign. With Opeyemi Akinniyi, Carol Kang, Xiangnong Wu and Hao Yin
(equal contribution), I led this EECS 545 project and ran the agent experiments.

**From archives to a controlled benchmark.** We started with Wayback Machine snapshots of Reddit,
IMDb and Craigslist from 2014 to 2023. They revealed five recurring kinds of change — layout,
semantic, visual, structural and workflow — but archived pages also change their content and lose
assets, so a failure can't be pinned on the interface alone. We therefore generated our own
websites (house renting, course registration, personal pages and a job-application site) in
several styles and eras, each variant differing from its base by one typed, labelled change at
one of three intensities.

**What we found.** We evaluated four VLM agents (Qwen3-VL-30B, UI-TARS-7B, Qwen2.5-VL-7B,
InternVL2-8B) and a text-only baseline (GPT-oss-120B) in the VisualWebArena harness.

- **Screenshots are the weak link.** Text-only input averaged 92.4%; vision-only agents about 40%.
  On house renting, vision-only success fell from 57.9% on the classic layout to 16.5% once details
  moved behind tabs and toggles — content a static screenshot cannot see.
- **Specialisation beats size, sometimes.** UI-TARS-7B was more robust than the four-times-larger
  Qwen3-VL-30B on interaction-heavy pages, but every vision agent converged on the personal-website
  task, where cross-page navigation rather than perception is the bottleneck.
- **Test-time fixes depend on the task.** Experience memory recovered up to 52% of failures on one
  site and almost none on another, where it made up answers up to 94% of the time; chain-of-thought
  helped most when the agent had to reason about interactive state.
- **Newer isn't always harder.** 2000s table-based HTML tripped agents more than modern semantic
  markup.
