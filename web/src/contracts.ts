export default {
  "chainId": "31337",
  "genesisHash": "0xb14163fcc6346d426b34736a15f74b9ad5b214ae41d66b73911481ea1b5cd542",
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
    "Avatars": {
      "abi": [
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "index",
              "type": "uint256"
            }
          ],
          "name": "ERC721OutOfBoundsIndex",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "addr",
              "type": "address"
            }
          ],
          "name": "InvalidAddress",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            }
          ],
          "name": "NonExistentToken",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NonceOverflow",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NotAuthorized",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "provided",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "currentOwner",
              "type": "address"
            }
          ],
          "name": "NotOwner",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            }
          ],
          "name": "TokenAlreadyExists",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            }
          ],
          "name": "TokenCannotBeReminted",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "TransferRejected",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "approved",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            }
          ],
          "name": "Approval",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "operator",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "approved",
              "type": "bool"
            }
          ],
          "name": "ApprovalForAll",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            }
          ],
          "name": "Transfer",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "operator",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            }
          ],
          "name": "approve",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            }
          ],
          "name": "balanceOf",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "balance",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            }
          ],
          "name": "getApproved",
          "outputs": [
            {
              "internalType": "address",
              "name": "operator",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "operator",
              "type": "address"
            }
          ],
          "name": "isApprovedForAll",
          "outputs": [
            {
              "internalType": "bool",
              "name": "isOperator",
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
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            }
          ],
          "name": "mint",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256[]",
              "name": "tokenIDs",
              "type": "uint256[]"
            }
          ],
          "name": "ownerAndLastTransferBlockNumberList",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "lastTransferBlockNumber",
                  "type": "uint256"
                }
              ],
              "internalType": "struct IERC721WithBlocknumber.OwnerData[]",
              "name": "ownersData",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            }
          ],
          "name": "ownerAndLastTransferBlockNumberOf",
          "outputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "blockNumber",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            }
          ],
          "name": "ownerOf",
          "outputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            }
          ],
          "name": "safeTransferFrom",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            }
          ],
          "name": "safeTransferFrom",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "operator",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "approved",
              "type": "bool"
            }
          ],
          "name": "setApprovalForAll",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes4",
              "name": "interfaceId",
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
              "internalType": "uint256",
              "name": "index",
              "type": "uint256"
            }
          ],
          "name": "tokenByIndex",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "index",
              "type": "uint256"
            }
          ],
          "name": "tokenOfOwnerByIndex",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "index",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "limit",
              "type": "uint256"
            }
          ],
          "name": "tokensOfOwner",
          "outputs": [
            {
              "internalType": "uint256[]",
              "name": "tokenIDs",
              "type": "uint256[]"
            },
            {
              "internalType": "bool",
              "name": "more",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalSupply",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            }
          ],
          "name": "transferFrom",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ],
      "address": "0x0e801d84fa97b50751dbf25036d067dcf18858bf",
      "startBlock": 26647
    },
    "AvatarsSale": {
      "abi": [
        {
          "inputs": [
            {
              "internalType": "contract Avatars",
              "name": "items",
              "type": "address"
            },
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "paymentAmount",
                  "type": "uint256"
                },
                {
                  "internalType": "address payable",
                  "name": "recipient",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "freeMapAdmin",
                  "type": "address"
                }
              ],
              "internalType": "struct SaleViaNativePayment.Config",
              "name": "config",
              "type": "tuple"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [],
          "name": "ExpectNativeToken",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "recipient",
              "type": "address"
            }
          ],
          "name": "FailedToTransferNativeToken",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "expected",
              "type": "address"
            }
          ],
          "name": "NotFreeMapAdmin",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "contract IERC20",
              "name": "token",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "TransferFailed",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "expected",
              "type": "uint256"
            }
          ],
          "name": "WrongPaymentAmount",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "referrer",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            }
          ],
          "name": "Mint",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "FREE_MAP_ADMIN",
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
          "inputs": [],
          "name": "ITEMS",
          "outputs": [
            {
              "internalType": "contract IERC721",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "PAYMENT_AMOUNT",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "RECIPIENT",
          "outputs": [
            {
              "internalType": "address payable",
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
              "internalType": "address[]",
              "name": "addresses",
              "type": "address[]"
            }
          ],
          "name": "addToFreeMap",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "freemap",
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
              "internalType": "address payable",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint96",
              "name": "subID",
              "type": "uint96"
            },
            {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            },
            {
              "internalType": "address payable",
              "name": "extraNativeTokenRecipient",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "extraNativeTokenAmount",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "referrer",
              "type": "address"
            }
          ],
          "name": "purchase",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address[]",
              "name": "addresses",
              "type": "address[]"
            }
          ],
          "name": "removeFromFreeMap",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ],
      "address": "0x610178da211fef7d417bc0e6fed39f05609ad788",
      "linkedData": {
        "paymentAmount": "10000000000000000",
        "recipient": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
        "freeMapAdmin": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"
      },
      "startBlock": 26654
    },
    "AvatarsSale_Implementation": {
      "abi": [
        {
          "inputs": [
            {
              "internalType": "contract Avatars",
              "name": "items",
              "type": "address"
            },
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "paymentAmount",
                  "type": "uint256"
                },
                {
                  "internalType": "address payable",
                  "name": "recipient",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "freeMapAdmin",
                  "type": "address"
                }
              ],
              "internalType": "struct SaleViaNativePayment.Config",
              "name": "config",
              "type": "tuple"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [],
          "name": "ExpectNativeToken",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "recipient",
              "type": "address"
            }
          ],
          "name": "FailedToTransferNativeToken",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "expected",
              "type": "address"
            }
          ],
          "name": "NotFreeMapAdmin",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "contract IERC20",
              "name": "token",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "TransferFailed",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "expected",
              "type": "uint256"
            }
          ],
          "name": "WrongPaymentAmount",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "referrer",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            }
          ],
          "name": "Mint",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "FREE_MAP_ADMIN",
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
          "inputs": [],
          "name": "ITEMS",
          "outputs": [
            {
              "internalType": "contract IERC721",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "PAYMENT_AMOUNT",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "RECIPIENT",
          "outputs": [
            {
              "internalType": "address payable",
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
              "internalType": "address[]",
              "name": "addresses",
              "type": "address[]"
            }
          ],
          "name": "addToFreeMap",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "freemap",
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
              "internalType": "address payable",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint96",
              "name": "subID",
              "type": "uint96"
            },
            {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            },
            {
              "internalType": "address payable",
              "name": "extraNativeTokenRecipient",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "extraNativeTokenAmount",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "referrer",
              "type": "address"
            }
          ],
          "name": "purchase",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address[]",
              "name": "addresses",
              "type": "address[]"
            }
          ],
          "name": "removeFromFreeMap",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ],
      "address": "0xd15483072323646a1E3568d456D60D1a0857DE41",
      "startBlock": 26654
    },
    "AvatarsSale_Proxy": {
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
      "address": "0x610178da211fef7d417bc0e6fed39f05609ad788",
      "startBlock": 19
    },
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
          "name": "AvatarAlreadyInGame",
          "type": "error"
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
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarNotAvailable",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarNotInGame",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarNotReady",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarStillInGame",
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
          "name": "InvalidData",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InvalidEpoch",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NoCommitmentToCancel",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "NotAuthorizedController",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "NotAuthorizedOwner",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NothingToReveal",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "OnlyAvatarsAreAccepted",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "PreviousCommitmentNotRevealed",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint64",
              "name": "position",
              "type": "uint64"
            }
          ],
          "name": "UnableToExitFromThisPosition",
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
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "controller",
              "type": "address"
            }
          ],
          "name": "AvatarDeposited",
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
            }
          ],
          "name": "AvatarWithdrawn",
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
              "internalType": "uint64",
              "name": "zone",
              "type": "uint64"
            },
            {
              "indexed": false,
              "internalType": "bytes24",
              "name": "commitmentHash",
              "type": "bytes24"
            },
            {
              "components": [
                {
                  "internalType": "enum UsingGameTypes.ActionType",
                  "name": "actionType",
                  "type": "uint8"
                },
                {
                  "internalType": "uint128",
                  "name": "data",
                  "type": "uint128"
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
              "internalType": "uint64",
              "name": "zone",
              "type": "uint64"
            },
            {
              "indexed": false,
              "internalType": "uint64",
              "name": "newPosition",
              "type": "uint64"
            }
          ],
          "name": "EnteredTheGame",
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
              "internalType": "uint64",
              "name": "zoneWhenLeaving",
              "type": "uint64"
            },
            {
              "indexed": false,
              "internalType": "uint64",
              "name": "positionWhenLeaving",
              "type": "uint64"
            }
          ],
          "name": "LeftTheGame",
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
                  "internalType": "uint256",
                  "name": "avatarID",
                  "type": "uint256"
                },
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
          "inputs": [
            {
              "internalType": "uint64[]",
              "name": "zones",
              "type": "uint64[]"
            },
            {
              "internalType": "uint64",
              "name": "fromIndex",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "limit",
              "type": "uint64"
            }
          ],
          "name": "getAvatarsInMultipleZones",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "avatarID",
                  "type": "uint256"
                },
                {
                  "internalType": "uint64",
                  "name": "position",
                  "type": "uint64"
                }
              ],
              "internalType": "struct UsingGameTypes.AvatarResolved[]",
              "name": "avatars",
              "type": "tuple[]"
            },
            {
              "internalType": "bool",
              "name": "more",
              "type": "bool"
            },
            {
              "internalType": "uint64",
              "name": "epoch",
              "type": "uint64"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint64",
              "name": "zone",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "fromIndex",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "limit",
              "type": "uint64"
            }
          ],
          "name": "getAvatarsInZone",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "avatarID",
                  "type": "uint256"
                },
                {
                  "internalType": "uint64",
                  "name": "position",
                  "type": "uint64"
                }
              ],
              "internalType": "struct UsingGameTypes.AvatarResolved[]",
              "name": "avatars",
              "type": "tuple[]"
            },
            {
              "internalType": "bool",
              "name": "more",
              "type": "bool"
            },
            {
              "internalType": "uint64",
              "name": "epoch",
              "type": "uint64"
            }
          ],
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
                },
                {
                  "internalType": "contract IERC721",
                  "name": "avatars",
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
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "startIndex",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "limit",
              "type": "uint256"
            }
          ],
          "name": "avatarsPerOwner",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "avatarID",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "inGame",
                  "type": "bool"
                },
                {
                  "internalType": "uint64",
                  "name": "position",
                  "type": "uint64"
                }
              ],
              "internalType": "struct UsingGameTypes.AvatarStatus[]",
              "name": "avatarIDs",
              "type": "tuple[]"
            },
            {
              "internalType": "bool",
              "name": "more",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "controller",
              "type": "address"
            },
            {
              "internalType": "address payable",
              "name": "payee",
              "type": "address"
            }
          ],
          "name": "deposit",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            }
          ],
          "name": "onERC721Received",
          "outputs": [
            {
              "internalType": "bytes4",
              "name": "",
              "type": "bytes4"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            }
          ],
          "name": "withdraw",
          "outputs": [],
          "stateMutability": "nonpayable",
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
          "name": "cancelCommit",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "internalType": "bytes24",
              "name": "commitmentHash",
              "type": "bytes24"
            },
            {
              "internalType": "address payable",
              "name": "payee",
              "type": "address"
            }
          ],
          "name": "commit",
          "outputs": [],
          "stateMutability": "payable",
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
          "name": "acknowledgeMissedReveal",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "components": [
                {
                  "internalType": "enum UsingGameTypes.ActionType",
                  "name": "actionType",
                  "type": "uint8"
                },
                {
                  "internalType": "uint128",
                  "name": "data",
                  "type": "uint128"
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
      "address": "0xa513e6e4b8f2a923d98304ec87f64353c4d5c853",
      "linkedData": {
        "startTime": "0",
        "commitPhaseDuration": "30",
        "revealPhaseDuration": "5",
        "time": "0x0000000000000000000000000000000000000000",
        "avatars": "0x0e801d84fa97b50751dbf25036d067dcf18858bf"
      },
      "startBlock": 26652
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
          "name": "AvatarAlreadyInGame",
          "type": "error"
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
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarNotAvailable",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarNotInGame",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarNotReady",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarStillInGame",
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
          "name": "InvalidData",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InvalidEpoch",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NoCommitmentToCancel",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "NotAuthorizedController",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "NotAuthorizedOwner",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NothingToReveal",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "OnlyAvatarsAreAccepted",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "PreviousCommitmentNotRevealed",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint64",
              "name": "position",
              "type": "uint64"
            }
          ],
          "name": "UnableToExitFromThisPosition",
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
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "controller",
              "type": "address"
            }
          ],
          "name": "AvatarDeposited",
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
            }
          ],
          "name": "AvatarWithdrawn",
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
              "internalType": "uint64",
              "name": "zone",
              "type": "uint64"
            },
            {
              "indexed": false,
              "internalType": "bytes24",
              "name": "commitmentHash",
              "type": "bytes24"
            },
            {
              "components": [
                {
                  "internalType": "enum UsingGameTypes.ActionType",
                  "name": "actionType",
                  "type": "uint8"
                },
                {
                  "internalType": "uint128",
                  "name": "data",
                  "type": "uint128"
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
              "internalType": "uint64",
              "name": "zone",
              "type": "uint64"
            },
            {
              "indexed": false,
              "internalType": "uint64",
              "name": "newPosition",
              "type": "uint64"
            }
          ],
          "name": "EnteredTheGame",
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
              "internalType": "uint64",
              "name": "zoneWhenLeaving",
              "type": "uint64"
            },
            {
              "indexed": false,
              "internalType": "uint64",
              "name": "positionWhenLeaving",
              "type": "uint64"
            }
          ],
          "name": "LeftTheGame",
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
                  "internalType": "uint256",
                  "name": "avatarID",
                  "type": "uint256"
                },
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
          "inputs": [
            {
              "internalType": "uint64[]",
              "name": "zones",
              "type": "uint64[]"
            },
            {
              "internalType": "uint64",
              "name": "fromIndex",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "limit",
              "type": "uint64"
            }
          ],
          "name": "getAvatarsInMultipleZones",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "avatarID",
                  "type": "uint256"
                },
                {
                  "internalType": "uint64",
                  "name": "position",
                  "type": "uint64"
                }
              ],
              "internalType": "struct UsingGameTypes.AvatarResolved[]",
              "name": "avatars",
              "type": "tuple[]"
            },
            {
              "internalType": "bool",
              "name": "more",
              "type": "bool"
            },
            {
              "internalType": "uint64",
              "name": "epoch",
              "type": "uint64"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint64",
              "name": "zone",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "fromIndex",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "limit",
              "type": "uint64"
            }
          ],
          "name": "getAvatarsInZone",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "avatarID",
                  "type": "uint256"
                },
                {
                  "internalType": "uint64",
                  "name": "position",
                  "type": "uint64"
                }
              ],
              "internalType": "struct UsingGameTypes.AvatarResolved[]",
              "name": "avatars",
              "type": "tuple[]"
            },
            {
              "internalType": "bool",
              "name": "more",
              "type": "bool"
            },
            {
              "internalType": "uint64",
              "name": "epoch",
              "type": "uint64"
            }
          ],
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
                },
                {
                  "internalType": "contract IERC721",
                  "name": "avatars",
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
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "startIndex",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "limit",
              "type": "uint256"
            }
          ],
          "name": "avatarsPerOwner",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "avatarID",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "inGame",
                  "type": "bool"
                },
                {
                  "internalType": "uint64",
                  "name": "position",
                  "type": "uint64"
                }
              ],
              "internalType": "struct UsingGameTypes.AvatarStatus[]",
              "name": "avatarIDs",
              "type": "tuple[]"
            },
            {
              "internalType": "bool",
              "name": "more",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "controller",
              "type": "address"
            },
            {
              "internalType": "address payable",
              "name": "payee",
              "type": "address"
            }
          ],
          "name": "deposit",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            }
          ],
          "name": "onERC721Received",
          "outputs": [
            {
              "internalType": "bytes4",
              "name": "",
              "type": "bytes4"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            }
          ],
          "name": "withdraw",
          "outputs": [],
          "stateMutability": "nonpayable",
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
          "name": "cancelCommit",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "internalType": "bytes24",
              "name": "commitmentHash",
              "type": "bytes24"
            },
            {
              "internalType": "address payable",
              "name": "payee",
              "type": "address"
            }
          ],
          "name": "commit",
          "outputs": [],
          "stateMutability": "payable",
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
          "name": "acknowledgeMissedReveal",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "components": [
                {
                  "internalType": "enum UsingGameTypes.ActionType",
                  "name": "actionType",
                  "type": "uint8"
                },
                {
                  "internalType": "uint128",
                  "name": "data",
                  "type": "uint128"
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
      "address": "0x809d550fca64d94bd9f66e60752a544199cfac3d",
      "startBlock": 26652
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
      "address": "0x809d550fca64d94bd9f66e60752a544199cfac3d",
      "startBlock": 26652
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
                },
                {
                  "internalType": "contract IERC721",
                  "name": "avatars",
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
          "name": "AvatarAlreadyInGame",
          "type": "error"
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
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarNotAvailable",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarNotInGame",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarNotReady",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarStillInGame",
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
          "name": "InvalidData",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InvalidEpoch",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NoCommitmentToCancel",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "NotAuthorizedController",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "NotAuthorizedOwner",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NothingToReveal",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "OnlyAvatarsAreAccepted",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "PreviousCommitmentNotRevealed",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint64",
              "name": "position",
              "type": "uint64"
            }
          ],
          "name": "UnableToExitFromThisPosition",
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
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "controller",
              "type": "address"
            }
          ],
          "name": "AvatarDeposited",
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
            }
          ],
          "name": "AvatarWithdrawn",
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
              "internalType": "uint64",
              "name": "zone",
              "type": "uint64"
            },
            {
              "indexed": false,
              "internalType": "bytes24",
              "name": "commitmentHash",
              "type": "bytes24"
            },
            {
              "components": [
                {
                  "internalType": "enum UsingGameTypes.ActionType",
                  "name": "actionType",
                  "type": "uint8"
                },
                {
                  "internalType": "uint128",
                  "name": "data",
                  "type": "uint128"
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
              "internalType": "uint64",
              "name": "zone",
              "type": "uint64"
            },
            {
              "indexed": false,
              "internalType": "uint64",
              "name": "newPosition",
              "type": "uint64"
            }
          ],
          "name": "EnteredTheGame",
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
              "internalType": "uint64",
              "name": "zoneWhenLeaving",
              "type": "uint64"
            },
            {
              "indexed": false,
              "internalType": "uint64",
              "name": "positionWhenLeaving",
              "type": "uint64"
            }
          ],
          "name": "LeftTheGame",
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
          "name": "cancelCommit",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "internalType": "bytes24",
              "name": "commitmentHash",
              "type": "bytes24"
            },
            {
              "internalType": "address payable",
              "name": "payee",
              "type": "address"
            }
          ],
          "name": "commit",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        }
      ],
      "address": "0x5eb3bc0a489c5a8288765d2336659ebca68fcd00",
      "startBlock": 26650
    },
    "Game_Implementation_Router_Deposit_Route": {
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
                },
                {
                  "internalType": "contract IERC721",
                  "name": "avatars",
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
          "name": "AvatarAlreadyInGame",
          "type": "error"
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
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarNotAvailable",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarNotInGame",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarNotReady",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarStillInGame",
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
          "name": "InvalidData",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InvalidEpoch",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NoCommitmentToCancel",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "NotAuthorizedController",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "NotAuthorizedOwner",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NothingToReveal",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "OnlyAvatarsAreAccepted",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "PreviousCommitmentNotRevealed",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint64",
              "name": "position",
              "type": "uint64"
            }
          ],
          "name": "UnableToExitFromThisPosition",
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
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "controller",
              "type": "address"
            }
          ],
          "name": "AvatarDeposited",
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
            }
          ],
          "name": "AvatarWithdrawn",
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
              "internalType": "uint64",
              "name": "zone",
              "type": "uint64"
            },
            {
              "indexed": false,
              "internalType": "bytes24",
              "name": "commitmentHash",
              "type": "bytes24"
            },
            {
              "components": [
                {
                  "internalType": "enum UsingGameTypes.ActionType",
                  "name": "actionType",
                  "type": "uint8"
                },
                {
                  "internalType": "uint128",
                  "name": "data",
                  "type": "uint128"
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
              "internalType": "uint64",
              "name": "zone",
              "type": "uint64"
            },
            {
              "indexed": false,
              "internalType": "uint64",
              "name": "newPosition",
              "type": "uint64"
            }
          ],
          "name": "EnteredTheGame",
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
              "internalType": "uint64",
              "name": "zoneWhenLeaving",
              "type": "uint64"
            },
            {
              "indexed": false,
              "internalType": "uint64",
              "name": "positionWhenLeaving",
              "type": "uint64"
            }
          ],
          "name": "LeftTheGame",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "startIndex",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "limit",
              "type": "uint256"
            }
          ],
          "name": "avatarsPerOwner",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "avatarID",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "inGame",
                  "type": "bool"
                },
                {
                  "internalType": "uint64",
                  "name": "position",
                  "type": "uint64"
                }
              ],
              "internalType": "struct UsingGameTypes.AvatarStatus[]",
              "name": "avatarIDs",
              "type": "tuple[]"
            },
            {
              "internalType": "bool",
              "name": "more",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "controller",
              "type": "address"
            },
            {
              "internalType": "address payable",
              "name": "payee",
              "type": "address"
            }
          ],
          "name": "deposit",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            }
          ],
          "name": "onERC721Received",
          "outputs": [
            {
              "internalType": "bytes4",
              "name": "",
              "type": "bytes4"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            }
          ],
          "name": "withdraw",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ],
      "address": "0x9d4454b023096f34b160d6b654540c56a1f81688",
      "startBlock": 26649
    },
    "Game_Implementation_Router_Enter_Route": {
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
                },
                {
                  "internalType": "contract IERC721",
                  "name": "avatars",
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
          "name": "AvatarAlreadyInGame",
          "type": "error"
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
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarNotAvailable",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarNotInGame",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarNotReady",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarStillInGame",
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
          "name": "InvalidData",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InvalidEpoch",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NoCommitmentToCancel",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "NotAuthorizedController",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "NotAuthorizedOwner",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NothingToReveal",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "OnlyAvatarsAreAccepted",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "PreviousCommitmentNotRevealed",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint64",
              "name": "position",
              "type": "uint64"
            }
          ],
          "name": "UnableToExitFromThisPosition",
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
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "controller",
              "type": "address"
            }
          ],
          "name": "AvatarDeposited",
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
            }
          ],
          "name": "AvatarWithdrawn",
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
              "internalType": "uint64",
              "name": "zone",
              "type": "uint64"
            },
            {
              "indexed": false,
              "internalType": "bytes24",
              "name": "commitmentHash",
              "type": "bytes24"
            },
            {
              "components": [
                {
                  "internalType": "enum UsingGameTypes.ActionType",
                  "name": "actionType",
                  "type": "uint8"
                },
                {
                  "internalType": "uint128",
                  "name": "data",
                  "type": "uint128"
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
              "internalType": "uint64",
              "name": "zone",
              "type": "uint64"
            },
            {
              "indexed": false,
              "internalType": "uint64",
              "name": "newPosition",
              "type": "uint64"
            }
          ],
          "name": "EnteredTheGame",
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
              "internalType": "uint64",
              "name": "zoneWhenLeaving",
              "type": "uint64"
            },
            {
              "indexed": false,
              "internalType": "uint64",
              "name": "positionWhenLeaving",
              "type": "uint64"
            }
          ],
          "name": "LeftTheGame",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "internalType": "uint64",
              "name": "position",
              "type": "uint64"
            }
          ],
          "name": "enter",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ],
      "address": "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9",
      "startBlock": 11
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
                },
                {
                  "internalType": "contract IERC721",
                  "name": "avatars",
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
          "name": "AvatarAlreadyInGame",
          "type": "error"
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
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarNotAvailable",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarNotInGame",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarNotReady",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarStillInGame",
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
          "name": "InvalidData",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InvalidEpoch",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NoCommitmentToCancel",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "NotAuthorizedController",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "NotAuthorizedOwner",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NothingToReveal",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "OnlyAvatarsAreAccepted",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "PreviousCommitmentNotRevealed",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint64",
              "name": "position",
              "type": "uint64"
            }
          ],
          "name": "UnableToExitFromThisPosition",
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
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "controller",
              "type": "address"
            }
          ],
          "name": "AvatarDeposited",
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
            }
          ],
          "name": "AvatarWithdrawn",
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
              "internalType": "uint64",
              "name": "zone",
              "type": "uint64"
            },
            {
              "indexed": false,
              "internalType": "bytes24",
              "name": "commitmentHash",
              "type": "bytes24"
            },
            {
              "components": [
                {
                  "internalType": "enum UsingGameTypes.ActionType",
                  "name": "actionType",
                  "type": "uint8"
                },
                {
                  "internalType": "uint128",
                  "name": "data",
                  "type": "uint128"
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
              "internalType": "uint64",
              "name": "zone",
              "type": "uint64"
            },
            {
              "indexed": false,
              "internalType": "uint64",
              "name": "newPosition",
              "type": "uint64"
            }
          ],
          "name": "EnteredTheGame",
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
              "internalType": "uint64",
              "name": "zoneWhenLeaving",
              "type": "uint64"
            },
            {
              "indexed": false,
              "internalType": "uint64",
              "name": "positionWhenLeaving",
              "type": "uint64"
            }
          ],
          "name": "LeftTheGame",
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
                  "internalType": "uint256",
                  "name": "avatarID",
                  "type": "uint256"
                },
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
          "inputs": [
            {
              "internalType": "uint64[]",
              "name": "zones",
              "type": "uint64[]"
            },
            {
              "internalType": "uint64",
              "name": "fromIndex",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "limit",
              "type": "uint64"
            }
          ],
          "name": "getAvatarsInMultipleZones",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "avatarID",
                  "type": "uint256"
                },
                {
                  "internalType": "uint64",
                  "name": "position",
                  "type": "uint64"
                }
              ],
              "internalType": "struct UsingGameTypes.AvatarResolved[]",
              "name": "avatars",
              "type": "tuple[]"
            },
            {
              "internalType": "bool",
              "name": "more",
              "type": "bool"
            },
            {
              "internalType": "uint64",
              "name": "epoch",
              "type": "uint64"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint64",
              "name": "zone",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "fromIndex",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "limit",
              "type": "uint64"
            }
          ],
          "name": "getAvatarsInZone",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "avatarID",
                  "type": "uint256"
                },
                {
                  "internalType": "uint64",
                  "name": "position",
                  "type": "uint64"
                }
              ],
              "internalType": "struct UsingGameTypes.AvatarResolved[]",
              "name": "avatars",
              "type": "tuple[]"
            },
            {
              "internalType": "bool",
              "name": "more",
              "type": "bool"
            },
            {
              "internalType": "uint64",
              "name": "epoch",
              "type": "uint64"
            }
          ],
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
                },
                {
                  "internalType": "contract IERC721",
                  "name": "avatars",
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
      "address": "0x8f86403a4de0bb5791fa46b8e795c547942fe4cf",
      "startBlock": 26648
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
                },
                {
                  "internalType": "contract IERC721",
                  "name": "avatars",
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
          "name": "AvatarAlreadyInGame",
          "type": "error"
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
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarNotAvailable",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarNotInGame",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarNotReady",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            }
          ],
          "name": "AvatarStillInGame",
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
          "name": "InvalidData",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InvalidEpoch",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NoCommitmentToCancel",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "NotAuthorizedController",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "NotAuthorizedOwner",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NothingToReveal",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "OnlyAvatarsAreAccepted",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "PreviousCommitmentNotRevealed",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint64",
              "name": "position",
              "type": "uint64"
            }
          ],
          "name": "UnableToExitFromThisPosition",
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
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "controller",
              "type": "address"
            }
          ],
          "name": "AvatarDeposited",
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
            }
          ],
          "name": "AvatarWithdrawn",
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
              "internalType": "uint64",
              "name": "zone",
              "type": "uint64"
            },
            {
              "indexed": false,
              "internalType": "bytes24",
              "name": "commitmentHash",
              "type": "bytes24"
            },
            {
              "components": [
                {
                  "internalType": "enum UsingGameTypes.ActionType",
                  "name": "actionType",
                  "type": "uint8"
                },
                {
                  "internalType": "uint128",
                  "name": "data",
                  "type": "uint128"
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
              "internalType": "uint64",
              "name": "zone",
              "type": "uint64"
            },
            {
              "indexed": false,
              "internalType": "uint64",
              "name": "newPosition",
              "type": "uint64"
            }
          ],
          "name": "EnteredTheGame",
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
              "internalType": "uint64",
              "name": "zoneWhenLeaving",
              "type": "uint64"
            },
            {
              "indexed": false,
              "internalType": "uint64",
              "name": "positionWhenLeaving",
              "type": "uint64"
            }
          ],
          "name": "LeftTheGame",
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
          "name": "acknowledgeMissedReveal",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "avatarID",
              "type": "uint256"
            },
            {
              "components": [
                {
                  "internalType": "enum UsingGameTypes.ActionType",
                  "name": "actionType",
                  "type": "uint8"
                },
                {
                  "internalType": "uint128",
                  "name": "data",
                  "type": "uint128"
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
      "address": "0x36c02da8a0983159322a80ffe9f24b1acff8b570",
      "startBlock": 26651
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
      "address": "0xa513e6e4b8f2a923d98304ec87f64353c4d5c853",
      "startBlock": 15
    }
  },
  "name": "localhost"
} as const;