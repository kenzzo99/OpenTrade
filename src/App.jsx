import { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { BrowserRouter as Router, Switch, Route, NavLink, Redirect } from 'react-router-dom';
import Account from 'components/Account';
import Chains from 'components/Chains';
import NativeBalance from 'components/NativeBalance';
import NFTBalance from 'components/NFTBalance';
import NFTMarketTransactions from 'components/NFTMarketTransactions';
import NFTTokenIds from 'components/NFTTokenIds';
import SearchCollections from 'components/SearchCollections';

import { Menu, Layout, Typography } from 'antd';
import 'antd/dist/antd.css';
import './style.css';

const { Header, Footer } = Layout;
const { Title } = Typography;

const styles = {
	content: {
		display: 'flex',
		justifyContent: 'center',
		fontFamily: 'Roboto, sans-serif',
		color: '#041836',
		marginTop: '80px',
		padding: '10px'
	},
	header: {
		position: 'fixed',
		zIndex: 1,
		width: '100%',
		background: '#fff',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		fontFamily: 'Roboto, sans-serif',
		borderBottom: '2px solid rgba(0, 0, 0, 0.06)',
		padding: '0 10px',
		boxShadow: '0 1px 10px rgb(151 164 175 / 10%)'
	},
	headerRight: {
		display: 'flex',
		gap: '20px',
		alignItems: 'center',
		fontSize: '15px',
		fontWeight: '600'
	}
};
const App = ({ isServerInfo }) => {
	const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } = useMoralis();

	const [inputValue, setInputValue] = useState('explore');
	const [searchResults, setSearchResults] = useState('explore');

	useEffect(() => {
		if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated, isWeb3Enabled]);

	return (
		<Layout style={{ height: '100vh', overflow: 'auto' }}>
			<Router>
				<Header style={styles.header}>
					<Logo />
					<SearchCollections
						setInputValue={setInputValue}
						setSearchResults={setSearchResults}
					/>
					<Menu
						theme='light'
						mode='horizontal'
						style={{
							display: 'flex',
							fontSize: '14px',
							fontWeight: '500',
							marginLeft: '50px',
							width: '100%'
						}}
						defaultSelectedKeys={['nftMarket']}
					>
						<Menu.Item key='nftMarket' onClick={() => setInputValue('explore')}>
							<NavLink to='/NFTMarketPlace'>🔎 Explore</NavLink>
						</Menu.Item>
						<Menu.Item key='nft'>
							<NavLink to='/nftBalance'>🖼 Your NFTs</NavLink>
						</Menu.Item>
						<Menu.Item key='transactions'>
							<NavLink to='/Transactions'>📈 Your Trades</NavLink>
						</Menu.Item>
					</Menu>
					<div style={styles.headerRight}>
						<Chains />
						<NativeBalance />
						<Account />
					</div>
				</Header>
				<div style={styles.content}>
					<Switch>
						<Route path='/nftBalance'>
							<NFTBalance />
						</Route>
						<Route path='/NFTMarketPlace'>
							<NFTTokenIds
								inputValue={inputValue}
								setInputValue={setInputValue}
								searchResults={searchResults}
								setSearchResults={setSearchResults}
							/>
						</Route>
						<Route path='/Transactions'>
							<NFTMarketTransactions />
						</Route>
					</Switch>
					<Redirect to='/NFTMarketPlace' />
				</div>
			</Router>
			{/* <Footer style={{ textAlign: "center" }}>
      </Footer> */}
		</Layout>
	);
};

export const Logo = () => (
	<div
		style={{
			display: 'flex',
			alignContent: 'center',
			paddingTop: 10,
			paddingLeft: 10
		}}
	>
		<Title level={3}>OpenTrade</Title>
	</div>
);

export default App;
