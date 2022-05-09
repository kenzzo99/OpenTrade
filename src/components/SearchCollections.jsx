import { Input } from 'antd';
import { useMoralisDapp } from 'providers/MoralisDappProvider/MoralisDappProvider';
import { callSearchNFTs } from 'helpers/search';
import { getSearchResultsByChain } from 'helpers/search';

function SearchCollections({ setInputValue, setSearchResults }) {
	const { Search } = Input;
	const { chainId } = useMoralisDapp();

	async function onSearch(value) {
		// let searchResultsTemp = await callSearchNFTs(value, '0x1');
		// setSearchResults(getSearchResultsByChain('0x1'));
		let searchResultsTemp = await callSearchNFTs(value, chainId);
		setSearchResults(getSearchResultsByChain(chainId));
		setInputValue('search' + value);
	}

	return (
		<>
			<Search
				placeholder='Search NFTs'
				onSearch={onSearch}
				style={{ width: '750px', padding: 15 }}
			/>
		</>
	);
}
export default SearchCollections;
