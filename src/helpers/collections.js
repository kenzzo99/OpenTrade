export async function fetchCollections(pageNumber, chainHex) {
	let chainDec = Number(chainHex);
	let url = `https://api.covalenthq.com/v1/${chainDec}/nft_market/?quote-currency=USD&format=JSON&page-number=${pageNumber}&page-size=20&key=ckey_ceafeef2985c4f61997f360c68d`;

	let responseRaw = await fetch(url, {
		method: 'GET',
		redirect: 'follow'
	});

	if (responseRaw.status === 200) {
		let responseJSON = await responseRaw.json();

		for (let collection of responseJSON.data.items) {
			let temp = {};
			if (collection.first_nft_image) {
				if (collection.first_nft_image.startsWith('ipfs://')) {
					let tempImage = collection.first_nft_image.replace(
						'ipfs://',
						'https://ipfs.io/ipfs/'
					);
					temp.image = tempImage;
				} else if (
					collection.first_nft_image.startsWith('https://gateway.ipfs.io/ipfs/ipfs/')
				) {
					let tempImage = collection.first_nft_image.replace(
						'https://gateway.ipfs.io/ipfs/ipfs/',
						'https://ipfs.io/ipfs/'
					);
					temp.image = tempImage;
				} else {
					temp.image = collection.first_nft_image;
				}
			} else {
				temp.image = null;
			}
			temp.name = collection.collection_name;
			temp.addrs = collection.collection_address;
			networkCollections[chainHex].push(temp);
		}
	}
}

// Should automatically populate with all networks
export let networkCollections = {
	'0x1': [],
	'0x89': [
		{
			image: 'https://lh3.googleusercontent.com/tgpgbT3OwxX4REASLdyafzCWQ5EhOtgSiIlhI3am3aZ_mYPS0WbM9Z4F6hOhb0D-AKqhHlFg6BNBquchQy-_bwY=s0',
			name: 'Zed RUN Legacy',
			addrs: '0xA5F1Ea7DF861952863dF2e8d1312f7305dabf215'
		},
		{
			image: 'https://lh3.googleusercontent.com/EjR3eM1lBxgVk6F3PdOU1xaF-aVQfK3aTj29kKsbkDYFJrMC1tBf0k5lYjVfd6FYIPAr-rC3e79WPZmqEkrSv10o=s0',
			name: 'MyCryptoHeroes',
			addrs: '0x77BD275fF2B3Dc007475aAC9Ce7F408F5A800188'
		},
		{
			image: 'https://lh3.googleusercontent.com/vqpagZzkUkiTlLR1DHyw58wc6uxfEegI8NbeFo45mubN2O3m8WTGTG59xXPQCflsAXLs_EcmR3tIiic_1Alet6E0z2YcXtIMxWfVWw=s0',
			name: 'Decentral Games ICE Poker',
			addrs: '0x09eEAC7Dff0Dc304E25cBb7BDBfAE798488Fc34f'
		},
		{
			image: 'https://lh3.googleusercontent.com/z0605wLEPoraBKL4y4b3Be_yF9uKA_dO8Z24mNGhpXht_H0quGAFuzsBAOinZc8GQhI2NDQUfcpCfGQagttD-O2FogcKCsAy3pwFcd4=s0',
			name: 'Chicken Derby',
			addrs: '0x8634666bA15AdA4bbC83B9DbF285F73D9e46e4C2'
		},
		{
			image: 'https://lh3.googleusercontent.com/W9ZPuD7gMwLFSXqTLB85mBZr1cI3Kio_k75HlUIMm6n7TMjcP-MPamwidyt1uEWglkr_RCY7Ox1FmHYVkXFv9c25aXgIyzZ5dbBN3A=s0',
			name: 'REVV Racing',
			addrs: '0x51ac4a13054d5d7e1fa795439821484177e7e828'
		}
	],
	'0x4': [
		{
			image: 'https://lh3.googleusercontent.com/xfIzDGilMlCWJKo4CVFS-sx5dO_QtQYx3ErIve3qAoNv7D3ivenNxlHzkzyll318NhLU2wWkqhPstKbZrr3ZZGZOxepNvlZ92gEKbg=s130',
			name: 'Bored Ape Yacht Club (Demo)',
			addrs: '0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656'
		},
		{
			image: 'https://lh3.googleusercontent.com/lHexKRMpw-aoSyB1WdFBff5yfANLReFxHzt1DOj_sg7mS14yARpuvYcUtsyyx-Nkpk6WTcUPFoG53VnLJezYi8hAs0OxNZwlw6Y-dmI=s0',
			name: 'Mutant Ape Yacht Club (Demo)',
			addrs: '0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656'
		},
		{
			image: 'https://lh3.googleusercontent.com/DaL-JfnDBExlNzefq_VWKISC2gvl3uMztdhA54tstkhf6PlHryzIw4cM-6HkldW5PjlPlAqZ0ZGTZsNyI0wHL8_lU9i9RmDebtQP=s0',
			name: 'Cool Cats (Demo)',
			addrs: '0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656'
		}
	]
};

export const getCollectionsByChain = (chain) => networkCollections[chain];
