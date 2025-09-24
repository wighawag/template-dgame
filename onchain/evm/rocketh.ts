// ------------------------------------------------------------------------------------------------
// Typed Config
// ------------------------------------------------------------------------------------------------
import type {UserConfig} from 'rocketh';

export const config = {
	chains: {
		31337: {
			properties: {
				blockTime: 1, // TODO use same value from hardhat config
				expectedWorstGasPrice: parseEther('1', 'gwei'), // TODO use same value from hardhat config
			},
			tags: ['local', 'memory', 'testnet'],
		},
		6342: {
			properties: {
				// mega-eth testnet
				blockTime: 1,
				expectedWorstGasPrice: parseEther('0.003', 'gwei'),
			},
		},
		50312: {
			properties: {
				// somnia testnet
				blockTime: 1,
				expectedWorstGasPrice: parseEther('10', 'gwei'),
			},
		},
		11142220: {
			properties: {
				// celo sepolia testnet
				blockTime: 1,
				expectedWorstGasPrice: parseEther('25', 'gwei'),
			},
		},
		216: {
			properties: {
				// happychain testnet
				blockTime: 2,
				expectedWorstGasPrice: parseEther('0.000001', 'gwei'),
			},
		},
		['rise-testnet']: {
			properties: {
				blockTime: 1,
				expectedWorstGasPrice: parseEther('0.000001', 'gwei'),
			},
		},
	},
	accounts: {
		deployer: {
			default: 0,
		},
		admin: {
			default: 0, // TODO
		},
	},
	data: {
		sale: {
			default: {
				price: parseEther('0.00000001'),
			},
		},
		Game: {
			celosepolia: {
				commitPhaseDuration: 35n,
				revealPhaseDuration: 10n,
			},
			happychaintestnet: {
				commitPhaseDuration: 40n,
				revealPhaseDuration: 15n,
			},
			default: {
				commitPhaseDuration: 30n,
				revealPhaseDuration: 5n,
			},
		},
	},
} as const satisfies UserConfig;

// ------------------------------------------------------------------------------------------------
// Imports and Re-exports
// ------------------------------------------------------------------------------------------------
// We regroup all what is needed for the deploy scripts
// so that they just need to import this file
// We also added an alias (#rocketh) in package.json's imports
// so they just need to do `import {deployScript, artifacts} from '#rocketh';`
// and this work anywhere in the file hierarchy
// ------------------------------------------------------------------------------------------------
// we add here the module we need, so that they are available in the deploy scripts
import * as deployExtension from '@rocketh/deploy'; // this one provide a deploy function
import * as readExecuteExtension from '@rocketh/read-execute'; // this one provide read,execute functions
import * as deployProxyExtension from '@rocketh/proxy'; // this one provide a deployViaProxy function that let you declaratively deploy proxy based contracts
import * as deployRouterExtension from '@rocketh/router'; // this one provide a deployViaProxy function that let you declaratively deploy proxy based contracts
const extensions = {
	...deployExtension,
	...readExecuteExtension,
	...deployProxyExtension,
	...deployRouterExtension,
};
// ------------------------------------------------------------------------------------------------
// we re-export the artifacts, so they are easily available from the alias
import * as artifacts from './generated/artifacts/index.js';
export {artifacts};
// ------------------------------------------------------------------------------------------------
// we create the rocketh functions we need by passing the extensions to the setup function
import {setup} from 'rocketh';
const {deployScript, loadAndExecuteDeployments} = setup<
	typeof extensions,
	typeof config.accounts,
	typeof config.data
>(extensions);
// ------------------------------------------------------------------------------------------------
// we do the same for hardhat-deploy
import {setupHardhatDeploy} from 'hardhat-deploy/helpers';
import {parseEther} from 'viem';
const {loadEnvironmentFromHardhat} = setupHardhatDeploy(extensions);
// ------------------------------------------------------------------------------------------------
// finally we export them
// - loadAndExecuteDeployments can be used in tests to ensure deployed contracts are available there
// - deployScript is the function used to create deploy script, see deploy/ folder
// - loadEnvironmentFromHardhat can be used in scripts and reuse hardhat network handling without deploying the contracts
export {loadAndExecuteDeployments, deployScript, loadEnvironmentFromHardhat};
