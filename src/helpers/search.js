import { toBeEmptyDOMElement } from '@testing-library/jest-dom/dist/matchers';
import { networkConfigs } from './networks';

const API_KEY = process.env.MORALIS_API_KEY;

export async function callSearchNFTs(query, chainHex) {
	console.log('Searching for NFTs with query: ' + query);

	let chain = networkConfigs[chainHex].lookup;

	let headers = {
		accept: 'application/json',
		'X-API-Key': 'ugZ7n2HNS6k2mIK5zHgDCkKiSJe8NxswTBfTBByoYLvEtKkGTNrY4Y5ixj5N5rij'
	};

	let url = `https://deep-index.moralis.io/api/v2/nft/search?chain=${chain}&format=decimal&q=${query}&filter=name`;

	let requestOptions = {
		method: 'GET',
		headers: headers,
		redirect: 'follow'
	};

	let responseRaw = await fetch(url, requestOptions);
	searchResults[chainHex] = [];
	if (responseRaw.status === 200) {
		let responseJSON = await responseRaw.json();

		for (let asset of responseJSON.result) {
			let temp = {};
			temp.block_number_minted = asset.block_number_minted;
			temp.contract_type = asset.contract_type;
			if (asset.metadata != null) {
				const metadata = JSON.parse(asset.metadata);
				if (metadata.image) {
					if (metadata.image.startsWith('ipfs://')) {
						let tempImage = metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
						temp.image = tempImage;
					} else if (metadata.image.startsWith('https://gateway.ipfs.io/ipfs/ipfs/')) {
						let tempImage = metadata.image.replace(
							'https://gateway.ipfs.io/ipfs/ipfs/',
							'https://ipfs.io/ipfs/'
						);
						temp.image = tempImage;
					} else {
						temp.image = metadata.image;
					}
				} else {
					temp.image = null;
				}
			} else {
				temp.image = null;
			}
			temp.metadata = asset.metadata;
			temp.name = asset.metadata_name;
			temp.synced_at = asset.synced_at;
			temp.token_address = asset.token_address;
			temp.token_hash = asset.token_hash;
			temp.token_id = asset.token_id;
			temp.token_uri = asset.token_uri;
			searchResults[chainHex].push(temp);
		}
	}
}

// Should automatically populate with all networks
export let searchResults = {
	'0x1': []
};

export const getSearchResultsByChain = (chain) => searchResults[chain];
