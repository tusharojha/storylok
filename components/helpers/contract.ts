import * as ethers from 'ethers'
import lighthouse from '@lighthouse-web3/sdk'
import { Chain, ChainDetails, getContractAddressFromRpc } from '../ChainLogo';

export const prepareNftMetadata = async (image: string, title: string, description: string) => {
  const json = {
    name: title,
    image: `https://ipfs.io/ipfs/${image}`,
    description,
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
  return uploadResponse.data.Hash
}

export const sendTxOnChain = async (rpc: string, address: string, cid: string) => {

  // One needs to prepare the transaction data
  // Here we will be transferring ERC 20 tokens from the Smart Contract Wallet to an address
  const createNoteInterface = new ethers.Interface([
    'function safeMint(address to, string memory uri)'
  ])

  // Encode an ERC-20 token transfer to recipientAddress of the specified amount
  const encodedData = createNoteInterface.encodeFunctionData(
    'safeMint', [address, cid]
  )

  const contractAddress = getContractAddressFromRpc(rpc)

  console.log(contractAddress, rpc)
  // You need to create transaction objects of the following interface
  const tx = {
    to: contractAddress, // destination smart contract address
    data: encodedData
  }

  const provider = new ethers.JsonRpcProvider(rpc);

  const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY ?? '', provider);

  if (!wallet) return;

  // Sending gasless transaction
  const txResponse = await wallet.sendTransaction(tx);
  console.log('userOp hash', txResponse.hash);
  // If you do not subscribe to listener, one can also get the receipt like shown below 
  const txReciept = await txResponse.wait();
  console.log('Tx hash', txReciept?.hash);

  return txReciept?.hash
}