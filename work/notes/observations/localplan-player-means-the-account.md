---
title: LocalPlan.player means the ACCOUNT, one word after the tree split account from identity
type: observation
status: spotted
spotted: 2026-09-08
relates-to: web/src/lib/world/planning.ts, web/src/lib/world/view.ts, template-commit-reveal N3 (merge 4b98f8d)
---

# A name that was fine until the vocabulary underneath it changed

N3 landed upstream and merged here at `4b98f8d`. It exists to make one
distinction impossible to blur, and the whole tree now leans on it:

- the **account** is who signed in. It owns things and pays. Always an address.
- the **game identity** is who plays. The round, the commitment, the secret's
  domain separation and the storage key are keyed by it. Here it is an avatar.

`web/src/lib/world/planning.ts` has a `player` input, and `LocalPlan` has a
`player` field, and **both mean the ACCOUNT** (`Readable<\`0x${string}\`>`). They
are read by `world/view.ts` to work out which avatars on the board belong to
the signed-in account.

That was an unremarkable name before this merge. It is now the one word in this
repo that says "player" while meaning the thing the tree has just spent a
refactor teaching everyone is *not* the player. The avatar is the player. The
same structure sits right beside it and gets it right: `createPlanning` now
takes `activeIdentity` for the identity, so the file holds both vocabularies at
once.

## Why it was left alone

Deliberate, not missed. It is this repo's own module, it is not a shared file,
and it is therefore not N3's subject: N3's rule is that no file SHARED with the
template names an address as the identity, and `world/` exists nowhere upstream.
Renaming it would have mixed a taste change into a merge whose value is that
its diff is exactly the identity split.

## What it would cost, if someone wants it

Small and mechanical: the `player` input on `createPlanning`, the `player` field
on `LocalPlan`, its readers in `world/view.ts`, and the fixtures in
`test/lib/world/view.test.ts`, `planning.test.ts` and `display-plan.test.ts`.
`owner` is the name that matches the rest of the tree (`deposited`'s owner, the
avatar purchase's owner, `active-avatar.ts`'s owner) and would make this file
consistent with its own neighbours.

Worth doing on the next change that touches planning or the view for another
reason, rather than as a commit of its own.
