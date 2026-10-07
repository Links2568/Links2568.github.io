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
themes: [sensing]
badges: ["CHI 2027 under review"]
fullTitle: "RespiraFrame: On-Frame Respiratory Monitoring via Electrical Impedance Tomography and Bone-Conduction Acoustics"
venue: CHI 2027 · under review
abstract: "RespiraFrame is an eyeglass frame that monitors respiration through two complementary channels: a bone-conduction microphone beside the nose that hears breathing through the face rather than the air, and electrical impedance tomography from eight soft dry electrodes on the nose pads and temples. A two-branch network fused with attention recognizes five abnormal respiratory events and distinguishes nasal vs. oral, deep vs. shallow breathing, and breath holding — 92.5% for abnormal events in a 19-participant lab study, under 3 points of change at 80 dB of noise, and 87.6% over 30 hours of in-the-wild wear."
cover: /projects/respiraframe/chi-cover.webp
thumb: /projects/respiraframe/chi-cover.webp
links:
  - { label: Interactive talk, url: /projects/respiraframe/talk/index.html }
hero:
  src: /projects/respiraframe/chi-loop.mp4
  poster: /projects/respiraframe/chi-loop.webp
  width: 1280
  height: 720
videos:
  - label: CHI video — narrated demo
    src: /projects/respiraframe/demo.mp4
    poster: /projects/respiraframe/chi-poster.webp
    duration: "4:50"
    captions:
      - { lang: en, label: English, src: /projects/respiraframe/demo.en.vtt }
      - { lang: zh, label: 中文, src: /projects/respiraframe/demo.zh.vtt }
gallery:
  - { src: /projects/respiraframe/chi-bone-conduction.webp, alt: "Sense 1: a bone-conduction microphone embedded beside the nose pad.", width: 1600, height: 900 }
  - { src: /projects/respiraframe/chi-noise.webp, alt: "Under 40–80 dB airborne noise, the bone-conduction channel stays clean while a conventional microphone does not.", width: 1600, height: 900 }
  - { src: /projects/respiraframe/chi-eit.webp, alt: "Sense 2: electrical impedance tomography with eight soft dry electrodes.", width: 1600, height: 900 }
  - { src: /projects/respiraframe/chi-eit-channels.webp, alt: "EIT channels during deep breathing (real data).", width: 1600, height: 900 }
  - { src: /projects/respiraframe/chi-recognition.webp, alt: "Five abnormal respiratory events and three breathing-pattern tasks.", width: 1600, height: 900 }
  - { src: /projects/respiraframe/chi-lab-study.webp, alt: "Lab study: 19 participants, 10,480 samples.", width: 1600, height: 900 }
  - { src: /projects/respiraframe/chi-bystander.webp, alt: "Only 2.7% of a nearby person's events were attributed to the wearer.", width: 1600, height: 900 }
  - { src: /projects/respiraframe/chi-in-the-wild.webp, alt: "In the wild: 10 participants, 30 hours across office, cafeteria, and outdoors.", width: 1600, height: 900 }
  - { src: /projects/respiraframe/chi-live-demo.webp, alt: "Real-time demo: nasal vs. oral breathing, even with a hair dryer blowing nearby.", width: 1600, height: 900 }
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

## Results

- Lab study, 19 participants: **92.5%** accuracy for abnormal events; **84.8–88.0%** for the three
  breathing tasks.
- Under background noise up to 80 dB, accuracy changed by **less than 3 points**; only 2.7% of a
  bystander's coughs or sneezes were attributed to the wearer.
- In the wild — 10 participants, 30 hours in an office, a cafeteria, and outdoors: **87.6%** for
  abnormal events, with no systematic decline over a four-week follow-up.
- Participants rated the glasses comfortable and socially acceptable — a more suitable everyday form
  factor than masks or earbuds.

## My role

I contributed to the experimental design and evaluation, designing evaluation protocols spanning
respiratory behaviors, motion and environmental interference, a three-day semi-wild study, and
repeated wear over a four-week longitudinal study.
