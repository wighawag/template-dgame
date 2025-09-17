import { getChainParameters } from './connection/chains';
import deployments from './deployments';

function getBigIntPowerOf10(n: bigint) {
	if (n === 0n) return 1n; // Edge case: log10(0) is undefined, default to 10^0=1
	const numStr = n.toString();
	const numDigits = numStr.length;

	// Check if n is exactly a power of 10 (like 10, 100, 1000...)
	if (
		numStr[0] === '1' &&
		numStr
			.slice(1)
			.split('')
			.every((ch) => ch === '0')
	) {
		return 10n ** BigInt(numDigits - 1);
	} else {
		return 10n ** BigInt(numDigits);
	}
}

export const maxActionCost =
	getChainParameters(deployments.chainId).expectedWorstGasPrice * 1_000_000n; // 1_000_000 per action is our limit
export const stippend = maxActionCost * 100n; // 100 turn, we need to show
export const price = BigInt(deployments.contracts.AvatarsSale.linkedData.paymentAmount);
export const creditsDivider = getBigIntPowerOf10(maxActionCost);
