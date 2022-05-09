// import Moralis from 'moralis/types';
import { networkConfigs } from './networks';

// Helper function that provides BatchSwap smart contract with the parameters it needs
export async function initiateTrade(addressFrom, addressTo, nftsOne, nftsTwo, chainHex) {
	//const abi = require('providers/MoralisDappProvider/BatchSwap_ABI.json');
	const abi = [{"inputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address payable","name":"addressOne","type":"address"},{"internalType":"uint256","name":"valueOne","type":"uint256"},{"internalType":"address payable","name":"addressTwo","type":"address"},{"internalType":"uint256","name":"valueTwo","type":"uint256"},{"internalType":"uint256","name":"swapStart","type":"uint256"},{"internalType":"uint256","name":"swapEnd","type":"uint256"},{"internalType":"uint256","name":"swapFee","type":"uint256"},{"internalType":"enum BatchSwap.swapStatus","name":"status","type":"uint8"}],"internalType":"struct BatchSwap.swapIntent","name":"_swapIntent","type":"tuple"},{"components":[{"internalType":"address","name":"dapp","type":"address"},{"internalType":"address","name":"typeStd","type":"address"},{"internalType":"uint256[]","name":"tokenId","type":"uint256[]"},{"internalType":"uint256[]","name":"blc","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct BatchSwap.swapStruct[]","name":"_nftsOne","type":"tuple[]"},{"components":[{"internalType":"address","name":"dapp","type":"address"},{"internalType":"address","name":"typeStd","type":"address"},{"internalType":"uint256[]","name":"tokenId","type":"uint256[]"},{"internalType":"uint256[]","name":"blc","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct BatchSwap.swapStruct[]","name":"_nftsTwo","type":"tuple[]"}],"name":"createSwapIntent","outputs":[],"stateMutability":"payable","type":"function"}]
	let headers = {
		accept: 'application/json',
		'X-API-Key': 'ugZ7n2HNS6k2mIK5zHgDCkKiSJe8NxswTBfTBByoYLvEtKkGTNrY4Y5ixj5N5rij',
		'Content-Type': 'application/json'
	};
	let chain = networkConfigs[chainHex].lookup;
	let addr = '0xc310e760778ecbca4c65b6c559874757a4c4ece0';
	let func = 'createSwapIntent';

	let url = `https://deep-index.moralis.io/api/v2/${addr}/function?chain=${chain}&function_name=${func}`;
	const swapIntent = {
		id: null,
		addressOne: addressFrom,
		// check how to indicate ETH price
		valueOne: 0.1,
		addressTwo: addressTo,
		valueTwo: 0.1,
		swapStart: null,
		swapEnd: null,
		swapFee: null,
		// swapStatus : {Opened, Closed, Cancelled}
		status: null
	};
	const body = {
		// connection to smart contract
		abi: abi,
		// give createSwapIntent the swap details and both sets of NFTs to trade for
		params: {
			__swapIntent: swapIntent,
			__nftsOne: nftsOne,
			__nftsTwo: nftsTwo
		}
	};
	

	var requestOptions = {
		method: 'POST',
		headers: headers,
		body: body,
		redirect: 'follow'
	};

	let responseRaw = await fetch(url, requestOptions);
	console.log(responseRaw)
	if (responseRaw.status === 200) {
		console.log("add");
		addSuccessfulTradeProposal(responseRaw.data, nftsOne, nftsTwo);
		return true;
	}
	return false;
}

// Helper function that provides BatchSwap smart contract with the parameters it needs
export async function acceptTrade(swapId, swapCreator, chainHex) {
	const abi = require('providers/MoralisDappProvider/BatchSwap_ABI.json');

	let headers = {
		accept: 'application/json',
		'X-API-Key': 'ugZ7n2HNS6k2mIK5zHgDCkKiSJe8NxswTBfTBByoYLvEtKkGTNrY4Y5ixj5N5rij',
		'Content-Type': 'application/json'
	};

	let chain = networkConfigs[chainHex].lookup;
	let addr = '0xc310e760778ecbca4c65b6c559874757a4c4ece0';
	let func = 'closeSwapIntent';

	let url = `https://deep-index.moralis.io/api/v2/${addr}/function?chain=${chain}&function_name=${func}`;

	const body = {
		// connection to smart contract
		abi: abi,
		// give createSwapIntent the swap details and both sets of NFTs to trade for
		params: {
			__swapId: swapId,
			__swapCreator: swapCreator
		}
	};

	var requestOptions = {
		method: 'POST',
		headers: headers,
		body: body,
		redirect: 'follow'
	};

	let responseRaw = await fetch(url, requestOptions);

	if (responseRaw.status === 200) {
		console.log("update");
		updateSuccessfulTrade(responseRaw.data.swapId);
		return true;
	}
}

const createMoralisSwapStruct = (swapStruct) => {
	console.log("calling make swap");
	const SwapStruct = Moralis.Object.extend('SwapStruct');
	const swapStructMoralis = new SwapStruct();
	swapStructMoralis.set('dapp', swapStruct.dapp);
	swapStructMoralis.set('typeStd', swapStruct.typeStd);
	swapStructMoralis.set('tokenId', swapStruct.tokenId);
	swapStructMoralis.set('blc', swapStruct.blc);
	swapStructMoralis.set('data', swapStruct.data);
	swapStructMoralis.save();
	return swapStructMoralis;
};

async function addSuccessfulTradeProposal(data, nftsOne, nftsTwo) {
	console.log(JSON.stringify(data));

	const nftsOneList = nftsOne.map((swapStruct) => {
		createMoralisSwapStruct(swapStruct);
	});

	const nftsTwoList = nftsTwo.map((swapStruct) => {
		createMoralisSwapStruct(swapStruct);
	});

	const SwapIntent = Moralis.Object.extend('SwapIntent');
	const swapIntent = new SwapIntent();
	const relationOne = swapIntent.relation('nftsOne');
	const relationTwo = swapIntent.relation('nftsTwo');

	relationOne.add(nftsOneList);
	relationTwo.add(nftsTwoList);

	swapIntent.set('swapId', '');
	swapIntent.set('addressOne', '');
	swapIntent.set('addressTwo', '');
	swapIntent.set('swapStart', Date.now());
	swapIntent.set('swapStatus', 'Opened');
	swapIntent.save().then((swapIntent) => {
		console.log('ObjectID: ' + swapIntent.id);
	});
}

async function updateSuccessfulTrade(swapId) {
	console.log("calling update swap");
	const SwapIntent = Moralis.Object.extend('SwapIntent');
	const query = new Moralis.Query(SwapIntent);
	console.log("made new object");
	query.equalTo('swapId', swapId);
	await query.first().then((obj) => {
		obj.set('swapStatus', 'Closed');
		obj.set('swapEnd', Date.now());
		obj.save();
	});
}
