# The `work` branch

Maintainer material for `reveal-or-die`: the port plan, the audits it came from, and the handoff. **It is an orphan branch and it is not part of any working tree**, so `ls` from the repo root will not show it.

Read a file with `git show work:<path>`, or check it out beside the repo with `git worktree add ../reveal-or-die-work work`.

## Why a branch

Inherited from `template-commit-reveal`, which took it from jolly-roger (`0727847`). The template's reason is that everything on its `main` cascades into every game forever; the reason it holds HERE, where nothing descends from this repo except bomber-world, is narrower and still real: this material is about BUILDING the game, and a clone of a finished game should not have to work out that `web-port.md`'s follow-up list is a historical record rather than a to-do.

The test for what stays on `main`: **is it addressed to somebody MAINTAINING this repo, or to somebody USING or RUNNING it?**

## What deliberately did NOT move

`docs/plans/identity-without-consent.md` stays on `main`, and it is the exception that shows the test working. It documents a live weakness in contracts that get DEPLOYED (`Avatars.mint` has no access control, so the stake is free), it is cited by path from `Avatars.sol` and `GameDeposit.sol` and carried into their generated artifacts, and the person who most needs it is exactly the one who cloned this repo and does not know there is a branch. That makes it adopter material, not maintainer material.

## Layout

- `docs/plans/` - `web-port.md` (what the port did and what it left), `handoff.md` (the state of the repo).
- `docs/audits/` - the pre-port audits the plan answers.

The template's own material - `HANDOFF.md`, `games-on-this-foundation.md`, `play-modes.md`, `delegation-multi-signer.md` - is NOT duplicated here. It lives on `template-commit-reveal`'s `work` branch and is read with `git show work:<path>` there. It used to arrive on this repo's `main` by cascade, which is precisely what moving it off the template's `main` fixed.
