// ----------------------------------------------------------------------------
// Typed Config
// ----------------------------------------------------------------------------
import type {UserConfig} from 'rocketh/types';

import {parseEther} from 'viem';

// we define our config and export it as "config"
export const config = {
	chains: {
		31337: {
			properties: {
				expectedWorstGasPrice: parseEther('1', 'gwei'), // TODO use same value from hardhat config
				supportsSendRawTransactionSync: false,
			},
			tags: ['local', 'memory', 'testnet'],
		},
		6342: {
			properties: {
				// mega-eth testnet
				expectedWorstGasPrice: parseEther('0.003', 'gwei'),
				supportsSendRawTransactionSync: false,
			},
		},
		50312: {
			properties: {
				// somnia testnet
				expectedWorstGasPrice: parseEther('8', 'gwei'),
				supportsSendRawTransactionSync: false,
			},
		},
		11142220: {
			properties: {
				// celo sepolia testnet
				expectedWorstGasPrice: parseEther('25', 'gwei'),
				supportsSendRawTransactionSync: false,
			},
		},
		['rise-testnet']: {
			properties: {
				supportsSendRawTransactionSync: true,
				expectedWorstGasPrice: parseEther('0.00001', 'gwei'),
			},
		},
		['cronos-testnet']: {
			deterministicDeployment: {
				deployer: '0x40f46c02D01bf02c703F7ABD0d7923F3A956515C',
				factory: '0x2B8f8bFdE1fF66616E7279F6f7069AF8E00f76A8',
				funding: '50000000000000000',
				signedTx:
					'0xf9043e8085746a528800830186a08080b903e96080604052348015600f57600080fd5b506103ca8061001f6000396000f3fe6080604052600436106100295760003560e01c8063360d0fad1461002e5780639881d19514610077575b600080fd5b34801561003a57600080fd5b5061004e610049366004610228565b61008a565b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200160405180910390f35b61004e61008536600461029c565b6100ee565b6040517fffffffffffffffffffffffffffffffffffffffff000000000000000000000000606084901b166020820152603481018290526000906054016040516020818303038152906040528051906020012091506100e78261014c565b9392505050565b6040517fffffffffffffffffffffffffffffffffffffffff0000000000000000000000003360601b166020820152603481018290526000906054016040516020818303038152906040528051906020012091506100e734848461015e565b600061015882306101ce565b92915050565b60006f67363d3d37363d34f03d5260086018f3600052816010806000f58061018e5763301164256000526004601cfd5b8060145261d69460005260016034536017601e20915060008085516020870188855af1823b026101c65763301164256000526004601cfd5b509392505050565b60006040518260005260ff600b53836020527f21c35dbe1b344a2488cf3321d6ce542f8e9f305544ff09e4993a62319a497c1f6040526055600b20601452806040525061d694600052600160345350506017601e20919050565b6000806040838503121561023b57600080fd5b823573ffffffffffffffffffffffffffffffffffffffff8116811461025f57600080fd5b946020939093013593505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080604083850312156102af57600080fd5b823567ffffffffffffffff8111156102c657600080fd5b8301601f810185136102d757600080fd5b803567ffffffffffffffff8111156102f1576102f161026d565b6040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0603f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f8501160116810181811067ffffffffffffffff8211171561035d5761035d61026d565b60405281815282820160200187101561037557600080fd5b816020840160208301376000602092820183015296940135945050505056fea264697066735822122059dcc5dc6453397d13ff28021e28472a80a45bbd97f3135f69bd2650773aeb0164736f6c634300081a00338202c7a01820182018201820182018201820182018201820182018201820182018201820a01820182018201820182018201820182018201820182018201820182018201820',
			},
		},
		900: {
			properties: {
				supportsSendRawTransactionSync: false,
				expectedWorstGasPrice: parseEther('10', 'gwei'),
			},
		},
	},
	defaultChainProperties: {
		// if not specified, fallback on:
		expectedWorstGasPrice: parseEther('0.000001', 'gwei'),
		supportsSendRawTransactionSync: false,
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
			'celos-epolia': {
				commitPhaseDuration: 50n,
				revealPhaseDuration: 10n,
				numMoves: 10n,
			},
			localhost: {
				commitPhaseDuration: 40n,
				revealPhaseDuration: 3n,
				numMoves: 10n,
			},
			default: {
				commitPhaseDuration: 40n,
				revealPhaseDuration: 4n,
				numMoves: 10n,
			},
			'rise-testnet': {
				commitPhaseDuration: 32n,
				revealPhaseDuration: 5n,
				numMoves: 10n,
			},
		},
	},
} as const satisfies UserConfig;

// then we import each extensions we are interested in using in our deploy script or elsewhere

// this one provide a deploy function
import * as deployExtension from '@rocketh/deploy';
// this one provide read,execute functions
import * as readExecuteExtension from '@rocketh/read-execute';
// this one provide a deployViaProxy function that let you declaratively
//  deploy proxy based contracts
import * as deployProxyExtension from '@rocketh/proxy';

//  deploy proxy based contracts
import * as deployRouterExtensions from '@rocketh/router';

// and export them as a unified object
const extensions = {
	...deployExtension,
	...readExecuteExtension,
	...deployProxyExtension,
	...deployRouterExtensions,
};
export {extensions};

// then we also export the types that our config ehibit so other can use it

type Extensions = typeof extensions;
type Accounts = typeof config.accounts;
type Data = typeof config.data;

export type {Extensions, Accounts, Data};
