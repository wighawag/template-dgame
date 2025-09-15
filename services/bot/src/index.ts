import { pathToFileURL } from "node:url";
import contractsInfo from "./contracts.js";
import {
  createPublicClient,
  createWalletClient,
  encodeAbiParameters,
  formatEther,
  http,
  parseEther,
  zeroAddress,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

const { Game, AvatarsSale } = contractsInfo.contracts;
const STIPPEND = parseEther("0.1"); // TODO

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2));
}

// TODO export to common-lib or dgame-contracts ?
export function generateRandom96BitBigInt() {
  // Create a 12-byte (96-bit) buffer
  const buffer = new Uint8Array(12);

  // Fill with cryptographically secure random values
  crypto.getRandomValues(buffer);

  // Convert to hex string (2 characters per byte)
  let hexString = "";
  buffer.forEach((byte) => {
    hexString += byte.toString(16).padStart(2, "0");
  });

  // Parse hex string to BigInt
  return BigInt("0x" + hexString);
}

function main(args: string[]) {
  const nodeURL = process.env.NODE_URL as string;
  const signerPrivateKey = process.env.PRIVATE_KEY as `0x${string}`;
  const ownerAddress = process.env.OWNER_ADDRESS as `0x${string}`;

  if (!nodeURL || !signerPrivateKey || !ownerAddress) {
    if (!nodeURL) {
      console.error(`NODE_URL not defined`);
    }
    if (!signerPrivateKey) {
      console.error(`PRIVATE_KEY not defined`);
    }
    if (!nodeURL) {
      console.error(`OWNER_ADDRESS not defined`);
    }
    process.exit(1);
  }

  const publicClient = createPublicClient({
    transport: http(nodeURL),
    chain: contractsInfo.chainInfo,
  });
  const signerAccount = privateKeyToAccount(signerPrivateKey);
  const walletClient = createWalletClient({
    account: signerAccount,
    transport: http(nodeURL),
    chain: contractsInfo.chainInfo,
  });

  async function getAvatars() {
    const result = await publicClient.readContract({
      ...Game,
      functionName: "avatarsPerOwner",
      args: [ownerAddress, 0n, 100n], // TODO pagination
    });

    return result[0]; // TODO pagination
  }

  function getBalance() {
    return publicClient.getBalance({ address: signerAccount.address });
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

  function avatarLoop(avatarID: bigint) {
    console.log(`handling ${avatarID}`);
  }

  async function start() {
    const avatars = await getAvatars();
    if (avatars.length == 0) {
      const amountRequiredForPurchase =
        BigInt(AvatarsSale.linkedData.paymentAmount) + STIPPEND;
      const balance = await getBalance();
      if (balance > amountRequiredForPurchase) {
        const subID = generateRandom96BitBigInt();
        const avatarID = (BigInt(ownerAddress) << 96n) + subID;
        const txHash = await walletClient.writeContract({
          ...AvatarsSale,
          functionName: "purchase",
          args: [
            Game.address,
            subID,
            encodeAbiParameters(
              [{ type: "address" }, { type: "address" }],
              [ownerAddress, signerAccount.address]
            ),
            zeroAddress,
            0n,
            zeroAddress,
          ],
          value: BigInt(AvatarsSale.linkedData.paymentAmount),
        });
        await publicClient.waitForTransactionReceipt({
          hash: txHash,
        });
        avatarLoop(avatarID);
      } else {
        console.log(
          `not enough balance to purchase an avatar, send ${formatEther(
            amountRequiredForPurchase
          )} ETH to  ${signerAccount.address}`
        );
        setTimeout(start, 1000);
      }
    } else {
      const avatarID = avatars[0].avatarID;
      avatarLoop(avatarID);
    }
  }

  start();
}
