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
			default: 1,
		},
	},
	data: {},
} as const satisfies UserConfig;

// ------------------------------------------------------------------------------------------------
// Imports and Re-exports
// ------------------------------------------------------------------------------------------------
// We regroup all what is needed for the deploy scripts
// so that they just need to import this file
// We also added an alias (@rocketh) in tsconfig.json
// so they just need to do `import {deployScript, artifacts} from '@rocketh';`
// and this work anywhere in the file hierarchy
// ------------------------------------------------------------------------------------------------
// we add here the module we need, so that they are available in the deploy scripts
import * as deployExtensions from '@rocketh/deploy'; // this one provide a deploy function
import * as readExecuteExtensions from '@rocketh/read-execute'; // this one provide read,execute functions
import * as deployProxyExtensions from '@rocketh/proxy'; // this one provide a deployViaProxy function that let you declaratively deploy proxy based contracts
import * as deployRouterExtensions from '@rocketh/router'; // this one provide a deployViaProxy function that let you declaratively deploy proxy based contracts
const extensions = {...deployExtensions, ...readExecuteExtensions, ...deployProxyExtensions, ...deployRouterExtensions};
// ------------------------------------------------------------------------------------------------
// we re-export the artifacts, so they are easily available from the alias
import artifacts from './generated/artifacts.js';
export {artifacts};
// ------------------------------------------------------------------------------------------------

import {setup} from 'rocketh';
const {deployScript, loadAndExecuteDeployments} = setup<typeof extensions, typeof config.accounts, typeof config.data>(
	extensions,
);

export {loadAndExecuteDeployments, deployScript};
