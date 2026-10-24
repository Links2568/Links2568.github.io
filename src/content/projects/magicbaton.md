---
title: MagicBaton
tagline: Gesture-based human–AI music interaction — a dual-IMU smart conducting baton driving real-time generation.
period: 2026 winter
role: Builder
org: "University of Michigan · EECS 498-010 & PAT 564"
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
  - { src: /projects/magicbaton/01_baton-design.webp, alt: "A 39.78 cm printed baton: ESP32 in the grip, two IMUs 15 cm apart.", width: 1600, height: 657 }
  - { src: /projects/magicbaton/02_wiring.webp, alt: "Two MPU-6050s share one I2C bus (0x68 / 0x69) and stream over BLE.", width: 1600, height: 900 }
  - { src: /projects/magicbaton/03_gesture-visuals.webp, alt: "Each recognised gesture gets its own visual: idle, shake, spin, beat.", width: 1330, height: 710 }
  - { src: /projects/magicbaton/04_pipeline.webp, alt: "The IMU difference signal feeds a CNN, an RNN, an SVM and a random forest.", width: 1600, height: 682 }
  - { src: /projects/magicbaton/05_lopo-vs-5fold.webp, alt: "About 99% when users are mixed; 70.6% on a person the model has never seen.", width: 1500, height: 825 }
  - { src: /projects/magicbaton/06_confusion.webp, alt: "CNN confusion for mixed users vs a held-out user: beat and slash blur together.", width: 1600, height: 690 }
---

A conducting baton that turns gestures into live musical control. Built with Yi Rong, Tiffany
Cheung, Xiaolan Zhou and Aryan Thomare for EECS 498 (embedded systems and machine learning),
then extended into a generative-music instrument for PAT 564.

**The instrument.** A 39.78 cm 3D-printed baton, designed in Onshape over several print
iterations, holds an ESP32 in the grip and two MPU-6050 IMUs 15 cm apart on one I2C bus. It
streams 12-axis motion at 50 Hz over BLE; every computation happens off the baton.

**Why two IMUs.** The sensors are rigidly coupled, so their half-difference (A − B) / 2 cancels
common-mode arm and wrist motion and keeps the baton's own rotation: six channels instead of
twelve, with roughly half the cross-user variance of the raw signal.

**Recognition.** We recorded 934 clips from four people across eight classes (beat, stab, spin,
slash, shake, flick, wing, idle) and released them as a public dataset. A 38k-parameter 1-D CNN
reaches 98–99% when users are mixed, but 70.6% on a person it has never seen; an SVM and a random
forest match it within users but drop to about 60% on new people, with far wider spread. The gap between people, not model
capacity, is the real problem.

**Three ways to play.** In the browser, Tone.js and Magenta's MusicRNN listen on three channels.
Beats set the tempo from the last four inter-beat intervals; stab, flick and shake fire accents
quantised to the next eighth note; slash, wing and spin ask MusicRNN to continue the music with
different seeds and temperatures. The conductor can pace, ornament and recompose at once.

**Next.** More people and a short per-user calibration to close the cross-user gap, and a
self-contained enclosure with the model running on the baton itself.
