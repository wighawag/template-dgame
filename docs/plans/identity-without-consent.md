# Anyone can play as anyone, for gas (inherited)

Status: **CLOSED here, 2026-09-09. Still open in bomber-world.** The finding is
not this repo's, but the code was.

## Both halves are now shut, and they were shut separately

The attack was a COMPOSITION of two permissive things, which is why it survived
so long: each half looked defensible on its own.

- **The forged `(owner, controller)` payload.** Closed during the port. The
  deposit payload is now a single `address owner`, and who may PLAY an avatar is
  decided by delegation - account-wide, granted by the owner's own signature
  through `GameDelegation` - rather than asserted by whoever paid. There is no
  longer a controller field to forge.
- **The free mint.** Closed now. `Avatars.mint` was `external` with no access
  control; it now reverts unless the caller is `Avatars.minter`, which the
  deployment points at the `AvatarsSale` proxy. `minter` is zero until wired, so
  a deployment that forgets mints nothing at all rather than minting for free.

**Read the order carefully, because it is the point.** For a while only the
first half was closed, and this document still described the whole composed
attack - which made it easy to read the record as overstating things and dismiss
the live half along with the dead one. A half-fixed composed vulnerability is
the most misleading kind of record there is.

## Why the free mint mattered more than "the sale was bypassable"

The bypassed price was the small half. This NFT is the thing AT STAKE in the
commit-reveal round: a missed reveal costs the avatar after the configured
number of misses. **A stake that costs nothing to acquire is not a stake**, and
"something must be at stake, or nobody has to reveal" is the invariant the whole
framework rests on (AGENTS.md). With a free mint, a player who disliked what
they had committed to could simply go quiet, lose the avatar, and mint another
for gas - so commit-reveal bought nothing on any deployment that carried it.

That is also why the fix is asserted by tests about the INVARIANT ("the sale is
the only way to get one") rather than about the price:
`contracts/test/js/Avatars.test.ts`, checked by mutation - removing the access
control, leaving the minter unwired, opening `setMinter`, and removing the
payment check each fail it.

## What paying means, and what changes when it changes

Today an avatar costs the NATIVE token, and the amount and recipient live in
`SaleViaNativePayment`, not in `Avatars`. That split is deliberate: `Avatars`
knows only that exactly one address may mint. Charging in an ERC20 later is a
new sale contract and one `setMinter` call, with no change to `Avatars` and no
migration of existing avatars. `SaleViaERC20Payment.sol` is already in the tree
for it.

## BOMBER-WORLD STILL HAS THIS

It descends from the pre-port code and is ~1067 commits behind, so both halves
are live there. It is dormant and its re-sync is D3 in the template's plan; this
is one more thing that re-sync buys, and it should not be deployed anywhere
meaningful before then.

---

Original note follows.

`onchain/evm` currently carries the pre-rewrite bomber-world contracts, unchanged in the parts that matter. `Avatars.mint` has no access control, and `GameDeposit.onERC721Received` writes `_players[avatarID] = Player({owner, controller})` from a payload nobody has to have consented to. Composed, that is one free call:

```
Avatars.mint(GAME, anyUnusedTokenID, abi.encode(victim, attacker))
```

after which the game records and displays the victim's address as the actor for every move the attacker makes, the victim cannot withdraw the avatar once the attacker has entered it, and there is no function anywhere that changes or clears a controller.

The full analysis, including why "they pay for it" is not a defence and why the victim has no remedy, is in:

**`../bomber-world/docs/plans/identity-without-consent.md`**

It applies here verbatim. Nothing in it is repeated here, because two copies of a finding is two things to keep in step.

## What is different here

That note is written for a codebase being rewritten in place. This one has not started, and is going to be rebuilt as an extension of `template-commit-reveal`, which changes what the note is for: not a bug to fix, but a constraint to build against.

Two things to carry across:

**The per-avatar controller is the right bound and the wrong proof.** Authority over one avatar is a genuinely narrower grant than authority over an account, and it is worth keeping. What has to change is where the pair comes from: proven by the owner sending or the owner signing, never asserted by whoever paid. `template-commit-reveal` brings `GameDelegation` and the `Delegation.requireAccountFor` discipline in `GameCommit._accountFor`, so the proof is inherited; the remaining design question is only whether the per-avatar narrowing sits on top of it, through the documented `_requireAccountForSender` seam, or is dropped for account-wide authority.

**The rule, in the form that is easy to apply:** paying for somebody is always safe, speaking for somebody never is. Value flowing to an account needs nobody's permission, because the worst case is a gift, which is why `GameCommit.addToReserve` lets anyone top up anyone. Authority over an account needs all of it. The inherited bug is exactly that permissiveness carried across from the first to the second.

See also `jolly-roger` on its `work` branch for the other half: `docs/adr/0003-payment-on-the-delegation-carrying-contract.md` decides how a purchase, the signer's gas and the authorisation become one approval without reaching for the shortcut above, and records why the tempting alternatives were refused.
