import { networkConfigs } from './networks';
const API_KEY = process.env.MORALIS_API_KEY;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function getOwnerNfts(address, chainHex) {
	if (chainHex === '0x1' || chainHex === '0x89') {
		let headers = {
			accept: 'application/json',
			'X-API-Key': 'ugZ7n2HNS6k2mIK5zHgDCkKiSJe8NxswTBfTBByoYLvEtKkGTNrY4Y5ixj5N5rij'
		};

		let requestOptions = {
			method: 'GET',
			headers: headers,
			redirect: 'follow'
		};

		let chain = networkConfigs[chainHex].lookup;

		let url = `https://deep-index.moralis.io/api/v2/${address}/nft?chain=${chain}&format=decimal`;

		let responseRaw = await fetch(url, requestOptions);

		let result = [];

		if (responseRaw.status === 200) {
			let responseJSON = await responseRaw.json();
			for (const nft of responseJSON.result) {
				let temp = nft;
				let metadata = JSON.parse(nft.metadata);
				if (metadata && metadata.image) {
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
				result.push(temp);
			}
			return responseJSON.result;
		}
	} else if (chainHex === '0x4') {
		const options = { method: 'GET' };

		// Avoid rate-limiting by waiting before calling API
		await delay(1000);

		let responseRaw = await fetch(
			`https://testnets-api.opensea.io/api/v1/assets?owner=${address}`,
			options
		);

		let result = [];

		if (responseRaw.status === 200) {
			let responseJSON = await responseRaw.json();
			for (const asset of responseJSON.assets) {
				let temp = {};
				temp.token_address = asset.asset_contract.address;
				temp.token_id = asset.token_id;
				temp.contract_type = asset.asset_contract.schema_name;
				temp.image = asset.image_url;
				temp.name = asset.name;
				result.push(temp);
			}
			return result;
		}
	}
}

export async function getOwnerAddr(address, asset_id, chainHex) {
	if (chainHex === '0x1' || chainHex === '0x89') {
		let chainDec = Number(chainHex);

		let url = `https://api.covalenthq.com/v1/${chainDec}/tokens/${address}/nft_metadata/${asset_id}/?key=ckey_ceafeef2985c4f61997f360c68d`;

		let responseRaw = await fetch(url, {
			method: 'GET',
			redirect: 'follow'
		});

		if (responseRaw.status === 200) {
			let responseJSON = await responseRaw.json();
			return responseJSON.data.items[0].nft_data[0].owner_address;
		}
	} else if (chainHex === '0x4') {
		console.log('HERE');
		const options = { method: 'GET' };

		let responseRaw = await fetch(
			`https://testnets-api.opensea.io/api/v1/asset/${address}/${asset_id}/`,
			options
		);

		if (responseRaw.status === 200) {
			let responseJSON = await responseRaw.json();
			return responseJSON.top_ownerships[0].owner.address;
		}
	}
}
