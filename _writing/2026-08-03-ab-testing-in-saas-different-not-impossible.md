---
layout: writing-post
title: "A/B Testing in SaaS: Different, Not Impossible"
description: "Experimentation in B2B isn't the same as in B2C, but the same principles apply with a few tweaks."
date: 2026-08-03 10:00:00 +0000
tags: ["productmanagement"]
permalink: "/writing/2026/8/3/ab-testing-in-saas-different-not-impossible/"
---

A friend of mine works at Meta, and they like to remind me that their A/B tests reach millions of users a day and get called within days. That isn't the world most of us in B2B SaaS live in.

Most experimentation advice is written for B2C scale. Apply it directly to a B2B product and you either wait weeks, sometimes months, for a result that never arrives or call one you shouldn't. But experimentation in B2B is very much possible and I hope to dissect it in this post.

## Why A/B testing is harder in B2B

- **Traffic and time.** User volume in B2B is a fraction of what B2C products see, and the outcomes that matter, like trial-to-paid, expansion and retention, play out over weeks or months, often with a salesperson in the middle. Fewer users and slower outcomes mean a longer wait for a result, and some tests never get there.
- **Who is the user?** B2B products serve very different personas. The person who decides to buy is often not the person who uses the product every day. An admin setting up the account, a manager reading reports and a rep logging calls all experience the product differently. Be clear which of them the test is aimed at. It also changes how you split the test: randomise by user inside one company and colleagues see different versions, but randomise by account and your sample shrinks even further.
- **Attribution.** You want a success metric close to revenue, but in B2B the path from X to Y isn't linear. Revenue is shaped by the economy, pricing, competitors and sales conversations that happen outside the product. That makes it much easier to confuse correlation with causation than in B2C, where the path from click to purchase is usually shorter.

## How to run A/B tests in B2B

Here's what has worked for my team.

- **Start from a customer problem.** This comes first. No tests for the sake of testing. Every experiment should be rooted in a real customer problem and driven by a hypothesis. We use a simple format: “We believe we should do X because Y, and we aim to learn Z.” And please, let's not test button colours. That's so 2010s. With limited traffic, every test should be a meaningful bet.
- **Agree the rules before you start.** Have a playbook that defines what counts as a win, a loss and an inconclusive result, and stick to it. Without one, every result turns into a debate, and the loudest opinion in the room decides. Plan for inconclusive results in particular. Only a minority of experiments win, and many never reach a clear answer. Decide up front what you'll do with a flat result, usually keeping the simpler version, so it doesn't turn into another month of waiting.
- **Define success on two levels.** The primary metric should be tied to revenue, such as trial-to-paid conversion. Back it up with micro-conversion metrics from the product: the user behaviours you expect the change to affect, ideally your activation event. Be clear from the start that both need to move. We've seen cases where the revenue metric was positive but there was no evidence that user behaviour had changed. That isn't a win yet. It's a signal to dig deeper. The reverse matters too: you can move a click or a setup step without moving the outcome. For a real winner, both should be positive, with a few guardrail metrics that must not get worse.
- **Go Bayesian.** Frequentist tests need a fixed sample size and a p-value, which is exactly what low-traffic products struggle with. A Bayesian approach answers a more useful question: how likely is it that the variant is better, and by how much? It also lets you set thresholds that match your appetite for risk. For example, we call an experiment a winner when it has at least an 80% probability of beating the control and the estimated uplift has held steady within a ±10% range for a set number of days. That's a business decision rather than an academic one, and it lets you act on smaller samples.
- **Run tests in parallel.** With limited traffic, running one test at a time is too slow. Overlapping tests do affect each other, but with random assignment each test's influence is spread evenly across the variants of the others. That means you can keep several tests live at once instead of waiting in a queue. Just be careful with tests that change the same screen or flow.
- **Keep delivery cycles short.** The faster you ship, the more experiments you have live, and the more you learn. My team got to 1.3 experiments a week, and with this approach we increased our experiment velocity by almost 400%.
- **Look beyond the test itself.** Keep a small holdout group on the old experience for months to see whether your shipped winners really moved retention. Pair the numbers with qualitative signal: with a small sample, five customer calls about why people dropped off can explain a result that the data alone can't.
- **Write down what you learn.** Every result, including the losses and the inconclusive ones, goes into an experiment repository and gets shared with the wider team. Over time that repository becomes one of the best inputs for choosing the next big bet.

## When not to A/B test

Some decisions shouldn't be A/B tests at all.

- **Pricing.** Showing two customers different prices for the same product becomes a trust problem the moment they compare notes, and in B2B they will. Fake-door tests, packaging research and launching in a new segment or market are safer ways to learn.
- **Big redesigns.** A redesign changes too many things at once to tell which one mattered, and existing users punish change in the short term. Validate it with prototypes and a staged rollout, then measure against a holdout.
- **Strategy calls.** Whether to enter a market, build a platform or retire a product won't fit in a two-week test. A test can inform parts of the decision, but it can't make the call for you.

A useful rule of thumb: test when the decision is reversible and the effect is measurable in a reasonable window. Otherwise, decide, and measure afterwards.

## Testing AI features when outputs vary

AI features add a new wrinkle. In a normal test, everyone in the variant sees the same thing. With a model in the loop, two users in the same variant can get different outputs, and the same user can get a different answer tomorrow. You're testing a distribution, not a feature.

- **Separate quality from impact.** Use evals to check the output is good enough before the test, so the A/B test measures whether users benefit, not whether the model is broken.
- **Segment the result.** AI help often lands differently with different users. A suggestion that saves a first-time user ten minutes can get in the way of an experienced one who already knows what they want. Look at new and existing users separately before you call it.
- **Treat cost and latency as guardrails.** A variant that wins on conversion but doubles your inference bill or adds seconds of waiting may not be a win.
- **Expect drift.** Models and prompts change. A result from three months ago may not hold for the version running today, so re-check the ones that matter.

## Different, not impossible

Experimentation in B2B isn't the same as in B2C, and it won't be at that scale. But the same principles apply with a few tweaks: start from a customer problem, agree what success means before you launch, use statistics that fit your traffic, and ship fast enough to keep learning. The goal was never to prove every decision. It's to be wrong less often, and to find out sooner when you are.

Happy experimenting!
