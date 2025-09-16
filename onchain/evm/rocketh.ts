// ------------------------------------------------------------------------------------------------
// Typed Config
// ------------------------------------------------------------------------------------------------
import type {UserConfig} from 'rocketh';

export const config = {
	networks: {
		hardhat: {
			tags: ['local', 'memory', 'testnet'],
		},
		localhost: {
			tags: ['local', 'testnet'],
		},
		sepolia: {
			tags: ['live', 'testner'],
		},
		default: {
			tags: ['live'],
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
			megatestnet: {
				price: parseEther('0.00000001'),
			},
			somniatestnet: {
				price: parseEther('0.00000001'),
			},
			celosepolia: {
				price: parseEther('0.00000001'),
			},
			default: {
				price: parseEther('0.01'),
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
const extensions = {...deployExtension, ...readExecuteExtension, ...deployProxyExtension, ...deployRouterExtension};
// ------------------------------------------------------------------------------------------------
// we re-export the artifacts, so they are easily available from the alias
import * as artifacts from './generated/artifacts/index.js';
export {artifacts};
// ------------------------------------------------------------------------------------------------
// we create the rocketh functions we need by passing the extensions to the setup function
import {setup} from 'rocketh';
const {deployScript, loadAndExecuteDeployments} = setup<typeof extensions, typeof config.accounts, typeof config.data>(
	extensions,
);
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
