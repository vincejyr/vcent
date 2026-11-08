---
layout: writing-post
title: "Outcomes > Outputs: A realistic take"
description: "Staying with the work past launch is where the real product decisions happen."
date: 2025-09-07 10:00:00 +0000
tags: ["productmanagement"]
permalink: "/writing/2025/9/7/outcomes-over-outputs-a-realistic-take/"
---

Every PM has heard “outcomes over outputs.” We say it in interviews, put it on slides and repeat it in planning. Part of the appeal is that it sets us apart. A project manager ships the thing; a product manager makes sure the thing worked.

But look at how most product teams actually run. A feature ships, there's a launch post in Slack and a few emoji reactions, and the PM is on the next initiative by the following sprint. Sometimes it's a reorg, sometimes the roadmap moves, sometimes the incentives just reward launching. Either way, the results dashboard gets built and then nobody looks at it. The metrics come in and land on nobody's desk.

When that happens, there's no learning loop. Nobody iterates, nobody kills what didn't work, and the next team inherits the result without the context.

## Start with a definition of done that isn't “shipped”

Owning an outcome starts before you write the first ticket. If “done” means “deployed to 100%,” you've already decided to walk away at launch.

A better definition of done has three parts:

- **The outcome you're trying to move,** stated as a change in user behaviour, not a feature: “new users set up a pipeline in their first session,” not “launch the pipeline wizard.”
- **The KPI that tells you it moved,** with a baseline and a target.
- **The point at which you'll decide:** when you'll look at the data, and what each result will lead you to do.

The third part is the one most teams skip. Without a decision point, a metric is just a number someone might check one day.

## Shrink the unit of done

The longer the gap between starting and learning, the more likely you are to have moved on before the results arrive. A six-month initiative that reports back in month eight is easy to orphan.

This is where experimentation helps beyond the statistics. It shrinks the unit of done. When my team got to a steady weekly rhythm of experiments, “did it work?” stopped being a retrospective question and became part of the week. It also made the reality hard to ignore: only a minority of experiments win. Many lose, and a surprising number are inconclusive. You only see that if you stay long enough to read every result.

A faster cycle also makes it cheaper to be wrong, and that's what lets a team act on bad news instead of explaining it away.

## Ownership has to come from the top

You can't just ask PMs to be more accountable. Teams follow what leadership rewards, and three things decide whether outcome ownership survives:

- **What gets celebrated.** If the all-hands only highlights launches, people will optimise for launches.
- **What happens when a goal is missed.** If the honest answer is “nothing,” the goal was decoration. If the answer is blame, people will stop setting real goals. The healthy middle is a missed goal followed by a clear decision: iterate, pivot or stop.
- **How much the team gets pulled toward the next shiny thing.** Every time leadership redirects a team mid-flight, the half-measured outcomes behind it are lost. Protecting time to finish learning is a leadership choice.

## What it looked like for me

**Inheriting other people's launches.** Early on I inherited a feature that someone else had shipped years earlier and then left to drift. It was expensive to run, it consumed a large share of the team's engineering time in bug fixes, and only a small fraction of customers used it regularly. Nobody had owned the outcome, so nobody had made the call. We sunset it and moved customers to partner alternatives. Staying with the work after the sunset taught me something uncomfortable: the replacements cost customers more and lacked features they relied on. A sunset is a launch too, and it has outcomes to own.

**Staying in one team long enough.** I've been lucky to spend over a year in one area, onboarding. That stability is what let me follow results from start to finish. Over time the data showed that what new customers did in their first month strongly predicted whether they were still around months later. That turned onboarding from a “first-day experience” into a retention lever, and it shaped what we built next.

**Letting the data change the plan.** We tested an AI-assisted step in one of our setup flows. It clearly helped first-time users and slightly hurt everyone else. If I'd rotated off at launch, it would have been a win on a slide. Because I stayed, we shipped it only to the users it helped. Another experiment came in just short of significance, and we rolled it back rather than pretending.

## Going forward

- **It starts with you.** You don't need permission to look at your own feature's data three months later.
- **Talk about outcomes, not just progress.** In standups, in roadmap reviews and when managing up, ask “did it work?” before “what's next?”
- **Plan for missing the target.** Every roadmap bet should come with a contingency plan: kill criteria agreed before launch, a pivot-or-persevere checkpoint and the fallback you'll take if the KPI doesn't move. A pre-mortem is a cheap way to write these down.
- **Celebrate outcomes, including the honest ones.** Celebrate the experiment that moved the metric, and also the team that killed a feature because the data said so.

Outcomes over outputs only means something if someone is still there when the outcomes arrive. Make sure that person is you.
