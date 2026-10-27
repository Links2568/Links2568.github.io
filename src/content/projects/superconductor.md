---
title: SuperConductor
tagline: Conducting an AI ensemble with your hands — gestures steer a real-time music model as it plays.
period: "2025 – 2026"
role: Research assistant
org: Generative AI for Music and Audio, University of Michigan · with Prof. Herman Dong
tags: [human-AI-co-creation, gesture, real-time-music-generation]
status: active
order: 6
kind: research
themes: [hai]
badges: ["In progress"]
fullTitle: "SuperConductor: Towards Playful Human-AI Music Co-creation"
venue: In progress
cover: /projects/superconductor/cover.webp
thumb: /projects/superconductor/cover.webp
abstract: "SuperConductor is a human–AI music co-creation system in which you steer an AI music generator with your hands and body, shaping its instrumentation, dynamics, tempo, density and tension as if conducting a group of AI players. Tableau Vivant, a webcam study, turns objects on a desk into players that the hands wake, conduct and silence. Next, the MagicBaton becomes the conductor's instrument, to study how a performer decides when the AI should follow and when it should improvise."
links:
  - { label: ArtsEngine, url: "https://artsengine.engin.umich.edu/feast/superconductor/" }
  - { label: MagicBaton, url: /projects/magicbaton/ }
gallery:
  - { src: /projects/superconductor/01_two-hands.webp, alt: "Tableau Vivant: the right hand conducts while the left wakes players, and the desk is repainted as a candlelit still life.", width: 1280, height: 713 }
  - { src: /projects/superconductor/02_three-players.webp, alt: "Three objects awake as players; each one lights up while it plays.", width: 1280, height: 713 }
  - { src: /projects/superconductor/03_fermata.webp, alt: "A fermata: holding the right hand high and still freezes the picture and holds the chord.", width: 1280, height: 713 }
  - { src: /projects/superconductor/04_system.webp, alt: "The SuperConductor system: hand tracking on a laptop turns gestures into a style recipe for Magenta RealTime on a GPU server, which streams the music back.", width: 1600, height: 1117, wide: true }
---

**SuperConductor** is Prof. Herman Dong's project on playful human–AI music co-creation: an
interactive system in which you steer an AI music generator with hand gestures and body movement,
shaping its instrumentation, dynamics, tempo, density and tension as if conducting a group of AI
players. The music comes from Magenta RealTime, generated on a GPU server and streamed back as it
plays (Figure 4).

## Tableau Vivant: a webcam study

Small objects on the desk become players (Figures 1–3). The right hand conducts tempo, beat and
dynamics; holding it high and still is a fermata, and a fist cuts the music off. The left hand
draws a player out of an object with a pinch and a lift, and presses it silent with an open palm;
a raised left fist builds tension, and opening the hand resolves it. The camera image is repainted
as a candlelit still life in which only the players and the hands are lit.

Under the picture, the link to the music model works in audio time: a two-stroke count-in, and
players that enter on the beats it announces, so the music lands where the hand says it should.

## Next: the baton as the conductor's instrument

[MagicBaton](/projects/magicbaton/) already senses beats, tempo and accent gestures with two IMUs.
Bringing it into SuperConductor changes the question from whether gestures can control the music
to how much the AI should follow, and when it should improvise.

- **Two time scales.** Beat, tempo and dynamics act on the music at once. A new idea or a change of
  instrumentation is prepared ahead and enters at the next bar or phrase, so the change stays
  musical and the player knows when it will land.
- **Keep or explore.** A "keep" gesture holds on to a motif the player likes; an "explore" gesture
  asks for something new in the next phrase, with a way back to the kept idea. Both are defined as
  things you can hear, such as keeping the melodic contour, changing the rhythm or adding a voice,
  rather than a higher sampling temperature.
- **A small first version.** Tempo, dynamics, and keep or explore, with one or two voices. It asks
  whether players can steer the music on purpose, stay in control after the AI changes something,
  and feel more involved without more to carry.
