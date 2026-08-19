---
title: MagicBaton
tagline: Gesture-based human–AI music interaction — a dual-IMU smart conducting baton driving real-time generation.
period: 2026 winter
role: Builder
org: University of Michigan
tags: [HCI, music, gesture, embedded, generative-ai]
status: active
order: 1
# cover: /projects/magicbaton/cover.png
links: []
---

A smart conducting baton that turns conducting gestures into live musical control. Dual
IMUs stream 12-axis motion at ~50 Hz into a real-time edge compute pipeline: a gesture
recognition model, jerk-based beat and BPM estimation, MIDI playback, and in-browser
Magenta MusicRNN generation — so the baton doesn't just follow tempo, it steers the music.

Along the way we collected a public dataset of ~934 recordings across eight gesture
classes for training and evaluating gesture models.

<!--
  Media how-to (images / GIFs / video all live in public/projects/<slug>/):

  Image or GIF:
    ![Baton hardware](/projects/magicbaton/hardware.jpg)

  Video (muted loop, plays inline like a GIF but 10x smaller file):
    <video autoplay muted loop playsinline>
      <source src="/projects/magicbaton/demo.mp4" type="video/mp4" />
    </video>

  Captioned figure:
    <figure>
      <img src="/projects/magicbaton/pipeline.png" alt="Pipeline overview" />
      <figcaption>From 12-axis motion to MIDI in real time.</figcaption>
    </figure>
-->
