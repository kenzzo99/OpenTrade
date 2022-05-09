import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import MoralisDappContext from "./context";

function MoralisDappProvider({ children }) {
	const { web3, Moralis, user } = useMoralis();
	const [walletAddress, setWalletAddress] = useState();
	const [chainId, setChainId] = useState("0x1");
	const [contractABI, setContractABI] = useState(
		JSON.stringify([
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
						"indexed": false,
						"internalType": "address",
						"name": "account",
						"type": "address"
					}
				],
				"name": "Paused",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "address",
						"name": "account",
						"type": "address"
					}
				],
				"name": "Unpaused",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "_payer",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "_value",
						"type": "uint256"
					}
				],
				"name": "paymentReceived",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "_creator",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "time",
						"type": "uint256"
					},
					{
						"indexed": true,
						"internalType": "enum BatchSwap.swapStatus",
						"name": "_status",
						"type": "uint8"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "_swapId",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "address",
						"name": "_swapCounterPart",
						"type": "address"
					}
				],
				"name": "swapEvent",
				"type": "event"
			},
			{
				"inputs": [],
				"name": "CRYPTOPUNK",
				"outputs": [{ "internalType": "address", "name": "", "type": "address" }],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "TRADESQUAD",
				"outputs": [{ "internalType": "address", "name": "", "type": "address" }],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "VAULT",
				"outputs": [{ "internalType": "address payable", "name": "", "type": "address" }],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [{ "internalType": "uint256", "name": "_swapId", "type": "uint256" }],
				"name": "cancelSwapIntent",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [{ "internalType": "uint256", "name": "_punkId", "type": "uint256" }],
				"name": "claimPunkOnProxy",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{ "internalType": "address", "name": "_swapCreator", "type": "address" },
					{ "internalType": "uint256", "name": "_swapId", "type": "uint256" }
				],
				"name": "closeSwapIntent",
				"outputs": [],
				"stateMutability": "payable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"components": [
							{ "internalType": "uint256", "name": "id", "type": "uint256" },
							{
								"internalType": "address payable",
								"name": "addressOne",
								"type": "address"
							},
							{ "internalType": "uint256", "name": "valueOne", "type": "uint256" },
							{
								"internalType": "address payable",
								"name": "addressTwo",
								"type": "address"
							},
							{ "internalType": "uint256", "name": "valueTwo", "type": "uint256" },
							{ "internalType": "uint256", "name": "swapStart", "type": "uint256" },
							{ "internalType": "uint256", "name": "swapEnd", "type": "uint256" },
							{ "internalType": "uint256", "name": "swapFee", "type": "uint256" },
							{
								"internalType": "enum BatchSwap.swapStatus",
								"name": "status",
								"type": "uint8"
							}
						],
						"internalType": "struct BatchSwap.swapIntent",
						"name": "_swapIntent",
						"type": "tuple"
					},
					{
						"components": [
							{ "internalType": "address", "name": "dapp", "type": "address" },
							{ "internalType": "address", "name": "typeStd", "type": "address" },
							{ "internalType": "uint256[]", "name": "tokenId", "type": "uint256[]" },
							{ "internalType": "uint256[]", "name": "blc", "type": "uint256[]" },
							{ "internalType": "bytes", "name": "data", "type": "bytes" }
						],
						"internalType": "struct BatchSwap.swapStruct[]",
						"name": "_nftsOne",
						"type": "tuple[]"
					},
					{
						"components": [
							{ "internalType": "address", "name": "dapp", "type": "address" },
							{ "internalType": "address", "name": "typeStd", "type": "address" },
							{ "internalType": "uint256[]", "name": "tokenId", "type": "uint256[]" },
							{ "internalType": "uint256[]", "name": "blc", "type": "uint256[]" },
							{ "internalType": "bytes", "name": "data", "type": "bytes" }
						],
						"internalType": "struct BatchSwap.swapStruct[]",
						"name": "_nftsTwo",
						"type": "tuple[]"
					}
				],
				"name": "createSwapIntent",
				"outputs": [],
				"stateMutability": "payable",
				"type": "function"
			},
			{
				"inputs": [
					{ "internalType": "uint256", "name": "_swapId", "type": "uint256" },
					{ "internalType": "address payable", "name": "_counterPart", "type": "address" }
				],
				"name": "editCounterPart",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [{ "internalType": "address", "name": "_address", "type": "address" }],
				"name": "getPunkProxy",
				"outputs": [{ "internalType": "address", "name": "", "type": "address" }],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{ "internalType": "address", "name": "_creator", "type": "address" },
					{ "internalType": "uint256", "name": "_swapId", "type": "uint256" }
				],
				"name": "getSwapIntentByAddress",
				"outputs": [
					{
						"components": [
							{ "internalType": "uint256", "name": "id", "type": "uint256" },
							{
								"internalType": "address payable",
								"name": "addressOne",
								"type": "address"
							},
							{ "internalType": "uint256", "name": "valueOne", "type": "uint256" },
							{
								"internalType": "address payable",
								"name": "addressTwo",
								"type": "address"
							},
							{ "internalType": "uint256", "name": "valueTwo", "type": "uint256" },
							{ "internalType": "uint256", "name": "swapStart", "type": "uint256" },
							{ "internalType": "uint256", "name": "swapEnd", "type": "uint256" },
							{ "internalType": "uint256", "name": "swapFee", "type": "uint256" },
							{
								"internalType": "enum BatchSwap.swapStatus",
								"name": "status",
								"type": "uint8"
							}
						],
						"internalType": "struct BatchSwap.swapIntent",
						"name": "",
						"type": "tuple"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{ "internalType": "uint256", "name": "_swapId", "type": "uint256" },
					{ "internalType": "bool", "name": "_nfts", "type": "bool" },
					{ "internalType": "uint256", "name": "_index", "type": "uint256" }
				],
				"name": "getSwapStruct",
				"outputs": [
					{
						"components": [
							{ "internalType": "address", "name": "dapp", "type": "address" },
							{ "internalType": "address", "name": "typeStd", "type": "address" },
							{ "internalType": "uint256[]", "name": "tokenId", "type": "uint256[]" },
							{ "internalType": "uint256[]", "name": "blc", "type": "uint256[]" },
							{ "internalType": "bytes", "name": "data", "type": "bytes" }
						],
						"internalType": "struct BatchSwap.swapStruct",
						"name": "",
						"type": "tuple"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{ "internalType": "uint256", "name": "_swapId", "type": "uint256" },
					{ "internalType": "bool", "name": "_nfts", "type": "bool" }
				],
				"name": "getSwapStructSize",
				"outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "getWeiPayValueAmount",
				"outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [{ "internalType": "address", "name": "_address", "type": "address" }],
				"name": "getWhiteList",
				"outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{ "internalType": "address", "name": "operator", "type": "address" },
					{ "internalType": "address", "name": "from", "type": "address" },
					{ "internalType": "uint256[]", "name": "id", "type": "uint256[]" },
					{ "internalType": "uint256[]", "name": "value", "type": "uint256[]" },
					{ "internalType": "bytes", "name": "data", "type": "bytes" }
				],
				"name": "onERC1155BatchReceived",
				"outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{ "internalType": "address", "name": "operator", "type": "address" },
					{ "internalType": "address", "name": "from", "type": "address" },
					{ "internalType": "uint256", "name": "id", "type": "uint256" },
					{ "internalType": "uint256", "name": "value", "type": "uint256" },
					{ "internalType": "bytes", "name": "data", "type": "bytes" }
				],
				"name": "onERC1155Received",
				"outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{ "internalType": "address", "name": "operator", "type": "address" },
					{ "internalType": "address", "name": "from", "type": "address" },
					{ "internalType": "uint256", "name": "tokenId", "type": "uint256" },
					{ "internalType": "bytes", "name": "data", "type": "bytes" }
				],
				"name": "onERC721Received",
				"outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "owner",
				"outputs": [{ "internalType": "address", "name": "", "type": "address" }],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "paused",
				"outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "registerPunkProxy",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "renounceOwnership",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [{ "internalType": "address", "name": "_cryptoPunk", "type": "address" }],
				"name": "setCryptoPunkAddress",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{ "internalType": "address", "name": "_dapp", "type": "address" },
					{ "internalType": "address", "name": "_customInterface", "type": "address" }
				],
				"name": "setDappRelation",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{ "internalType": "bool", "name": "_status", "type": "bool" },
					{ "internalType": "uint256", "name": "_value", "type": "uint256" }
				],
				"name": "setPayment",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [{ "internalType": "address", "name": "_tradeSquad", "type": "address" }],
				"name": "setTradeSquadAddress",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{ "internalType": "address payable", "name": "_vault", "type": "address" }
				],
				"name": "setVaultAddress",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{ "internalType": "address", "name": "_dapp", "type": "address" },
					{ "internalType": "bool", "name": "_status", "type": "bool" }
				],
				"name": "setWhitelist",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [{ "internalType": "bytes4", "name": "interfaceID", "type": "bytes4" }],
				"name": "supportsInterface",
				"outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }],
				"name": "transferOwnership",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{ "stateMutability": "payable", "type": "receive" }
		])
	);
	const [marketAddress, setMarketAddress] = useState(
		"0x6e73ba038C70586dF621560528c68718546dF7d7"
	);

	useEffect(() => {
		Moralis.onChainChanged(function (chain) {
			setChainId(chain);
		});

		Moralis.onAccountsChanged(function (address) {
			setWalletAddress(address[0]);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => setChainId(web3.givenProvider?.chainId));
	useEffect(
		() => setWalletAddress(web3.givenProvider?.selectedAddress || user?.get("ethAddress")),
		[web3, user]
	);

	return (
		<MoralisDappContext.Provider
			value={{
				walletAddress,
				chainId,
				marketAddress,
				setMarketAddress,
				contractABI,
				setContractABI
			}}
		>
			{children}
		</MoralisDappContext.Provider>
	);
}

function useMoralisDapp() {
	const context = React.useContext(MoralisDappContext);
	if (context === undefined) {
		throw new Error("useMoralisDapp must be used within a MoralisDappProvider");
	}
	return context;
}

export { MoralisDappProvider, useMoralisDapp };
