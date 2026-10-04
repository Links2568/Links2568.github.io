---
title: MoiréDeform
tagline: Turns the mesh of an ordinary office chair into a sensor — a camera behind the backrest reads breathing and posture from moiré patterns.
period: "2026"
role: Co-first author
org: Human Centered Computing Lab, University of Michigan · with Profs. Alanson Sample and Ke Sun
tags: [ubiquitous-sensing, computer-vision, moiré, respiration, HCI]
status: done
order: 2
kind: research
fullTitle: "MoiréDeform: Towards Fine-Grained Deformation Sensing through Everyday Moiré"
venue: ACM MobiCom 2026 · Demo · Austin, TX
authors: "Linzhen Zhu*, Zuchen Li*, Weihao Jin, Hyunmin Park, Alanson Sample, Ke Sun"
cover: /projects/moiredeform/cover.webp
thumb: /projects/moiredeform/thumb.webp
abstract: "Every time we sit, lean, or breathe, we gently deform the surfaces that hold us. MoiréDeform turns the mesh of an unmodified office chair into a sensor: a low-cost camera behind the backrest compares each frame with a reference of the empty chair, so the weave acts as virtual moiré layers that amplify subtle deformation into large, visible fringes. From them, a lightweight network reconstructs the breathing waveform live, and the moiré envelope's centroid becomes a continuous lean-to-steer joystick — no markers, no wearables, and the person is never in frame. In a preliminary study (5 users, 100 minutes), respiratory-rate error fell from 2.07 to 0.71 breaths/min relative to physical-marker tracking."
links:
  - { label: interactive talk, url: /projects/moiredeform/talk/index.html }
hero:
  src: /projects/moiredeform/loop.mp4
  poster: /projects/moiredeform/loop.webp
  width: 1280
  height: 720
videos:
  - label: 30-second teaser
    src: /projects/moiredeform/teaser.mp4
    poster: /projects/moiredeform/poster-teaser.webp
    duration: "0:30"
  - label: Narrated demo
    src: /projects/moiredeform/demo.mp4
    poster: /projects/moiredeform/poster-demo.webp
    duration: "2:45"
    captions:
      - { lang: en, label: English, src: /projects/moiredeform/demo.en.vtt }
      - { lang: zh, label: 中文, src: /projects/moiredeform/demo.zh.vtt }
gallery:
  - { src: /projects/moiredeform/01_moire-halo.webp, alt: "A tiny shift between two fine patterns becomes a large, sweeping moiré fringe.", width: 1600, height: 900 }
  - { src: /projects/moiredeform/02_moire-fringes.webp, alt: "The chair's own weave provides the repeating pattern — no markers or gratings added.", width: 1600, height: 900 }
  - { src: /projects/moiredeform/03_in-use_camera-sees-fabric.webp, alt: "In use: the camera sees only the back of the chair, never the person.", width: 1600, height: 900 }
  - { src: /projects/moiredeform/04_live-breathing.webp, alt: "Demo 1: the breathing waveform reconstructed live by a lightweight CNN.", width: 1600, height: 900 }
  - { src: /projects/moiredeform/05_breath-hold.webp, alt: "A breath hold is flagged within about 1.5 seconds.", width: 1600, height: 900 }
  - { src: /projects/moiredeform/06_posture-joystick.webp, alt: "Demo 2: the weighted centroid of the moiré envelope becomes a 2D joystick.", width: 1600, height: 900 }
  - { src: /projects/moiredeform/07_lean-to-steer.webp, alt: "A seated back-mobility exercise, steered by posture alone.", width: 1600, height: 900 }
  - { src: /projects/moiredeform/08_results.webp, alt: "Preliminary evaluation: 5 users, 10 sessions, 100 minutes.", width: 1600, height: 900 }
---

Every time we sit, lean, or breathe, we gently deform the surfaces that hold us. Those tiny
deformations carry signals about posture and even breathing — but they are hard to see without
instrumenting the surface or the person.

Moiré patterns make them visible. When two fine, repeating patterns overlap, a tiny shift between
them turns into a large, sweeping fringe. Woven surfaces like the mesh of an office chair already
carry that repeating pattern. **MoiréDeform** turns the mesh into a sensor: a low-cost camera behind
the chair records one reference frame of the empty backrest, and each live frame is compared against
it, so the two act as virtual layers and deformation appears as a moiré pattern. No markers, no added
gratings, no changes to the chair — and the person sitting in it is never in frame.

## what it does

- **Breathing.** Each breath presses gently into the mesh. A lightweight neural network reconstructs
  the breathing waveform live from the moiré signal, and flags a breath hold within about 1.5 s.
- **Posture as input.** Shifting your weight across the backrest moves the load on the mesh; the
  weighted centroid of the moiré envelope becomes a continuous two-dimensional joystick — here
  steering a seated back-mobility exercise.

## results

In a preliminary study with 5 users and 100 minutes of recordings, MoiréDeform tracked breathing rate
within **0.72 ± 0.45 breaths/min** of a chest belt. With the same camera, the moiré signal was about
**3× more accurate** than tracking a physical marker (0.71 vs. 2.07 breaths/min error). The same
channel could support stretch-break coaching, posture awareness, hands-free input, or games you play
by leaning — all by watching fabric, not faces.

## my role

Co-first author. I developed the low-cost camera-based sensing approach that exploits naturally
occurring woven textures as virtual moiré layers to amplify subtle surface deformation, enabling
continuous body-lean interaction and respiratory waveform/rate sensing on an unmodified mesh chair —
reducing respiratory-rate MAE from 2.07 to 0.71 breaths/min relative to physical-marker tracking.
