---
title: RespiraFrame
tagline: An eyeglass frame that monitors respiration through bone-conduction acoustics and electrical impedance tomography.
period: "2026"
role: Experimental design & evaluation
org: Human Centered Computing Lab, University of Michigan · with Prof. Junyi Zhu
tags: [ubiquitous-sensing, wearables, health, multimodal, HCI]
status: active
order: 4
kind: research
fullTitle: "RespiraFrame: On-Frame Respiratory Monitoring via Electrical Impedance Tomography and Bone-Conduction Acoustics"
venue: CHI 2027 · under review
cover: /projects/respiraframe/cover.webp
thumb: /projects/respiraframe/thumb.webp
abstract: "RespiraFrame is an eyeglass frame that monitors respiration through two complementary channels: a bone-conduction microphone beside the nose that hears breathing through the face rather than the air, and electrical impedance tomography from eight soft dry electrodes on the nose pads and temples. A two-branch network fused with attention recognizes five abnormal respiratory events and distinguishes nasal vs. oral, deep vs. shallow breathing, and breath holding — 92.5% for abnormal events in a 19-participant lab study, under 3 points of change at 80 dB of noise, and 87.6% over 30 hours of in-the-wild wear."
links:
  - { label: interactive talk, url: /projects/respiraframe/talk/index.html }
hero:
  src: /projects/respiraframe/loop.mp4
  poster: /projects/respiraframe/loop.webp
  width: 1280
  height: 1192
videos:
  - label: 30-second teaser
    src: /projects/respiraframe/teaser.mp4
    poster: /projects/respiraframe/poster-teaser.webp
    duration: "0:30"
  - label: Narrated demo
    src: /projects/respiraframe/demo.mp4
    poster: /projects/respiraframe/poster-demo.webp
    duration: "4:50"
    captions:
      - { lang: en, label: English, src: /projects/respiraframe/demo.en.vtt }
      - { lang: zh, label: 中文, src: /projects/respiraframe/demo.zh.vtt }
gallery:
  - { src: /projects/respiraframe/product-hero.webp, alt: "The RespiraFrame eyeglass frame.", width: 1600, height: 900 }
  - { src: /projects/respiraframe/xray-bone-conduction.webp, alt: "Channel 1: a bone-conduction microphone beside the nose captures breathing vibrations through the face.", width: 1600, height: 900 }
  - { src: /projects/respiraframe/xray-eit.webp, alt: "Channel 2: eight soft dry electrodes on the nose pads and temples perform electrical impedance tomography.", width: 1600, height: 900 }
  - { src: /projects/respiraframe/montage-nasal-oral.webp, alt: "Distinguishing nasal from oral breathing.", width: 1600, height: 900 }
  - { src: /projects/respiraframe/film-network.webp, alt: "A two-branch network fused with multi-head attention.", width: 1600, height: 900 }
  - { src: /projects/respiraframe/film-19-participants.webp, alt: "Lab study with 19 participants.", width: 1600, height: 900 }
---

Our breathing says a lot about our health. Coughs, sneezes and sniffs, and whether we breathe
through the nose or the mouth, deeply or shallowly, all reflect the state of the respiratory system.
Following these behaviors through the day could support self-monitoring and care — but chest belts and
masks are obtrusive, and earbuds become uncomfortable and pick up the sounds around us.

**RespiraFrame** is an eyeglass frame that senses respiration through two complementary channels:

- **Bone-conduction acoustics.** A bone-conduction microphone embedded beside the nose captures
  breathing vibrations as they travel through the face. The sensor sits inside the frame, which
  shields it from airborne noise; its placement was chosen from four candidates as the one closest
  to the nasal airway.
- **Electrical impedance tomography (EIT).** Eight soft dry electrodes sit where glasses already
  touch the skin — the nose pads and temples. A small, safe current injected between neighboring
  electrodes yields 64 measurements per cycle that follow how facial tissue changes as we breathe.

Every four seconds, both signals are encoded by a two-branch network whose features are fused with
multi-head attention, recognizing five abnormal respiratory events (coughing, sneezing, sniffing,
nose blowing, throat clearing) and distinguishing nasal vs. oral, deep vs. shallow breathing, and
breathing vs. breath holding. It runs in real time.

## results

- Lab study, 19 participants: **92.5%** accuracy for abnormal events; **84.8–88.0%** for the three
  breathing tasks.
- Under background noise up to 80 dB, accuracy changed by **less than 3 points**; only 2.7% of a
  bystander's coughs or sneezes were attributed to the wearer.
- In the wild — 10 participants, 30 hours in an office, a cafeteria, and outdoors: **87.6%** for
  abnormal events, with no systematic decline over a four-week follow-up.
- Participants rated the glasses comfortable and socially acceptable — a more suitable everyday form
  factor than masks or earbuds.

## my role

I contributed to the experimental design and evaluation, designing evaluation protocols spanning
respiratory behaviors, motion and environmental interference, a three-day semi-wild study, and
repeated wear over a four-week longitudinal study.
