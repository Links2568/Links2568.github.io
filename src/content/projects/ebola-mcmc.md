---
title: Bayesian MCMC for Ebola Outbreak Data
shortTitle: Ebola Outbreak MCMC
tagline: Data-augmentation MCMC for partially observed epidemic data with censoring.
period: 2025 fall
role: Solo project
org: "University of Michigan · BIOSTAT 682: Applied Bayesian Inference"
built: ["Bayesian MCMC", "SIR model"]
work: ["Bayesian modelling", "MCMC sampling", "Epidemic reconstruction", "Time-series modelling"]
skills: ["Survival models with censoring", "Data augmentation", "Metropolis–Hastings MCMC", "Discrete-time SIR", "Random-walk priors", "Bayesian logistic regression", "Convergence diagnostics", "R and Stan"]
courseName: "Applied Bayesian Inference"
course: BIOSTAT 682
tags: [Bayesian, MCMC, epidemiology, statistics]
status: done
order: 5
themes: [ai4sci]
cover: /projects/ebola-mcmc/cover.webp
links:
  - { label: Report, url: /projects/ebola-mcmc/report.pdf }
gallery:
  - { src: /projects/ebola-mcmc/01_sir.webp, alt: "Reconstructed epidemic: the infectious count, and S, I and R over 120 days.", width: 1038, height: 606 }
  - { src: /projects/ebola-mcmc/02_removal-rate.webp, alt: "Infectious count against the time-varying removal rate and its 95% band.", width: 1050, height: 648 }
  - { src: /projects/ebola-mcmc/03_state-dependent.webp, alt: "Removal probability rises with the infectious fraction.", width: 1050, height: 648 }
  - { src: /projects/ebola-mcmc/04_latent-time.webp, alt: "Posterior of one censored case's latent removal time.", width: 1050, height: 648 }
---

How fast are infectious people removed from circulation during an Ebola outbreak — and does
that speed change as the outbreak grows? Working from individual-level records of one outbreak
wave (about 1,000 cases), I built a sequence of Bayesian models for BIOSTAT 682.

**Censoring, handled honestly.** Symptom onset is observed, but many removal times are only
known to be later than some date. An exponential survival model with Bayesian data augmentation
treats those latent times as parameters and samples them jointly with the removal rate by MCMC.
The posterior removal rate is about 0.22 per day (95% CI 0.20–0.23), a mean infectious period of
roughly 4.6 days, with R̂ ≈ 1 and effective sample sizes above 50,000.

**From people to the epidemic curve.** Each posterior draw of the latent times rebuilds a daily
susceptible–infected–removed trajectory, so the uncertainty about individual removals carries
through to credible bands around the whole epidemic curve — a more honest picture than a single
deterministic SIR fit.

**A response that sped up.** Aggregating to daily blocks, a random-walk prior lets the removal
rate drift over time, and a Bayesian logistic regression links it to system load. The coefficient
on the infectious fraction is strongly positive (6.48, 95% CI 1.61–11.45): removal got faster as
cases rose, consistent with isolation efforts scaling up. A positive time trend (0.22) suggests
outbreak management also improved with experience.
