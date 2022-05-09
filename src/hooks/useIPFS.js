export const useIPFS = () => {
	const resolveLink = (url) => {
		if (!url || !url.includes('ipfs://')) return url;
		let urlTemp = url.replace('ipfs://', 'https://ipfs.io/ipfs/');
		if (urlTemp.includes('/ipfs/ipfs/')) {
			return urlTemp.replace('/ipfs/ipfs/', '/ipfs/');
		} else {
			return urlTemp;
		}
	};

	return { resolveLink };
};
