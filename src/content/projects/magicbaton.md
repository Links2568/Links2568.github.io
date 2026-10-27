---
title: MagicBaton
tagline: Gesture-based human–AI music interaction — a dual-IMU smart conducting baton driving real-time generation.
period: 2026 winter
role: Project lead
org: "University of Michigan · EECS 498: Machine Learning for Computational Sensors in Mobile/IoT Systems · PAT 564"
built: ["Dual-IMU baton", "Gesture ML", "Live music"]
work: ["Hardware prototyping", "Embedded firmware", "Dataset collection", "Model training and evaluation", "Real-time interaction", "Generative music"]
skills: ["ESP32", "I²C and BLE", "MPU-6050 IMUs", "Rigid-body kinematics", "Onshape CAD", "3D printing", "PyTorch", "1-D CNN and BiGRU", "SVM and random forest", "Leave-one-person-out CV", "Jerk-based onset detection", "WebSocket", "Tone.js", "Magenta MusicRNN"]
courseName: "Machine Learning for Computational Sensors in Mobile/IoT Systems"
course: EECS 498
tags: [HCI, music, gesture, embedded, generative-ai]
status: active
order: 1
themes: [hai]
cover: /projects/magicbaton/cover.webp
links:
  - { label: Code, url: "https://github.com/Links2568/MagicBaton" }
  - { label: Dataset, url: "https://github.com/Links2568/MagicBaton/tree/main/dataset" }
hero:
  src: /projects/magicbaton/loop-gestures.mp4
  poster: /projects/magicbaton/loop-gestures.webp
  width: 1280
  height: 720
videos:
  - label: Gesture recognition
    src: /projects/magicbaton/gestures.mp4
    poster: /projects/magicbaton/poster-gestures.webp
    duration: "0:47"
    width: 1690
    height: 1080
  - label: Music demo
    src: /projects/magicbaton/music-demo.mp4
    poster: /projects/magicbaton/poster-music.webp
    duration: "2:51"
    width: 1280
    height: 720
gallery:
  - { src: /projects/magicbaton/hw-anatomy.webp, alt: "Inside the baton: two MPU-6050s 15 cm apart and an ESP32 in a 39.78 cm printed body.", width: 1820, height: 1500, wide: true }
  - { src: /projects/magicbaton/hw-build.webp, alt: "The build: the open shell with the ESP32 and both IMUs wired, and the finished baton.", width: 2000, height: 1155, wide: true }
  - { src: /projects/magicbaton/hw-two-imus.webp, alt: "Why two IMUs: arm motion cancels in the difference, the baton's own turn remains.", width: 2000, height: 1050, wide: true }
  - { src: /projects/magicbaton/hw-signal-path.webp, alt: "From gesture to sound: baton, BLE, laptop, WebSocket, browser, three musical channels.", width: 2000, height: 867, wide: true }
  - { src: /projects/magicbaton/03_gesture-visuals.webp, alt: "Each recognised gesture gets its own visual: idle, shake, spin, beat.", width: 1600, height: 937 }
  - { src: /projects/magicbaton/04_pipeline.webp, alt: "The IMU difference signal feeds a CNN, an RNN, an SVM and a random forest.", width: 1600, height: 682 }
  - { src: /projects/magicbaton/05_lopo-vs-5fold.webp, alt: "About 99% when users are mixed; 70.6% on a person the model has never seen.", width: 1500, height: 825 }
  - { src: /projects/magicbaton/06_confusion.webp, alt: "CNN confusion for mixed users vs a held-out user: beat and slash blur together.", width: 1600, height: 690 }
---

A conducting baton that turns gestures into live musical control. A team project with Yi Rong,
Tiffany Cheung, Xiaolan Zhou and Aryan Thomare for EECS 498 (Machine Learning for Computational
Sensors in Mobile/IoT Systems), later extended into a generative-music instrument for PAT 564.

**The hardware.** The baton is a 39.78 cm body designed in Onshape and 3D-printed over several iterations, in sections that screw or snap together so the electronics stay reachable (Figure 1).
The grip widens to about 3.8 cm to hold an ESP32 DevKit v1; one MPU-6050 sits partway up the shaft
and a second near the tip, 15 cm apart. Both share a single 400 kHz I²C bus — tying one AD0 pin to
ground and the other to VCC gives them the addresses 0x68 and 0x69 (Figure 2). The ESP32 reads all
12 axes at 50 Hz and streams them over BLE as the device "MagicBaton", with USB serial as a
fallback; a USB power bank rides at the base. Everything heavier happens off the baton (Figure 4).

**Why two IMUs.** Because the two sensors are rigidly coupled, moving the arm pushes both the same
way and their half-difference (A − B) / 2 cancels it, while turning the baton swings the far sensor
more, so the difference keeps exactly the rotation a conductor's gesture is made of (Figure 3). Six
differential channels replace twelve raw ones, with roughly half the cross-user variance.

**Recognition.** We recorded 934 clips from four people across eight classes (beat, stab, spin,
slash, shake, flick, wing, idle) and released them as a public dataset. A 38k-parameter 1-D CNN
reaches 98–99% when users are mixed, but 70.6% on a person it has never seen; an SVM and a random
forest match it within users but drop to about 60% on new people, with far wider spread. The gap
between people, not model capacity, is the real problem.

**Three ways to play.** In the browser, Tone.js and Magenta's MusicRNN listen on three channels.
Beats set the tempo from the last four inter-beat intervals; stab, flick and shake fire accents
quantised to the next eighth note; slash, wing and spin ask MusicRNN to continue the music with
different seeds and temperatures. The conductor can pace, ornament and recompose at once.

**Next.** More people and a short per-user calibration to close the cross-user gap. On the
hardware side, the external wiring and power bank still make the prototype bulkier than a real
baton; a self-contained enclosure with a small battery and the model quantised onto the ESP32 would
make it a standalone instrument. Beyond that, the baton is to become the conductor's instrument for
[SuperConductor](/projects/superconductor/), steering a real-time music model and deciding when it
follows and when it improvises.
