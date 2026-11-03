---
title: VeilLens
tagline: Shows what AI models can infer from an everyday photo, then removes the clues you choose and checks what still gets through.
period: "2026"
role: Co-first author
org: Human Centered Computing Lab, University of Michigan · with Prof. Ke Sun
tags: [AI-security, privacy, HCI]
status: active
order: 3
kind: research
themes: [hai]
badges: ["arXiv preprint coming soon"]
fullTitle: "VeilLens: Explainable and Granular Analysis and Protection Against Visual Privacy Risks Beyond Visible Appearance"
venue: arXiv preprint coming soon
cover: /projects/veillens/loop.webp
thumb: /projects/veillens/loop.webp
abstract: "Today's vision-language models combine weak, everyday clues in a photo — a work badge, a shop sign, a street bollard, the people you are with — into who you are, where you are, and who you are with. VeilLens turns these hidden inferences into evidence you can inspect and edit: it explains what could be inferred, grounds each clue in the image, removes the clues you select, and re-attacks the result to check what still gets through."
links: []
hero:
  src: /projects/veillens/loop.mp4
  poster: /projects/veillens/loop.webp
  width: 1280
  height: 720
videos:
  - label: 30-second teaser
    src: /projects/veillens/teaser.mp4
    poster: /projects/veillens/poster-teaser.webp
    duration: "0:30"
  - label: Narrated demo
    src: /projects/veillens/demo.mp4
    poster: /projects/veillens/poster-demo.webp
    duration: "3:06"
    captions:
      - { lang: en, label: English, src: /projects/veillens/demo.en.vtt }
      - { lang: zh, label: 中文, src: /projects/veillens/demo.zh.vtt }
gallery:
  - { src: /projects/veillens/01_ai-guesses-location.webp, alt: "A vision-language model geolocates an ordinary street photo to Aachen, 0.4 km from the true spot.", width: 1600, height: 900 }
  - { src: /projects/veillens/02_everyday-clues.webp, alt: "Weak, everyday clues — badges, logos, signs, bollards — combine into identity, location, and relationship inferences.", width: 1600, height: 900 }
  - { src: /projects/veillens/03_reason-ground-edit-verify.webp, alt: "The Reason → Ground → Edit → Verify loop.", width: 1600, height: 900 }
  - { src: /projects/veillens/05_detected-clues.webp, alt: "Detected clues, each with a privacy level and a reason, grounded to exact regions.", width: 1600, height: 900 }
  - { src: /projects/veillens/06_second-round.webp, alt: "A second round finds residual evidence; the user decides what to keep.", width: 1600, height: 900 }
  - { src: /projects/veillens/04_inference-suppressed.webp, alt: "After editing, the best guess jumps ~70 km away with low confidence.", width: 1600, height: 900 }
  - { src: /projects/veillens/07_protection-summary.webp, alt: "Protection summary — only 2% of pixels changed.", width: 1600, height: 900 }
  - { src: /projects/veillens/08_results.webp, alt: "Evaluation results.", width: 1600, height: 900 }
---

Ask a modern vision-language model where an ordinary street photo was taken, and it may answer
correctly to within a few hundred meters. Faces and license plates are only the obvious part: today's
models combine weak, everyday clues — a work badge, a logo on a bag, a shop sign, a street bollard,
the people you are with — and together those clues reveal who you are, where you are, and who you are
with. Most existing tools blur fixed categories or perturb the whole image; they rarely show what
leaks, let you decide what to change, or check what still gets through.

**VeilLens** turns these hidden inferences into evidence you can inspect and edit.

## How it works

- **Reason** — a trusted vision-language model explains what an attacker could infer, and why.
- **Ground** — each clue is localized to an exact image region, with a privacy level and a reason.
- **Edit** — the clues the user selects are removed with generative inpainting that keeps the rest of the scene.
- **Verify** — a verifier re-attacks the result, and the loop repeats until the inference is suppressed.

Protection is granular: in the demo, geolocation is protected at the street and city level while
country-level clues are deliberately kept. VeilLens advises, but the user decides.

## Results

- Evaluated on 1,454 images with more than 20,000 model queries.
- Compositional privacy risk reduced by **48.7%**.
- Against the strongest attacker tested, street-block geolocation success fell from **40.2% to 14.6%**, well below the strongest prior defense.
- Relationship inference dropped by more than **92%**.
- In a study with 25 participants, **70.7%** of choices preferred the protected image, with high ratings for understanding the risk and trusting the protection.
