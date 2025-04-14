export default {
  "chainId": "31337",
  "genesisHash": "0x56ef20864f06906db2c8dcdad4439110a545f3a1e33f55da95a188196fc61ca8",
  "chainInfo": {
    "id": 31337,
    "name": "Hardhat",
    "nativeCurrency": {
      "decimals": 18,
      "name": "Ether",
      "symbol": "ETH"
    },
    "rpcUrls": {
      "default": {
        "http": [
          "http://127.0.0.1:8545"
        ]
      }
    },
    "chainType": "default"
  },
  "contracts": {
    "Game": {
      "abi": [
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [],
          "name": "commit",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getCharactersInZone",
          "outputs": [],
          "stateMutability": "view",
          "type": "function"
        }
      ],
      "address": "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0",
      "startBlock": 9
    },
    "Game_Implementation": {
      "abi": [
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [],
          "name": "commit",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getCharactersInZone",
          "outputs": [],
          "stateMutability": "view",
          "type": "function"
        }
      ],
      "address": "0x5ee11aaf8387c503c2db8773bee9706376ebc0a7",
      "startBlock": 9
    },
    "Game_Proxy": {
      "abi": [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "implementationAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "ownerAddress",
              "type": "address"
            },
            {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            }
          ],
          "stateMutability": "payable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "previousOwner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "OwnershipTransferred",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "previousImplementation",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "newImplementation",
              "type": "address"
            }
          ],
          "name": "ProxyImplementationUpdated",
          "type": "event"
        },
        {
          "stateMutability": "payable",
          "type": "fallback"
        },
        {
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes4",
              "name": "id",
              "type": "bytes4"
            }
          ],
          "name": "supportsInterface",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "transferOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "newImplementation",
              "type": "address"
            }
          ],
          "name": "upgradeTo",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "newImplementation",
              "type": "address"
            },
            {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            }
          ],
          "name": "upgradeToAndCall",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "stateMutability": "payable",
          "type": "receive"
        }
      ],
      "address": "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0",
      "startBlock": 4
    }
  },
  "name": "localhost"
} as const;