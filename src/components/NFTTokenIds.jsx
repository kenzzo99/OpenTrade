import React, { useState, useEffect } from 'react';
import { getNativeByChain, networkConfigs, supportedChains } from 'helpers/networks';
import { getCollectionsByChain, fetchCollections, networkCollections } from 'helpers/collections';
import { getOwnerAddr, getOwnerNfts } from 'helpers/ownerNFTs';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { Card, Image, Tooltip, Modal, Badge, Alert, Spin, Button, Layout, Typography } from 'antd';
import { useNFTTokenIds } from 'hooks/useNFTTokenIds';
import { FileSearchOutlined, SwapOutlined, LeftOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
import { useMoralisDapp } from 'providers/MoralisDappProvider/MoralisDappProvider';
import { getExplorer } from 'helpers/networks';
import { useWeb3ExecuteFunction } from 'react-moralis';
import { testnetNFTs } from 'helpers/testnetNFTs';
import { revvNFTs } from 'helpers/revvNFTs';

const { Meta } = Card;
const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;

const styles = {
	NFTs: {
		display: 'flex',
		flexWrap: 'wrap',
		WebkitBoxPack: 'start',
		justifyContent: 'flex-start',
		margin: '0 auto',
		maxWidth: '1000px',
		gap: '10px',
		paddingBottom: '25px'
	},
	NFTsModal: {
		display: 'flex',
		flexWrap: 'wrap',
		WebkitBoxPack: 'start',
		justifyContent: 'flex-start',
		margin: '0 auto',
		maxWidth: '470px',
		maxHeight: '400px',
		overflow: 'scroll',
		gap: '10px',
		paddingBottom: '25px',
		paddingLeft: '10px',
		paddingRight: '10px'
	},
	container: {
		display: 'flex',
		justifyContent: 'center',
		margin: '0 auto',
		maxWidth: '1000px',
		gap: '10px',
		paddingBottom: '25px'
	},
	containerModal: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		margin: '0 auto',
		maxWidth: '1000px',
		borderRadius: '10px',
		overflow: 'hidden',
		gap: '10px',
		paddingBottom: '25px',
		background: '#f0f2f5'
	},
	banner: {
		display: 'flex',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		margin: '0 auto',
		width: '600px',
		height: '150px',
		marginBottom: '40px',
		paddingBottom: '20px',
		borderBottom: 'solid 1px #e3e3e3'
	},
	logo: {
		height: '115px',
		width: '115px',
		borderRadius: '50%',
		border: 'solid 4px white'
	},
	text: {
		color: '#041836',
		fontSize: '27px',
		fontWeight: 'bold'
	}
};

function NFTTokenIds({ inputValue, setInputValue, searchResults, setSearchResults }) {
	const fallbackImg =
		'data:image/png;base64,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';
	const { NFTTokenIds, totalNFTs, fetchSuccess } = useNFTTokenIds(inputValue);
	const [visible, setVisibility] = useState(false);

	const [nftRequested, setNftRequested] = useState(null);
	const [nftsRequested, setNftsRequested] = useState({});
	const [nftRequestedOwnerAddr, setNftRequestedOwnerAddr] = useState(null);
	const [nftRequestedOwnerNfts, setNftRequestedOwnerNfts] = useState([]);

	const [yourNfts, setYourNfts] = useState([]);
	const [nftsOffered, setNftsOffered] = useState({});

	const [loading, setLoading] = useState(false);

	const { chainId, marketAddress, contractABI, walletAddress } = useMoralisDapp();
	const { Moralis } = useMoralis();
	const nativeName = getNativeByChain(chainId);
	const contractProcessor = useWeb3ExecuteFunction();
	const contractABIJson = JSON.parse(contractABI);
	const queryMarketItems = useMoralisQuery('MarketItems');
	const fetchMarketItems = JSON.parse(
		JSON.stringify(queryMarketItems.data, [
			'objectId',
			'createdAt',
			'price',
			'nftContract',
			'itemId',
			'sold',
			'tokenId',
			'seller',
			'owner',
			'confirmed'
		])
	);

	const [NFTCollections, setNFTCollections] = React.useState(null);
	const [collectionPage, setCollectionPage] = React.useState(0);
	const [loadingCollections, setLoadingCollections] = React.useState(false);
	const [loadingTrade, setLoadingTrade] = React.useState(false);

	async function initiateTrade() {
		setLoadingTrade(true);
		let nftsOne = Object.values(nftsOffered);
		let nftsTwo = Object.values(nftsRequested);
		const balance = Moralis.Units.ETH("0.01")
		console.log(balance)
		console.log(typeof(balance))
		const swapIntent = {
			id: "0",
			addressOne: walletAddress,
			valueOne: "1000000000000000",
			addressTwo: nftRequestedOwnerAddr,
			valueTwo: "2000000000000000",
			swapStart: "0",
			swapEnd: "0",
			swapFee: "0",
			status: "0"
		};

		const ops = {
			contractAddress: marketAddress,
			functionName: 'createSwapIntent',
			abi: contractABIJson,
			params: {
				_swapIntent: swapIntent,
				_nftsOne: nftsOne,
				_nftsTwo: nftsTwo
			},
			msgValue: swapIntent.valueOne
		};

		await contractProcessor.fetch({
			params: ops,
			onSuccess: (data) => {
				console.log(data);
				setLoadingTrade(false);
				setVisibility(false);
				addSuccessfulTradeProposal(data, nftsOne, nftsTwo);
				succTrade();
			},
			onError: (error) => {
				console.log('error');
				console.log(error);
				setLoadingTrade(false);
				failTrade();
			}
		});
	}

	// async function acceptTrade() {
	// 	swapCreater = walletAddress;
	// 	///////// when calling this how do we access?
	// 	swapId = "0";

	// 	const ops = {
	// 		contractAddress: marketAddress,
	// 		functionName: 'closeSwapIntent',
	// 		abi: contractABIJson,
	// 		params: {
	// 			_swapId: swapId,
	// 			_swapCreater: swapCreater
	// 		},
	// 		msgValue: swapIntent.valueOne
	// 	};

	// 	await contractProcessor.fetch({
	// 		params: ops,
	// 		onSuccess: (data) => {
	// 			console.log(data);
	// 			setLoadingTrade(false);
	// 			setVisibility(false);
	// 			updateTradeProposal();
	// 			succTradeClose();
	// 		},
	// 		onError: (error) => {
	// 			console.log('error');
	// 			console.log(error);
	// 			setLoadingTrade(false);
	// 			failTradeClose();
	// 		}
	// 	});
	// }

		// "succTrade"
		function succTrade() {
			let secondsToGo = 5;
			const modal = Modal.success({
				title: 'Success!',
				content: `You have sucessfully initiated a trade`
			});
			setTimeout(() => {
				modal.destroy();
			}, secondsToGo * 1000);
		}
	
		// "failTrade"
		function failTrade() {
			let secondsToGo = 5;
			const modal = Modal.error({
				title: 'Error!',
				content: `There was a problem when initiating this trade`
			});
			setTimeout(() => {
				modal.destroy();
			}, secondsToGo * 1000);
		}

		// // "succTradeClose"
		// function succTradeClose() {
		// 	let secondsToGo = 5;
		// 	const modal = Modal.success({
		// 		title: 'Success!',
		// 		content: `You have successfully accepted a trade`
		// 	});
		// 	setTimeout(() => {
		// 		modal.destroy();
		// 	}, secondsToGo * 1000);
		// }
	
		// // "failTradeClose"
		// function failTradeClose() {
		// 	let secondsToGo = 5;
		// 	const modal = Modal.error({
		// 		title: 'Error!',
		// 		content: `There was a problem when accepting this trade`
		// 	});
		// 	setTimeout(() => {
		// 		modal.destroy();
		// 	}, secondsToGo * 1000);
		// }
		const createMoralisSwapStruct = (swapStruct) => {
			console.log("calling make swap");
			if (swapStruct === undefined){return};
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
			console.log(data);
			const swap_info = data.events.swapEvent.returnValues;
			console.log(swap_info);
			const swapId = swap_info._swapId;
			const addr_creator = swap_info._creator;
			const addr_counterpart = swap_info._swapCounterPart;

			console.log(nftsOne);
			console.log(nftsTwo);
			// const nftsOneList = nftsOne.map((swapStruct) => {
			// 	createMoralisSwapStruct(swapStruct);
			// });
		
			// const nftsTwoList = nftsTwo.map((swapStruct) => {
			// 	createMoralisSwapStruct(swapStruct);
			// });
		
			const SwapIntent = Moralis.Object.extend('SwapIntent');
			const swapIntent = new SwapIntent();
			// const relationOne = swapIntent.relation('nftsOne');
			// const relationTwo = swapIntent.relation('nftsTwo');
		
			// relationOne.add(nftsOneList);
			// relationTwo.add(nftsTwoList);
		
			swapIntent.set('swapId', swapId);
			swapIntent.set('addressOne', addr_creator);
			swapIntent.set('addressTwo', addr_counterpart);
			swapIntent.set('swapStart', Date.now());
			swapIntent.set('swapStatus', 'Opened');
			swapIntent.save().then((swapIntent) => {
				console.log("hi");
				console.log(swapIntent);
				console.log("hi");
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

	useEffect(() => {
		async function fetchCollectionsHelper() {
			console.log(fetchCollectionsHelper);
			setLoadingCollections(true);
			await fetchCollections(collectionPage, chainId);
			setNFTCollections(getCollectionsByChain(chainId));
			setLoadingCollections(false);
		}
		if (chainId === '0x1') {
			fetchCollectionsHelper();
		} else {
			console.log('Hard-coded nfts');
			setNFTCollections(getCollectionsByChain(chainId));
		}
	}, [collectionPage, chainId]);

	useEffect(() => {
		async function fetchOwnerAddrs() {
			console.log('fetchOwnerAddrs');
			let ownerAddrTemp = await getOwnerAddr(
				nftRequested.token_address,
				nftRequested.token_id,
				chainId
			);
			console.log(ownerAddrTemp);
			setNftRequestedOwnerAddr(ownerAddrTemp);
		}
		if (nftRequested) {
			fetchOwnerAddrs();
		}
	}, [nftRequested, chainId]);

	useEffect(() => {
		async function fetchOwnerNftsHelper() {
			console.log('get other party nfts');
			let ownerNftsTemp = await getOwnerNfts(nftRequestedOwnerAddr, chainId);
			setNftRequestedOwnerNfts(ownerNftsTemp);
		}
		if (nftRequestedOwnerAddr) {
			fetchOwnerNftsHelper();
		}
	}, [nftRequestedOwnerAddr, chainId]);

	useEffect(() => {
		async function fetchOwnerNftsHelper() {
			console.log('fetchOwnerNftsHelper');
			let ownerNftsTemp = await getOwnerNfts(walletAddress, chainId);
			setYourNfts(ownerNftsTemp);
		}
		if (walletAddress) {
			fetchOwnerNftsHelper();
		}
	}, [walletAddress, chainId]);

	useEffect(() => {
		if (!visible) {
			setNftRequested(null);
			setNftRequestedOwnerAddr(null);
			setNftRequestedOwnerNfts([]);
			setNftsRequested({});
			setNftsOffered({});
		}
	}, [visible]);

	const [tokensPage, setTokensPage] = React.useState(1);

	async function loadMoreBtn() {
		if (inputValue === 'explore') {
			setCollectionPage(collectionPage + 1);
		} else {
			setTokensPage(tokensPage + 1);
		}
	}

	const [loadingCollectionsPage, setLoadingCollectionsPage] = React.useState(false);

	// lets make external helper function trade and take in parameters that smart contract needs
	// one of which will be the array of NFTs that the user is proposing the trade with
	// async function purchase() {
	// 	setLoading(true);
	// 	const tokenDetails = getMarketItem(nftToBuy);
	// 	const itemID = tokenDetails.itemId;
	// 	const tokenPrice = tokenDetails.price;
	// 	const ops = {
	// 		contractAddress: marketAddress,
	// 		functionName: purchaseItemFunction,
	// 		abi: contractABIJson,
	// 		params: {
	// 			nftContract: nftToBuy.token_address,
	// 			itemId: itemID
	// 		},
	// 		msgValue: tokenPrice
	// 	};

	// 	await contractProcessor.fetch({
	// 		params: ops,
	// 		onSuccess: () => {
	// 			console.log('success');
	// 			setLoading(false);
	// 			setVisibility(false);
	// 			updateSoldMarketItem();
	// 			succPurchase();
	// 		},
	// 		onError: (error) => {
	// 			setLoading(false);
	// 			failPurchase();
	// 		}
	// 	});
	// }

	// "succTrade"
	// function succPurchase() {
	// 	let secondsToGo = 5;
	// 	const modal = Modal.success({
	// 		title: 'Success!',
	// 		content: `You have purchased this NFT`
	// 	});
	// 	setTimeout(() => {
	// 		modal.destroy();
	// 	}, secondsToGo * 1000);
	// }

	// "failTrade"
	// function failPurchase() {
	// 	let secondsToGo = 5;
	// 	const modal = Modal.error({
	// 		title: 'Error!',
	// 		content: `There was a problem when purchasing this NFT`
	// 	});
	// 	setTimeout(() => {
	// 		modal.destroy();
	// 	}, secondsToGo * 1000);
	// }

	// async function updateSoldMarketItem() {
	// 	const id = getMarketItem(nftToBuy).objectId;
	// 	const marketList = Moralis.Object.extend('MarketItems');
	// 	const query = new Moralis.Query(marketList);
	// 	await query.get(id).then((obj) => {
	// 		obj.set('sold', true);
	// 		obj.set('owner', walletAddress);
	// 		obj.save();
	// 	});
	// }

	// const getMarketItem = (nft) => {
	// 	const result = fetchMarketItems?.find(
	// 		(e) =>
	// 			e.nftContract === nft?.token_address &&
	// 			e.tokenId === nft?.token_id &&
	// 			e.sold === false &&
	// 			e.confirmed === true
	// 	);
	// 	return result;
	// };

	return (
		<>
			{!Object.keys(networkConfigs).includes(chainId) ? (
				<>
					<Alert
						message={`OpenTrade only supports the following chains: ${supportedChains.join(
							', '
						)}`}
						type='error'
					/>
				</>
			) : (
				<div>
					{inputValue !== 'explore' &&
						!inputValue.includes('search') &&
						chainId !== '0x4' &&
						totalNFTs !== undefined && (
							<>
								{!fetchSuccess && (
									<>
										<Alert
											message='Unable to fetch all NFT metadata... We are searching for a solution, please try again later!'
											type='warning'
										/>
										<div style={{ marginBottom: '10px' }}></div>
									</>
								)}

								<div style={styles.banner}>
									<LeftOutlined
										onClick={() => {
											setInputValue('explore');
											setTokensPage(1);
										}}
										style={{
											fontSize: '20px'
										}}
									/>

									<Image
										// loading={loadingCollectionsPage}
										preview={false}
										src={NFTTokenIds[0]?.image || 'error'}
										fallback={fallbackImg}
										alt=''
										style={styles.logo}
									/>

									<div style={styles.text}>
										<>
											<div>{`${NFTTokenIds[0]?.name}`}</div>
											<div
												style={{
													fontSize: '15px',
													color: '#9c9c9c',
													fontWeight: 'normal'
												}}
											>
												Collection Size: {`${totalNFTs}`}
											</div>
										</>
									</div>
								</div>
							</>
						)}

					{inputValue !== 'explore' &&
						!inputValue.includes('search') &&
						testnetNFTs &&
						chainId === '0x4' && (
							<>
								{!fetchSuccess && (
									<>
										<Alert
											message='Unable to fetch all NFT metadata... We are searching for a solution, please try again later!'
											type='warning'
										/>
										<div style={{ marginBottom: '10px' }}></div>
									</>
								)}

								<div style={styles.banner}>
									<LeftOutlined
										onClick={() => {
											setInputValue('explore');
											setTokensPage(1);
										}}
										style={{
											fontSize: '20px'
										}}
									/>

									<Image
										// loading={loadingCollectionsPage}
										preview={false}
										src={
											networkCollections['0x4'].find(
												(collection) => collection.name === inputValue
											).image || 'error'
										}
										fallback={fallbackImg}
										alt=''
										style={styles.logo}
									/>

									<div style={styles.text}>
										<>
											<div>{`${inputValue}`}</div>
											<div
												style={{
													fontSize: '15px',
													color: '#9c9c9c',
													fontWeight: 'normal'
												}}
											>
												Collection Size: {`5`}
											</div>
										</>
									</div>
								</div>
							</>
						)}

					{inputValue !== 'explore' &&
						inputValue.includes('search') &&
						searchResults !== null && (
							<>
								<div style={styles.banner}>
									<LeftOutlined
										onClick={() => {
											setInputValue('explore');
											setTokensPage(1);
										}}
										style={{
											fontSize: '20px'
										}}
									/>

									<div style={styles.text}>
										<>
											<div>{`Seach results: ${inputValue.replace(
												'search',
												''
											)}`}</div>
										</>
									</div>
								</div>
							</>
						)}

					{inputValue === 'explore' && NFTCollections === null ? (
						<div style={styles.container}>
							<Spin size='large' />
						</div>
					) : null}

					<div style={styles.NFTs}>
						{inputValue === 'explore' &&
							NFTCollections !== null &&
							NFTCollections?.map((nft, index) => (
								<Card
									hoverable
									onClick={() => {
										if (chainId !== '0x4') {
											setInputValue(nft?.addrs);
										} else {
											setInputValue(nft?.name);
										}
									}}
									style={{
										width: 240,
										borderRadius: '10px',
										overflow: 'hidden'
									}}
									cover={
										<Image
											preview={false}
											src={nft?.image || 'error'}
											fallback={fallbackImg}
											alt=''
											style={{
												height: '240px',
												borderRadius: '10px'
											}}
										/>
									}
									key={index}
								>
									<Meta title={nft.name} />
								</Card>
							))}

						{inputValue !== 'explore' &&
							chainId !== '0x4' &&
							!inputValue.includes('search') &&
                            // inputValue !== '0x51ac4a13054d5d7e1fa795439821484177e7e828' &&
                            // NFTTokenIds.length > 0 &&
							NFTTokenIds.slice(0, 20 * tokensPage).map((nft, index) => (
								<Card
									hoverable
									// loading={loadingCollectionsPage}
									actions={[
										<Tooltip title='View On Blockexplorer'>
											<FileSearchOutlined
												onClick={() =>
													window.open(
														`${getExplorer(chainId)}address/${
															nft.token_address
														}`,
														'_blank'
													)
												}
											/>
										</Tooltip>,
										<Tooltip title='Trade for NFT'>
											<SwapOutlined
												onClick={async () => {
													setNftRequested(nft);
													setVisibility(true);
												}}
											/>
										</Tooltip>
									]}
									style={{
										width: 240,
										borderRadius: '10px',
										overflow: 'hidden'
									}}
									cover={
										<Image
											// loading={loadingCollectionsPage}
											preview={false}
											src={nft.image || 'error'}
											fallback={fallbackImg}
											alt=''
											style={{
												height: '240px',
												borderRadius: '10px'
											}}
										/>
									}
									key={index}
								>
									{/* {getMarketItem(nft) && (
                                            <Badge.Ribbon
                                                text="Buy Now"
                                                color="green"
                                            ></Badge.Ribbon>
                                        )} */}
									<Meta title={nft.name} description={`#${nft.token_id}`} />
								</Card>
							))}

                        {
                        // inputValue === '0x51ac4a13054d5d7e1fa795439821484177e7e828' &&
						// 	revvNFTs[inputValue].map((nft, index) => (
						// 		<Card
						// 			hoverable
						// 			// loading={loadingCollectionsPage}
						// 			actions={[
						// 				<Tooltip title='View On Blockexplorer'>
						// 					<FileSearchOutlined
						// 						onClick={() =>
						// 							window.open(
						// 								`${getExplorer(chainId)}address/${
						// 									nft.token_address
						// 								}`,
						// 								'_blank'
						// 							)
						// 						}
						// 					/>
						// 				</Tooltip>,
						// 				<Tooltip title='Trade for NFT'>
						// 					<SwapOutlined
						// 						onClick={async () => {
						// 							setNftRequested(nft);
						// 							setVisibility(true);
						// 						}}
						// 					/>
						// 				</Tooltip>
						// 			]}
						// 			style={{
						// 				width: 240,
						// 				borderRadius: '10px',
						// 				overflow: 'hidden'
						// 			}}
						// 			cover={
						// 				<Image
						// 					// loading={loadingCollectionsPage}
						// 					preview={false}
						// 					src={nft.image || 'error'}
						// 					fallback={fallbackImg}
						// 					alt=''
						// 					style={{
						// 						height: '240px',
						// 						borderRadius: '10px'
						// 					}}
						// 				/>
						// 			}
						// 			key={index}
						// 		>
						// 			{/* {getMarketItem(nft) && (
                        //                     <Badge.Ribbon
                        //                         text="Buy Now"
                        //                         color="green"
                        //                     ></Badge.Ribbon>
                        //                 )} */}
						// 			<Meta title={nft.name} description={`#${nft.token_id}`} />
						// 		</Card>
						// 	))
                            }

						{inputValue !== 'explore' &&
							chainId === '0x4' &&
							!inputValue.includes('search') &&
							testnetNFTs[inputValue].map((nft, index) => (
								<Card
									hoverable
									// loading={loadingCollectionsPage}
									actions={[
										<Tooltip title='View On Blockexplorer'>
											<FileSearchOutlined
												onClick={() =>
													window.open(
														`${getExplorer(chainId)}address/${
															nft.token_address
														}`,
														'_blank'
													)
												}
											/>
										</Tooltip>,
										<Tooltip title='Trade for NFT'>
											<SwapOutlined
												onClick={async () => {
													setNftRequested(nft);
													setVisibility(true);
												}}
											/>
										</Tooltip>
									]}
									style={{
										width: 240,
										borderRadius: '10px',
										overflow: 'hidden'
									}}
									cover={
										<Image
											// loading={loadingCollectionsPage}
											preview={false}
											src={nft.image || 'error'}
											fallback={fallbackImg}
											alt=''
											style={{
												height: '240px',
												borderRadius: '10px'
											}}
										/>
									}
									key={index}
								>
									{/* {getMarketItem(nft) && (
                                            <Badge.Ribbon
                                                text="Buy Now"
                                                color="green"
                                            ></Badge.Ribbon>
                                        )} */}
									<Meta title={nft.name} description={`#${nft.token_id}`} />
								</Card>
							))}

						{inputValue !== 'explore' &&
							inputValue.includes('search') &&
							searchResults.slice(0, 20 * tokensPage).map((nft, index) => (
								<Card
									hoverable
									// loading={loadingCollectionsPage}
									actions={[
										<Tooltip title='View On Blockexplorer'>
											<FileSearchOutlined
												onClick={() =>
													window.open(
														`${getExplorer(chainId)}address/${
															nft.token_address
														}`,
														'_blank'
													)
												}
											/>
										</Tooltip>,
										<Tooltip title='Trade for NFT'>
											<SwapOutlined
												onClick={async () => {
													setNftRequested(nft);
													setVisibility(true);
												}}
											/>
										</Tooltip>
									]}
									style={{
										width: 240,
										borderRadius: '10px',
										overflow: 'hidden'
									}}
									cover={
										<Image
											// loading={loadingCollectionsPage}
											preview={false}
											src={nft.image || 'error'}
											fallback={fallbackImg}
											alt=''
											style={{
												height: '240px',
												borderRadius: '10px'
											}}
										/>
									}
									key={index}
								>
									{/* {getMarketItem(nft) && (
                                            <Badge.Ribbon
                                                text="Buy Now"
                                                color="green"
                                            ></Badge.Ribbon>
                                        )} */}
									<Meta title={nft.name} description={`#${nft.token_id}`} />
								</Card>
							))}
					</div>

					{(chainId === '0x1' && inputValue === 'explore') ||
					(chainId === '0x89' && inputValue !== 'explore') ? (
						<div style={styles.container}>
							<Button
								type='primary'
								loading={loadingCollections}
								onClick={loadMoreBtn}
							>
								Load more
							</Button>
						</div>
					) : null}

					<Modal
						title={
							chainId === '0x4'
								? `Trade for ${inputValue} ${nftRequested?.name}`
								: `Trade for ${nftRequested?.name} #${nftRequested?.token_id}`
						}
						visible={visible}
						onCancel={() => setVisibility(false)}
						onOk={initiateTrade}
						okButtonProps={{ loading: loadingTrade }}
						okText='Trade'
						width={1000}
					>
						<div style={styles.containerModal}>
							<div style={{ flex: 1, maxWidth: '470px' }}>
								<Layout>
									<Header
										style={{
											background: '#f0f2f5',
											paddingTop: 25,
											paddingLeft: 50,
											height: 100
										}}
									>
										<Title level={5}>Your NFT collection</Title>
									</Header>
									<Content>
										<div style={styles.NFTsModal}>
											{yourNfts !== null &&
												yourNfts !== [] &&
												yourNfts.length !== 0 &&
												yourNfts.map((nft, index) => (
													<Card
														onClick={() => {
															let key =
																nft.token_address + nft.token_id;
                                                            let typeStd;
                                                            if (nft.contract_type.includes('20')) {
                                                                typeStd = "0x90b7cf88476cc99D295429d4C1Bb1ff52448abeE"
                                                            } else if (nft.contract_type.includes('721')) {
                                                                typeStd = "0x58874d2951524F7f851bbBE240f0C3cF0b992d79"
                                                            } else if (nft.contract_type.includes('1155')) {
                                                                typeStd = "0xEDfdd7266667D48f3C9aB10194C3d325813d8c39"
                                                            }
															let swapStruct = {
																dapp: nft.token_address,
																typeStd: typeStd,
																tokenId: [nft.token_id],
																blc: ["1"],
																data: new Int8Array()
															};
															if (
																Object.keys(nftsOffered).includes(
																	key
																)
															) {
																let temp = delete nftsOffered[key];
																setNftsOffered(temp);
															} else {
																setNftsOffered((prevObj) => ({
																	...prevObj,
																	[key]: swapStruct
																}));
															}
														}}
														hoverable
														style={{
															width: '140px',
															borderRadius: '10px',
															overflow: 'hidden',
															background: Object.keys(
																nftsOffered
															).includes(
																nft.token_address.concat(
																	nft.token_id
																)
															)
																? '#4391f7'
																: '#fff',
															borderWidth: Object.keys(
																nftsOffered
															).includes(
																nft.token_address.concat(
																	nft.token_id
																)
															)
																? '2px'
																: '0px',
															borderColor: Object.keys(
																nftsOffered
															).includes(
																nft.token_address.concat(
																	nft.token_id
																)
															)
																? '#4391f7'
																: '#f0f2f5'
														}}
														cover={
															<Image
																preview={false}
																src={nft.image || 'error'}
																fallback={fallbackImg}
																alt=''
																style={{
																	height: '150px',
																	borderRadius: '10px'
																}}
															/>
														}
														key={index}
													>
														<Meta
															title={nft.name}
															description={
																nft.token_id.length > 6
																	? `#${nft.token_id.slice(
																			0,
																			5
																	  )}...`
																	: `#${nft.token_id}`
															}
														/>
													</Card>
												))}
										</div>
									</Content>
								</Layout>
							</div>
							<div style={{ flex: 1, maxWidth: '470px' }}>
								<Layout>
									<Header
										style={{
											background: '#f0f2f5',
											paddingTop: 25,
											paddingLeft: 50,
											height: 100
										}}
									>
										<Title level={5}>
											{chainId === '0x4'
												? `${inputValue} ${nftRequested?.name} owner's NFT collection`
												: `${nftRequested?.name} #${nftRequested?.token_id} owner's NFT collection`}
										</Title>
									</Header>
									<Content>
										<div style={styles.NFTsModal}>
											{nftRequestedOwnerNfts !== null &&
												nftRequestedOwnerNfts !== [] &&
												nftRequestedOwnerNfts.length !== 0 &&
												nftRequestedOwnerNfts.map((nft, index) => (
													<Card
														onClick={() => {
															let key =
																nft.token_address + nft.token_id;
                                                            let typeStd;
                                                            if (nft.contract_type.includes('20')) {
                                                                typeStd = "0x90b7cf88476cc99D295429d4C1Bb1ff52448abeE"
                                                            } else if (nft.contract_type.includes('721')) {
                                                                typeStd = "0x58874d2951524F7f851bbBE240f0C3cF0b992d79"
                                                            } else if (nft.contract_type.includes('1155')) {
                                                                typeStd = "0xEDfdd7266667D48f3C9aB10194C3d325813d8c39"
                                                            }
                                                            let swapStruct = {
                                                                dapp: nft.token_address,
                                                                typeStd: typeStd,
                                                                tokenId: [nft.token_id],
                                                                blc: ["1"],
                                                                data: new Int8Array()

                                                            };
															if (
																Object.keys(nftsRequested).includes(
																	key
																)
															) {
																let temp =
																	delete nftsRequested[key];
																setNftsRequested(temp);
															} else {
																setNftsRequested((prevObj) => ({
																	...prevObj,
																	[key]: swapStruct
																}));
															}
														}}
														hoverable
														style={{
															width: '140px',
															borderRadius: '10px',
															overflow: 'hidden',
															background: Object.keys(
																nftsRequested
															).includes(
																nft.token_address.concat(
																	nft.token_id
																)
															)
																? '#4391f7'
																: '#fff',
															borderWidth: Object.keys(
																nftsRequested
															).includes(
																nft.token_address.concat(
																	nft.token_id
																)
															)
																? '2px'
																: '0px',
															borderColor: Object.keys(
																nftsRequested
															).includes(
																nft.token_address.concat(
																	nft.token_id
																)
															)
																? '#4391f7'
																: '#f0f2f5'
														}}
														cover={
															<Image
																preview={false}
																src={nft.image || 'error'}
																fallback={fallbackImg}
																alt=''
																style={{
																	height: '150px',
																	borderRadius: '10px'
																}}
															/>
														}
														key={index}
													>
														<Meta
															title={nft.name}
															description={
																nft.token_id.length > 6
																	? `#${nft.token_id.slice(
																			0,
																			5
																	  )}...`
																	: `#${nft.token_id}`
															}
														/>
													</Card>
												))}
										</div>
									</Content>
								</Layout>
							</div>
						</div>
					</Modal>
				</div>
			)}
		</>
	);
}

export default NFTTokenIds;
