// import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
// import { useEffect, useState } from "react";
// import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";

// export const useFetchNFTs = (addr) => {
//     const { account } = useMoralisWeb3Api();
//     const { chainId } = useMoralisDapp();
//     const [addrNFTs, setAddrNFTs] = useState([]);

//     // get NFTs for address
//     const options = {
//         chain: chainId,
//         address: addr,
//     };

//     const {
//         fetch: getNFTs,
//         data,
//         error,
//         isLoading,
//     } = useMoralisWeb3ApiCall(account.getNFTs, { ...options });

//     useEffect(() => data && setAddrNFTs(data?.result), [data]);

//     return { getNFTs, addrNFTs, error, isLoading };
// };
