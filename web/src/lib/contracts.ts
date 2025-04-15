export default {
  "chainId": "31337",
  "genesisHash": "0x7c1e0ca8d5e3b4b6c5c582bbb96df11877010b7b9a8a1983663b0a213797a4a5",
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
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarIsDead",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "CanStillReveal",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "CommitmentHashNotMatching",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "GameNotStarted",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "ImpossibleConfiguration",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InCommitmentPhase",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InRevealPhase",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InvalidEpoch",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NothingToReveal",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "PreviousCommitmentNotRevealed",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "uint64",
              "name": "epoch",
              "type": "uint64"
            }
          ],
          "name": "CommitmentCancelled",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "uint64",
              "name": "epoch",
              "type": "uint64"
            },
            {
              "indexed": false,
              "internalType": "bytes24",
              "name": "commitmentHash",
              "type": "bytes24"
            }
          ],
          "name": "CommitmentMade",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "uint64",
              "name": "epoch",
              "type": "uint64"
            },
            {
              "indexed": true,
              "internalType": "bytes24",
              "name": "commitmentHash",
              "type": "bytes24"
            },
            {
              "components": [
                {
                  "internalType": "uint64[]",
                  "name": "path",
                  "type": "uint64[]"
                },
                {
                  "internalType": "enum UsingGameTypes.ActionType",
                  "name": "actionType",
                  "type": "uint8"
                }
              ],
              "indexed": false,
              "internalType": "struct UsingGameTypes.Action[]",
              "name": "actions",
              "type": "tuple[]"
            }
          ],
          "name": "CommitmentRevealed",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "uint64",
              "name": "epoch",
              "type": "uint64"
            }
          ],
          "name": "CommitmentVoid",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "getAvatar",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint64",
                  "name": "position",
                  "type": "uint64"
                }
              ],
              "internalType": "struct UsingGameTypes.AvatarResolved",
              "name": "",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getCharactersInZone",
          "outputs": [],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "getCommitment",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "bytes24",
                  "name": "hash",
                  "type": "bytes24"
                },
                {
                  "internalType": "uint64",
                  "name": "epoch",
                  "type": "uint64"
                }
              ],
              "internalType": "struct UsingGameTypes.Commitment",
              "name": "commitment",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getConfig",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "startTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "commitPhaseDuration",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "revealPhaseDuration",
                  "type": "uint256"
                },
                {
                  "internalType": "contract ITime",
                  "name": "time",
                  "type": "address"
                }
              ],
              "internalType": "struct UsingGameTypes.Config",
              "name": "config",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256[]",
              "name": "avatarIDs",
              "type": "uint256[]"
            }
          ],
          "name": "cancelCommitments",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "avatarID",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes24",
                  "name": "hash",
                  "type": "bytes24"
                }
              ],
              "internalType": "struct UsingGameTypes.CommitmentSubmission[]",
              "name": "commitments",
              "type": "tuple[]"
            },
            {
              "internalType": "address payable",
              "name": "payee",
              "type": "address"
            }
          ],
          "name": "makeCommitments",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256[]",
              "name": "avatarIDs",
              "type": "uint256[]"
            }
          ],
          "name": "acknowledgeMissedReveals",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "avatarID",
                  "type": "uint256"
                },
                {
                  "components": [
                    {
                      "internalType": "uint64[]",
                      "name": "path",
                      "type": "uint64[]"
                    },
                    {
                      "internalType": "enum UsingGameTypes.ActionType",
                      "name": "actionType",
                      "type": "uint8"
                    }
                  ],
                  "internalType": "struct UsingGameTypes.Action[]",
                  "name": "actions",
                  "type": "tuple[]"
                },
                {
                  "internalType": "bytes32",
                  "name": "secret",
                  "type": "bytes32"
                }
              ],
              "internalType": "struct UsingGameTypes.AvatarMove[]",
              "name": "moves",
              "type": "tuple[]"
            },
            {
              "internalType": "address payable",
              "name": "payee",
              "type": "address"
            }
          ],
          "name": "reveal",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        }
      ],
      "address": "0xdc64a140aa3e981100a9beca4e685f962f0cf6c9",
      "linkedData": {
        "startTime": "0",
        "commitPhaseDuration": "11",
        "revealPhaseDuration": "5",
        "time": "0x0000000000000000000000000000000000000000"
      },
      "startBlock": 4
    },
    "Game_Implementation": {
      "abi": [
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarIsDead",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "CanStillReveal",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "CommitmentHashNotMatching",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "GameNotStarted",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "ImpossibleConfiguration",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InCommitmentPhase",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InRevealPhase",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InvalidEpoch",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NothingToReveal",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "PreviousCommitmentNotRevealed",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "uint64",
              "name": "epoch",
              "type": "uint64"
            }
          ],
          "name": "CommitmentCancelled",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "uint64",
              "name": "epoch",
              "type": "uint64"
            },
            {
              "indexed": false,
              "internalType": "bytes24",
              "name": "commitmentHash",
              "type": "bytes24"
            }
          ],
          "name": "CommitmentMade",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "uint64",
              "name": "epoch",
              "type": "uint64"
            },
            {
              "indexed": true,
              "internalType": "bytes24",
              "name": "commitmentHash",
              "type": "bytes24"
            },
            {
              "components": [
                {
                  "internalType": "uint64[]",
                  "name": "path",
                  "type": "uint64[]"
                },
                {
                  "internalType": "enum UsingGameTypes.ActionType",
                  "name": "actionType",
                  "type": "uint8"
                }
              ],
              "indexed": false,
              "internalType": "struct UsingGameTypes.Action[]",
              "name": "actions",
              "type": "tuple[]"
            }
          ],
          "name": "CommitmentRevealed",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "uint64",
              "name": "epoch",
              "type": "uint64"
            }
          ],
          "name": "CommitmentVoid",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "getAvatar",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint64",
                  "name": "position",
                  "type": "uint64"
                }
              ],
              "internalType": "struct UsingGameTypes.AvatarResolved",
              "name": "",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getCharactersInZone",
          "outputs": [],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "getCommitment",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "bytes24",
                  "name": "hash",
                  "type": "bytes24"
                },
                {
                  "internalType": "uint64",
                  "name": "epoch",
                  "type": "uint64"
                }
              ],
              "internalType": "struct UsingGameTypes.Commitment",
              "name": "commitment",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getConfig",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "startTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "commitPhaseDuration",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "revealPhaseDuration",
                  "type": "uint256"
                },
                {
                  "internalType": "contract ITime",
                  "name": "time",
                  "type": "address"
                }
              ],
              "internalType": "struct UsingGameTypes.Config",
              "name": "config",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256[]",
              "name": "avatarIDs",
              "type": "uint256[]"
            }
          ],
          "name": "cancelCommitments",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "avatarID",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes24",
                  "name": "hash",
                  "type": "bytes24"
                }
              ],
              "internalType": "struct UsingGameTypes.CommitmentSubmission[]",
              "name": "commitments",
              "type": "tuple[]"
            },
            {
              "internalType": "address payable",
              "name": "payee",
              "type": "address"
            }
          ],
          "name": "makeCommitments",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256[]",
              "name": "avatarIDs",
              "type": "uint256[]"
            }
          ],
          "name": "acknowledgeMissedReveals",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "avatarID",
                  "type": "uint256"
                },
                {
                  "components": [
                    {
                      "internalType": "uint64[]",
                      "name": "path",
                      "type": "uint64[]"
                    },
                    {
                      "internalType": "enum UsingGameTypes.ActionType",
                      "name": "actionType",
                      "type": "uint8"
                    }
                  ],
                  "internalType": "struct UsingGameTypes.Action[]",
                  "name": "actions",
                  "type": "tuple[]"
                },
                {
                  "internalType": "bytes32",
                  "name": "secret",
                  "type": "bytes32"
                }
              ],
              "internalType": "struct UsingGameTypes.AvatarMove[]",
              "name": "moves",
              "type": "tuple[]"
            },
            {
              "internalType": "address payable",
              "name": "payee",
              "type": "address"
            }
          ],
          "name": "reveal",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        }
      ],
      "address": "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9",
      "startBlock": 4
    },
    "Game_Implementation_Router": {
      "abi": [
        {
          "inputs": [
            {
              "components": [
                {
                  "internalType": "address[]",
                  "name": "implementations",
                  "type": "address[]"
                },
                {
                  "internalType": "bytes5[]",
                  "name": "sigMap",
                  "type": "bytes5[]"
                },
                {
                  "internalType": "address",
                  "name": "fallbackImplementation",
                  "type": "address"
                }
              ],
              "internalType": "struct Router10X60.Routes",
              "name": "routes",
              "type": "tuple"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "stateMutability": "payable",
          "type": "fallback"
        }
      ],
      "address": "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9",
      "startBlock": 4
    },
    "Game_Implementation_Router_Commit_Route": {
      "abi": [
        {
          "inputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "startTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "commitPhaseDuration",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "revealPhaseDuration",
                  "type": "uint256"
                },
                {
                  "internalType": "contract ITime",
                  "name": "time",
                  "type": "address"
                }
              ],
              "internalType": "struct UsingGameTypes.Config",
              "name": "config",
              "type": "tuple"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarIsDead",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "CanStillReveal",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "CommitmentHashNotMatching",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "GameNotStarted",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "ImpossibleConfiguration",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InCommitmentPhase",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InRevealPhase",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InvalidEpoch",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NothingToReveal",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "PreviousCommitmentNotRevealed",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "uint64",
              "name": "epoch",
              "type": "uint64"
            }
          ],
          "name": "CommitmentCancelled",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "uint64",
              "name": "epoch",
              "type": "uint64"
            },
            {
              "indexed": false,
              "internalType": "bytes24",
              "name": "commitmentHash",
              "type": "bytes24"
            }
          ],
          "name": "CommitmentMade",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "uint64",
              "name": "epoch",
              "type": "uint64"
            },
            {
              "indexed": true,
              "internalType": "bytes24",
              "name": "commitmentHash",
              "type": "bytes24"
            },
            {
              "components": [
                {
                  "internalType": "uint64[]",
                  "name": "path",
                  "type": "uint64[]"
                },
                {
                  "internalType": "enum UsingGameTypes.ActionType",
                  "name": "actionType",
                  "type": "uint8"
                }
              ],
              "indexed": false,
              "internalType": "struct UsingGameTypes.Action[]",
              "name": "actions",
              "type": "tuple[]"
            }
          ],
          "name": "CommitmentRevealed",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "uint64",
              "name": "epoch",
              "type": "uint64"
            }
          ],
          "name": "CommitmentVoid",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "uint256[]",
              "name": "avatarIDs",
              "type": "uint256[]"
            }
          ],
          "name": "cancelCommitments",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "avatarID",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes24",
                  "name": "hash",
                  "type": "bytes24"
                }
              ],
              "internalType": "struct UsingGameTypes.CommitmentSubmission[]",
              "name": "commitments",
              "type": "tuple[]"
            },
            {
              "internalType": "address payable",
              "name": "payee",
              "type": "address"
            }
          ],
          "name": "makeCommitments",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        }
      ],
      "address": "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
      "startBlock": 2
    },
    "Game_Implementation_Router_Getters_Route": {
      "abi": [
        {
          "inputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "startTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "commitPhaseDuration",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "revealPhaseDuration",
                  "type": "uint256"
                },
                {
                  "internalType": "contract ITime",
                  "name": "time",
                  "type": "address"
                }
              ],
              "internalType": "struct UsingGameTypes.Config",
              "name": "config",
              "type": "tuple"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarIsDead",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "CanStillReveal",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "CommitmentHashNotMatching",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "GameNotStarted",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "ImpossibleConfiguration",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InCommitmentPhase",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InRevealPhase",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InvalidEpoch",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NothingToReveal",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "PreviousCommitmentNotRevealed",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "uint64",
              "name": "epoch",
              "type": "uint64"
            }
          ],
          "name": "CommitmentCancelled",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "uint64",
              "name": "epoch",
              "type": "uint64"
            },
            {
              "indexed": false,
              "internalType": "bytes24",
              "name": "commitmentHash",
              "type": "bytes24"
            }
          ],
          "name": "CommitmentMade",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "uint64",
              "name": "epoch",
              "type": "uint64"
            },
            {
              "indexed": true,
              "internalType": "bytes24",
              "name": "commitmentHash",
              "type": "bytes24"
            },
            {
              "components": [
                {
                  "internalType": "uint64[]",
                  "name": "path",
                  "type": "uint64[]"
                },
                {
                  "internalType": "enum UsingGameTypes.ActionType",
                  "name": "actionType",
                  "type": "uint8"
                }
              ],
              "indexed": false,
              "internalType": "struct UsingGameTypes.Action[]",
              "name": "actions",
              "type": "tuple[]"
            }
          ],
          "name": "CommitmentRevealed",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "uint64",
              "name": "epoch",
              "type": "uint64"
            }
          ],
          "name": "CommitmentVoid",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "getAvatar",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint64",
                  "name": "position",
                  "type": "uint64"
                }
              ],
              "internalType": "struct UsingGameTypes.AvatarResolved",
              "name": "",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getCharactersInZone",
          "outputs": [],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "getCommitment",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "bytes24",
                  "name": "hash",
                  "type": "bytes24"
                },
                {
                  "internalType": "uint64",
                  "name": "epoch",
                  "type": "uint64"
                }
              ],
              "internalType": "struct UsingGameTypes.Commitment",
              "name": "commitment",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getConfig",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "startTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "commitPhaseDuration",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "revealPhaseDuration",
                  "type": "uint256"
                },
                {
                  "internalType": "contract ITime",
                  "name": "time",
                  "type": "address"
                }
              ],
              "internalType": "struct UsingGameTypes.Config",
              "name": "config",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ],
      "address": "0x5fbdb2315678afecb367f032d93f642f64180aa3",
      "startBlock": 1
    },
    "Game_Implementation_Router_Reveal_Route": {
      "abi": [
        {
          "inputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "startTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "commitPhaseDuration",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "revealPhaseDuration",
                  "type": "uint256"
                },
                {
                  "internalType": "contract ITime",
                  "name": "time",
                  "type": "address"
                }
              ],
              "internalType": "struct UsingGameTypes.Config",
              "name": "config",
              "type": "tuple"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarIsDead",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "CanStillReveal",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "CommitmentHashNotMatching",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "GameNotStarted",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "ImpossibleConfiguration",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InCommitmentPhase",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InRevealPhase",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InvalidEpoch",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NothingToReveal",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "PreviousCommitmentNotRevealed",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "uint64",
              "name": "epoch",
              "type": "uint64"
            }
          ],
          "name": "CommitmentCancelled",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "uint64",
              "name": "epoch",
              "type": "uint64"
            },
            {
              "indexed": false,
              "internalType": "bytes24",
              "name": "commitmentHash",
              "type": "bytes24"
            }
          ],
          "name": "CommitmentMade",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "uint64",
              "name": "epoch",
              "type": "uint64"
            },
            {
              "indexed": true,
              "internalType": "bytes24",
              "name": "commitmentHash",
              "type": "bytes24"
            },
            {
              "components": [
                {
                  "internalType": "uint64[]",
                  "name": "path",
                  "type": "uint64[]"
                },
                {
                  "internalType": "enum UsingGameTypes.ActionType",
                  "name": "actionType",
                  "type": "uint8"
                }
              ],
              "indexed": false,
              "internalType": "struct UsingGameTypes.Action[]",
              "name": "actions",
              "type": "tuple[]"
            }
          ],
          "name": "CommitmentRevealed",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "uint64",
              "name": "epoch",
              "type": "uint64"
            }
          ],
          "name": "CommitmentVoid",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "uint256[]",
              "name": "avatarIDs",
              "type": "uint256[]"
            }
          ],
          "name": "acknowledgeMissedReveals",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "avatarID",
                  "type": "uint256"
                },
                {
                  "components": [
                    {
                      "internalType": "uint64[]",
                      "name": "path",
                      "type": "uint64[]"
                    },
                    {
                      "internalType": "enum UsingGameTypes.ActionType",
                      "name": "actionType",
                      "type": "uint8"
                    }
                  ],
                  "internalType": "struct UsingGameTypes.Action[]",
                  "name": "actions",
                  "type": "tuple[]"
                },
                {
                  "internalType": "bytes32",
                  "name": "secret",
                  "type": "bytes32"
                }
              ],
              "internalType": "struct UsingGameTypes.AvatarMove[]",
              "name": "moves",
              "type": "tuple[]"
            },
            {
              "internalType": "address payable",
              "name": "payee",
              "type": "address"
            }
          ],
          "name": "reveal",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        }
      ],
      "address": "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0",
      "startBlock": 3
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
      "address": "0xdc64a140aa3e981100a9beca4e685f962f0cf6c9",
      "startBlock": 5
    }
  },
  "name": "localhost"
} as const;