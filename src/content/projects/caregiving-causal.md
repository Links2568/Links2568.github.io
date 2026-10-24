---
title: Does Caregiving Cause Distress?
tagline: A matched-pairs causal study of unpaid caregiving and emotional distress in older adults, with Rosenbaum sensitivity analysis.
period: 2026 winter
role: Co-author
org: "University of Michigan · STATS 571: Causal Inference"
built: ["Matching", "Sensitivity analysis"]
work: ["Study design", "Data cleaning", "Matching", "Effect estimation", "Sensitivity analysis"]
skills: ["Potential outcomes", "SUTVA and ignorability", "Propensity scores", "Pair matching", "McNemar test", "Rosenbaum bounds", "R"]
courseName: "Causal Inference"
course: STATS 571
tags: [causal-inference, matching, statistics, public-health]
status: done
order: 4
themes: [ai4sci]
cover: /projects/caregiving-causal/cover.webp
links:
  - { label: Report, url: /projects/caregiving-causal/report.pdf }
gallery:
  - { src: /projects/caregiving-causal/01_balance.webp, alt: "Covariate balance before and after matching: every difference falls below 0.033.", width: 1600, height: 1303 }
  - { src: /projects/caregiving-causal/02_sensitivity.webp, alt: "Rosenbaum bounds: significance holds only up to Γ = 1.075.", width: 1600, height: 828 }
  - { src: /projects/caregiving-causal/03_propensity.webp, alt: "Estimated propensity scores for caregivers and non-caregivers before matching.", width: 551, height: 537 }
---

Older adults often take on unpaid care for a spouse, relative or friend, and caregivers report
more emotional distress. But the people who become caregivers differ from those who don't, so
is the caregiving itself to blame? In a team project with Devanshi Shah and Jiadong Zhu, we used the
Wisconsin Longitudinal Study to estimate the effect
of current caregiving on recent emotional distress among caregivers (the ATT).

**Design.** The study follows Wisconsin's high-school class of 1957 into their early 70s. We took
treatment and outcome from Round 6 (2010–2012) and covariates mostly from Round 5 (2003–2006): age, education,
wealth, marital status, children, physical and mental health, rural–urban residence and prior
caregiving. Matching 1,872 caregivers to comparable non-caregivers gave 1,870 pairs, with every
standardized difference below 0.033 (prior caregiving went from 0.201 to 0).

**Result.** Caregiving raised the probability of feeling fretful, angry, irritable, anxious or
depressed in the past four weeks by 4.6 percentage points (McNemar p = 0.004, 95% CI 1.5–7.7).

**How much to believe it.** A Rosenbaum sensitivity analysis shows the effect stays significant
only up to Γ = 1.075 and is gone by Γ = 1.1: an unmeasured confounder that shifts the odds of
becoming a caregiver by about 10% would be enough to erase it. Together with treatment and
outcome being measured in the same wave, the honest reading is a precise but fragile estimate —
and a case for panel designs that follow people into caregiving.
