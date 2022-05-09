import React, { useState } from 'react';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { useMoralisDapp } from 'providers/MoralisDappProvider/MoralisDappProvider';
import { Table, Tag, Space } from 'antd';
import { PolygonCurrency } from './Chains/Logos';
import moment from 'moment';
import { getTwoToneColor } from '@ant-design/icons';
import { Card, Image, Tooltip, Modal, Badge, Alert, Spin, Button, Layout, Typography } from 'antd';
const { Meta } = Card;
const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;


const styles = {
	table: {
		margin: '0 auto',
		width: '1000px'
	}
};


function NFTMarketTransactions() {
	const { walletAddress } = useMoralisDapp();
	const { Moralis } = useMoralis();

	const fallbackImg =
		'data:image/png;base64,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';
	const [visible, setVisibility] = useState(false);
	const [swapIntent, setSwapIntent] = useState(null);
	const [yourNfts, setYourNfts] = useState(null);
	const [theirNfts, setTheirNfts] = useState(null);

	const querySwapIntents = useMoralisQuery("SwapIntent");
	
	console.log("query");
	console.log(querySwapIntents);
	console.log(querySwapIntents.data);
	if (querySwapIntents.data.length === 0){
		return (
			<>
				<div>
					
					<div>
						Unable to load trades at this time.
					</div>

				</div>
			</>
		);
	}
	const fetchSwapIntents = JSON.parse(
		JSON.stringify(querySwapIntents.data, [
			'swapId',
			'addressOne',
			'addressTwo',
			'swapStart',
			'swapEnd',
			'swapStatus',
		])
	)
	console.log("fetchswap results");
	console.log(fetchSwapIntents);
	fetchSwapIntents.map((item) => console.log(item))
	fetchSwapIntents.filter(
			(item) =>
				item.addressOne === walletAddress || item.addressTwo === walletAddress
	)
	fetchSwapIntents.sort((a, b) =>
		a.swapStart < b.swapStart ? 1 : b.swapStart < a.swapStart ? -1 : 0
	);

	function getColor(status) {
		let color = 'geekblue'
		if (status === 'Canceled') {
			color = 'volcano'
		} else if (status === 'Closed') {
			color = 'green'
		}
		return color;
	}

	function getNameOfProposed(proposed) {
		if (proposed === walletAddress) {
			return "you"
		} else {
			return proposed
		}
	}

	function getCounterpartyAddr(parties) {
		if (parties[0] === walletAddress) {
			return parties[1]
		} else {
			return parties[0]
		}
	}

	const columns = [
		{
			title: 'Date Proposed',
			dataIndex: 'date',
			key: 'date'
		},
		{
			title: 'Counterparty',
			key: 'counterparty',
			dataIndex: 'counterparty'
		},
		{
			title: 'Proposed By',
			key: 'proposed',
			dataIndex: 'proposed',
		},
		{
			title: 'Status',
			key: 'status',
			dataIndex: 'status'
		},
		{
			title: 'Swap ID',
			key: 'swapId',
			dataIndex: 'swapId'
		}
	];

	// const columns = [
	// 	{
	// 		title: 'Date Proposed',
	// 		dataIndex: 'date',
	// 		key: 'date'
	// 	},
	// 	{
	// 		title: 'Counterparty',
	// 		key: 'counterparty',
	// 		render: (parties) => (
	// 			<Space size="middle">
	// 				<span>{getCounterpartyAddr(parties)}</span>
	// 			</Space>
	// 		)
	// 	},
	// 	{
	// 		title: 'Proposed By',
	// 		key: 'proposed',
	// 		render: (proposed) => (
	// 			<Space size="middle">
	// 				<span>{getNameOfProposed(proposed)}</span>
	// 			</Space>
	// 		)
	// 	},
	// 	{
	// 		title: 'Status',
	// 		key: 'status',
	// 		dataIndex: 'status',
	// 		render: (status) => (
	// 			<Tag color={getColor(status)} key={status}>
	// 					{status.toUpperCase()}
	// 			</Tag>
	// 		)
	// 	},
	// 	{
	// 		title: 'SwapID',
	// 		key: 'swapId',
	// 		dataIndex: 'swapId',
	// 		render: (swapId) => (
	// 			<Space size="middle">
	// 				<span>{swapId}</span>
	// 			</Space>
	// 			// <Space size="middle">
	// 			// 	<span onClick={() => {
	// 			// 		setSwapIntent(swapIntent)
	// 			// 		const proposer = getNameOfProposed(swapIntent.addressOne)
	// 			// 		const theirNfts = proposer === "you" ? swapIntent.relation("nftsTwo").query() : swapIntent.relation("nftsOne").query()
	// 			// 		const yourNfts = proposer === "you" ? swapIntent.relation("nftsOne").query() : swapIntent.relation("nftsTwo").query()
	// 			// 		setTheirNfts(theirNfts)
	// 			// 		setYourNfts(yourNfts)
	// 			// 		setVisibility(true)
	// 			// 	}}>View Swap Details</span>
	// 			// </Space>
	// 		)
	// 	}
	// ];

	const data = fetchSwapIntents?.map((swapIntent, index) => ({
		key: index,
		date: moment(swapIntent.swapStart).format('DD-MM-YYYY HH:mm'),
		status: swapIntent.swapStatus,
		proposed: (swapIntent.addressOne === walletAddress ? 'You' : 'Counterparty'),
		counterparty: (swapIntent.addressOne === walletAdress ? swapIntent.addressTwo : swapIntent.addressOne),
		// details: swapIntent,
		swapId: swapIntent.swapId
	}));

	return (
		<>
			<div>
				<div style={styles.table} visible={!visible}>
					<Table columns={columns} dataSource={data} />
				</div>


			{/* <Modal
					title={data.swapId}
					visible={visible}
					onCancel={() => setVisibility(false)}
					onOk={() => setVisibility(false)}
					okText={(data.proposed !== walletAddress && data.status === 'Opened') ? 'Accept' : 'Close'}
					width={1000}
				>
					<div style={styles.containerModal}>
						<div style={{ flex: 1 }}>
							<Layout>
								<Header
									style={{
										background: '#f0f2f5',
										paddingTop: 25,
										paddingLeft: 50,
										height: 100
									}}
								>
									<Title level={5}>Your Assets to Send</Title>
								</Header>
								<Content>
									<div style={styles.NFTsModal}>
										{yourNfts !== null &&
											yourNfts !== [] &&
											yourNfts.length !== 0 &&
											yourNfts.map((nft, index) => (
												<Card
													style={{
														width: '150px',
														borderRadius: '10px',
														overflow: 'hidden',
														background: '#4391f7',
														borderWidth: '2px',
														borderColor: '#4391f7',
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
														description={`#${nft.token_id}`}
													/>
												</Card>
											))}
									</div>
								</Content>
							</Layout>
						</div>
						<div style={{ flex: 1 }}>
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
										{`NFTs to Receive`}
									</Title>
								</Header>
								<Content>
									<div style={styles.NFTsModal}>
										{theirNfts !== null &&
											theirNfts !== [] &&
											theirNfts.length !== 0 &&
											theirNfts.map((nft, index) => (
												<Card
													style={{
														width: '150px',
														borderRadius: '10px',
														overflow: 'hidden',
														background: '#4391f7',
														borderWidth: '2px',
														borderColor: '#4391f7',
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
														description={`#${nft.token_id}`}
													/>
												</Card>
											))}
									</div>
								</Content>
							</Layout>
						</div>
					</div>
				</Modal> */}
			</div>
		</>
	);
}

export default NFTMarketTransactions;
// const columns = [
// 	{
// 		title: 'Date Proposed',
// 		dataIndex: 'date',
// 		key: 'date'
// 	},
// 	{
// 		title: 'Counterparty',
// 		key: 'counterparty',
// 		dataIndex: 'parties'
// 	},
// 	{
// 		title: 'Proposed By',
// 		key: 'proposed',
// 		dataIndex: 'proposed'
// 	},
// 	{
// 		title: 'Status',
// 		key: 'status',
// 		dataIndex: 'status'
// 	},
// 	{
// 		title: 'Details',
// 		key: 'details',
// 		dataIndex: 'details'
// 	}
// ];
