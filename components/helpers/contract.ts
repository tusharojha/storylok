import * as ethers from 'ethers'
import lighthouse from '@lighthouse-web3/sdk'
import { Chain, ChainDetails, getContractAddressFromRpc } from '../ChainLogo';
import axios from 'axios';
import { ChatMessage } from './types';

const token = process.env.NEXT_PUBLIC_UNDERDOG_NFT

export const fetchNft = async (id: string) => {

  const options = {
    method: 'GET',
    url: `https://mainnet.underdogprotocol.com/v2/projects/1/nfts/${id}`,
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${token}`
    }
  };

  try {
    const res = await axios(options)
    console.log(res)

    if (res.status === 200) {
      return res.data;
    }
    return null;
  } catch (e) {
    console.log(e)
    return null;
  }
}

export const fetchLatestNfts = async () => {

  const options = {
    method: 'GET',
    url: 'https://mainnet.underdogprotocol.com/v2/projects/1/nfts',
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${token}`
    }
  };

  try {
    const res = await axios(options)
    console.log(res)

    if (res.status === 200) {
      return res.data.results;
    }
    return null;
  } catch (e) {
    console.log(e)
    return null;
  }
}

export const mintNftOnWallet = async (reciever: string, description: string, image: string, title: string, hash: string) => {
  const mintOptions = {
    method: 'post',
    url: 'https://mainnet.underdogprotocol.com/v2/projects/1/nfts',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    data: {
      name: title,
      symbol: 'SNC',
      description: description,
      image: image,
      externalUrl: 'https://storylok.xyz',
      receiverAddress: reciever,
      attributes: { conversation: hash }
    }
  };
  try {
    const res = await axios(mintOptions)
    console.log(res.status)

    if (res.status === 202) {
      return res.data;
    }
    return null;
  } catch (e) {
    console.log(e)
    return null;
  }
}

export const prepareNftMetadata = async (image: string, title: string, description: string, message: string, conversation: ChatMessage[]) => {
  const json = {
    name: title,
    image: `https://ipfs.io/ipfs/${image}`,
    description,
    message,
    conversation,
    attributes: [
      {
        "trait_type": "Game Version",
        "value": "0.1"
      },
    ]
  }

  console.log(JSON.stringify(json))
  const uploadResponse = await lighthouse.uploadText(JSON.stringify(json), process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY ?? '', 'nft.json'); // path, apiKey

  console.log(uploadResponse)
  return { hash: uploadResponse.data.Hash, json }
}
