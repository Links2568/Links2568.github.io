---
title: MagicBaton
tagline: Gesture-based human–AI music interaction — a dual-IMU smart conducting baton driving real-time generation.
period: 2026 winter
role: Builder
org: University of Michigan
tags: [HCI, music, gesture, embedded, generative-ai]
status: active
order: 1
themes: [hai]
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
  Media how-to — files live in public/projects/<slug>/ :

  Short silent demo loop (10-15s, plays like a GIF at 1/10 the size).
  width/height = the file's real pixels; they prevent layout shift:
    <video autoplay muted loop playsinline width="1280" height="720">
      <source src="/projects/magicbaton/demo-loop.mp4" type="video/mp4" />
    </video>

  Full demo with sound (user clicks play; poster = cover frame):
    <video controls preload="metadata" poster="/projects/magicbaton/poster.jpg"
           width="1920" height="1080">
      <source src="/projects/magicbaton/demo.mp4" type="video/mp4" />
    </video>

  Long/large demo (>40MB): upload to YouTube (unlisted is fine), then:
    <div class="video-embed">
      <iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
              title="MagicBaton demo" loading="lazy" allowfullscreen
              allow="encrypted-media; picture-in-picture"></iframe>
    </div>

  Image / GIF:
    ![Baton hardware](/projects/magicbaton/hardware.jpg)

  Captioned figure:
    <figure>
      <img src="/projects/magicbaton/pipeline.png" alt="Pipeline overview" />
      <figcaption>From 12-axis motion to MIDI in real time.</figcaption>
    </figure>
-->
