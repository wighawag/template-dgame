import { pathToFileURL } from "node:url";
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2));
}
import contractsInfo from "./contracts.js";

function getAvatars() {
  const Game = contractsInfo.contracts.Game;
}

function plan() {}

function act() {
  plan();
  commit();
}

function commit() {
  waitForRevealPhase();
}

function reveal() {
  waitForNextEpoch();
}

function waitForRevealPhase() {}

function waitForNextEpoch() {}

function avatarLoop(avatarID: bigint, signerPrivateKey: `0x${string}`) {}

function main(args: string[]) {}
