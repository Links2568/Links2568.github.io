---
title: a synoptic chart for a homepage
description: Why the background of this site is a live weather map — jet stream, pressure systems, isobars — and what canvas taught me the hard way.
date: 2026-08-19
tags: [meta, canvas, meteorology]
---

This site's background is not a particle system. It is a synoptic chart: a meandering
jet stream, a drifting high and low (H/1024 and L/996, spinning the correct directions
for the northern hemisphere), and isobars traced over the pressure field with marching
squares. Your cursor is a small cyclone — air converges into it, counterclockwise, the
way it should. A click sets off a downburst.

I grew up obsessed with weather maps, so when I rebuilt this site I wanted the
background to be one — quietly running, ignorable, but *correct* if you look closely.

## the stack

The site is [Astro](https://astro.build): static output, content collections for
projects and posts, deployed to GitHub Pages by an Action. The design system is two IBM
Plex faces and a handful of CSS custom properties — dark-first, with a light "day
shift" toggle. All the motion lives in one canvas and one script.

## what canvas taught me

The classic trick for motion trails is the *accumulation veil*: instead of clearing the
canvas each frame, you paint a translucent background-colored rectangle over it, and
old strokes fade under repeated veils. It looks great — for about twenty seconds.

Then you notice the ghosts. Alpha compositing in an 8-bit canvas rounds; below a
certain brightness difference, `old * (1 - a) + bg * a` rounds back to `old`, and the
pixel never converges to the background. Every trail leaves a permanent faint scar.

The fix is boring and absolute: `clearRect` every frame, and draw each particle's trail
explicitly — a short history of points, stroked in a few alpha bands. More bookkeeping,
zero ghosts. If you're building anything with canvas trails, skip the veil.

## the tornado cursor

The cursor is an SVG data-URI — a little funnel, hotspot near the tip so it still
*points* like a cursor — with three canvas ellipses spinning around wherever it goes.
Counterclockwise, of course. A clockwise tornado in Michigan would be embarrassing.
