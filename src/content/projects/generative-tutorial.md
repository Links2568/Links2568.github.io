---
title: Generative Tutorial
tagline: Live, contextualized visual instructions generated from the learner's own workspace, on a mixed-reality headset.
period: "2026"
role: Co-first author
org: Human Centered Computing Lab, University of Michigan · with Profs. Anhong Guo and Xu Wang
tags: [HCI, mixed-reality, generative-AI, VLM, context-aware]
status: active
order: 1
kind: research
themes: [context, hai]
badges: ["arXiv preprint", "CHI 2027 under review"]
bibtex: |
  @misc{wu2026generative,
    title         = {Generative Tutorial: Towards Live Contextualized Visual Instructions for Physical Tasks},
    author        = {Wu, Muzhe and Li, Zuchen and Wang, Xu and Guo, Anhong},
    year          = {2026},
    eprint        = {2609.24955},
    archivePrefix = {arXiv},
    primaryClass  = {cs.HC},
    url           = {https://arxiv.org/abs/2609.24955}
  }
fullTitle: "Generative Tutorial: Towards Live Contextualized Visual Instructions for Physical Tasks"
venue: Preprint 2026 · CHI 2027 (under review)
authors: "Muzhe Wu*, Zuchen Li*, Xu Wang, Anhong Guo"
thumb: /projects/generative-tutorial/fig.webp
abstract: "Visual instructions for physical tasks are typically authored in one context and followed in another, requiring users to translate demonstrated tools, materials, and spatial relationships into their own environment. We introduce Generative Tutorial, a conceptual framework for live visual instruction that depicts intended outcomes and actions within the user's environment and task flow. A formative evaluation of state-of-the-art image and video generation identifies failures and potential benefits across 15 physical tasks. Drawing on these findings, we build an augmented-reality prototype system that proactively generates goal images and demonstration videos using observed workspace context and predicted visual outcomes of preceding actions. A 24-participant lab study found higher task performance quality, greater perceived workspace correspondence, and shorter step-confirmation intervals with the system than with pre-authored guidance."
cover: /projects/generative-tutorial/cover.webp
links:
  - { label: arXiv, url: "https://arxiv.org/abs/2609.24955" }
  - { label: PDF, url: "https://arxiv.org/pdf/2609.24955" }
hero:
  src: /projects/generative-tutorial/loop-headset-goal-appears.mp4
  poster: /projects/generative-tutorial/loop-headset-goal-appears.webp
  width: 800
  height: 450
videos:
  - label: 30-second teaser
    src: /projects/generative-tutorial/teaser.mp4
    poster: /projects/generative-tutorial/poster-teaser.webp
    duration: "0:30"
  - label: Narrated demo
    src: /projects/generative-tutorial/demo.mp4
    poster: /projects/generative-tutorial/poster-demo.webp
    duration: "5:00"
    captions:
      - { lang: en, label: English, src: /projects/generative-tutorial/demo.en.vtt }
      - { lang: zh, label: 中文, src: /projects/generative-tutorial/demo.zh.vtt }
---

Visual tutorials show us how something should be done — but they are made somewhere else, with
someone else's tools, workspace, and point of view. Following one means first translating what we
see into the physical situation in front of us. What if the tutorial started from *your* world
instead, showing what should happen next, right where the task is unfolding?

**Generative tutorials** are live, contextualized visual instructions generated from the learner's
own environment. Generative Tutorial runs as a loop on a mixed-reality headset.

## How it works

1. **Model the environment.** From what the headset sees, it describes the objects in front of you,
   their states, and how they relate.
2. **Ground each step.** Every step of the task is tied to that model: the objects involved, and
   what must already be true before the step can begin.
3. **Generate the instruction.** A goal image of your own workspace after the step, with the changes
   highlighted, plus a short video demonstrating the motion in the same scene.

<figure>
  <video autoplay muted loop playsinline width="720" height="544" poster="/projects/generative-tutorial/loop-goal-image-from-your-counter.webp">
    <source src="/projects/generative-tutorial/loop-goal-image-from-your-counter.mp4" type="video/mp4" />
  </video>
  <figcaption>A goal image generated from your own counter.</figcaption>
</figure>

Richer media take longer to make: text and spatial cues are ready in seconds, a goal image in about
fifteen, a video in about forty-five. So guidance for upcoming steps is prepared while you work on
the current one — from captured context where the headset can see it, and from *predicted* context
where it can't: an image of how your counter will look once the current step is done.

<figure>
  <video autoplay muted loop playsinline width="800" height="450" poster="/projects/generative-tutorial/loop-generated-demo.webp">
    <source src="/projects/generative-tutorial/loop-generated-demo.mp4" type="video/mp4" />
  </video>
  <figcaption>A demonstration video generated in the same scene.</figcaption>
</figure>

The same loop builds guidance from whatever is in front of you — a bouquet, red-bean mochi, a table
set for dinner — and reaches past tasks with one right answer to open-ended ones.

<figure>
  <video autoplay muted loop playsinline width="800" height="454" poster="/projects/generative-tutorial/loop-montage-wall.webp">
    <source src="/projects/generative-tutorial/loop-montage-wall.mp4" type="video/mp4" />
  </video>
  <figcaption>Generated guidance across many everyday tasks.</figcaption>
</figure>

## User study

We compared generated and pre-authored guidance in the same interface with **24 participants** and
four everyday tasks, counterbalanced. With generated guidance, task quality was higher (**92.8 vs.
86.6**), people confirmed finished steps about a second sooner (**1.50 s vs. 2.49 s**), and they rated
the guidance as a much closer match to their workspace (**6.2 vs. 4.7** on a 7-point scale); total
time and workload were similar. Generated guidance can also be wrong — an extra bowl, five balls of
dough where the text says four — and because everything else matched their table, participants had to
decide what was an instruction and what was an artifact.

## My role

Co-first author. I co-developed the conceptual framework and AR system — grounding physical-task
goals in users' workspaces and proactively generating workspace-specific goal images and
demonstration videos by propagating observed and predicted visual states across task dependencies —
and co-led a formative evaluation of **176 generated artifacts across 15 tasks** and the
24-participant comparative study.
