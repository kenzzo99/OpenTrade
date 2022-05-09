# Ideas

## Explore page

### Feed:

-   Need a back button to return to explore page after you decide to browse a particular collection
-   Right now when you select a collection to browse it hits the `getAllTokenIds` endpoint once in the `useNFTTokenIds` hook and fetches all (or 500) of the NFTs in the collection and displays them in groups of 20. Should rather hit the `getAllTokenIds` with `limit` and `offset` arguments and actually do pagination. Should return NFTs in order of `tokenId`.

### Trade interface:

-   All of the buy functions should be replaced with their trade equivalents
-   When the user decides to trade for an NFT a modal must display the users NFTs and ERC20 balance on left and the other address's NFTs on the right
    -   User must be able to propose a trade with any combination of NFTs and ERC20 tokens
-   Must display values in appropriate currency of all NFTs

## Your Trades page (to replace Your Transactions page):

-   Must display past, pending and cancelled trades
-   Pending trades that you suggested will be transactions with the trade smart contract with your address as sender
-   Pending trades that have been proposed to you will will be transactions with the trade smart contract containing your address (but not as sender)
-   This is where user can cancel pending trades

## Search bar

-   Update search function to hit appropriate endpoint and change results accordingly
    -   There is a search NFT hook
    -   Will need to temporarily store collections that have been fetched (`NFTCollections` pre-search) in a variable and replace `NFTCollections` with the results

## Smart contracts

-   Connect to appropriate smart contracts
-   Need to work out

## Misc

-   When browsing a collection, if you return to explore and then select another collection it temporarily shows previous collection

(In general should try to show loading states)
