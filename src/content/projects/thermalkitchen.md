---
title: ThermalKitchen
tagline: An egocentric RGB–thermal video benchmark that asks whether vision-language models can tell how hot things are.
period: "2026"
role: Co-author
org: University of Michigan
tags: [egocentric-video, thermal-sensing, VLM, benchmark]
status: active
order: 5
kind: research
themes: [sensing, context]
badges: ["Under review"]
fullTitle: "ThermalKitchen: An Egocentric Video QA Benchmark for Thermal-State Understanding"
venue: Under review
cover: /projects/thermalkitchen/paper-cover.webp
thumb: /projects/thermalkitchen/paper-cover.webp
teaser:
  src: /projects/thermalkitchen/paper-fig1.webp
  width: 2400
  height: 1458
  caption: "ThermalKitchen overview. (a) A home-cooking scene. (b) Synchronized RGB and thermal frames with per-frame temperature arrays. (c) Examples from the three evidence groups."
abstract: "A vision-language model can see what is on the stove, but can it tell how hot it is? ThermalKitchen is an egocentric RGB–thermal video QA benchmark: 28.37 hours of head-mounted video from 49 unscripted cooking episodes by eight people in eight kitchens, plus four scripted scenarios, with per-pixel temperature readings and 395 human-written questions labelled by whether they need RGB, thermal, or both. Across six VLMs, thermal-only input beats RGB-only by 9–15 points and joint input reaches 70.1%, yet models that find the right object and moment still misread its temperature: on the Hard100 set, over 90% of object and event claims are correct but only about 30% of local thermal-state readings."
gallery:
  - { src: /projects/thermalkitchen/01_capture.webp, alt: "Head-mounted capture: a 120° RGB camera and a 57° thermal camera with per-frame temperature arrays.", width: 1601, height: 1232 }
  - { src: /projects/thermalkitchen/02_questions.webp, alt: "The 395 questions by required evidence: 61 RGB, 106 thermal, 228 both.", width: 1201, height: 1701 }
  - { src: /projects/thermalkitchen/03_answers.webp, alt: "When the text-only guess is wrong, thermal input makes models repeat it less often.", width: 1600, height: 548 }
---

Everyday physical tasks depend on judging heat — whether a pan is still hot after the stove is
off, whether food out of the microwave is actually warm. Appearance often doesn't say,
and a thermal camera can contradict what the scene suggests. ThermalKitchen asks whether
vision-language models can use thermal observations to judge the thermal state of the right
object at the right moment.

**The benchmark.** Participants wore a head-mounted rig with an RGB camera and a radiometric
thermal camera while cooking at home: 49 unscripted episodes by eight people in eight kitchens,
plus four scripted scenario collections, 28.37 hours in all. Every frame comes with per-pixel
temperatures. On top of it sit 395 human-written multiple-choice questions about physical states
and how they change, each labelled by the evidence it needs: RGB (61), thermal (106) or both (228).

**What models do.** We evaluated six VLMs with the question alone and with RGB-only,
thermal-only and side-by-side RGB–thermal video. Question-only accuracy stays near chance;
thermal-only beats RGB-only for every model by 9.1–15.4 points, and joint input is best, peaking
at 70.1%.

**Where they fail.** A diagnostic set, Hard100, audits each explanation against reference
observations. With joint input, over 90% of the claims about objects and events are right, but
only about 30% of local thermal-state readings — models find the right pan and the right moment,
then misread how hot it is. Stating the relevant observations in text lifts one model from 30.9%
to 83.0%, without giving away the rule or the answer.
