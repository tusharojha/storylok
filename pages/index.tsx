import Head from 'next/head'
import Marquee from "react-fast-marquee";
import ChainLogo from '@/components/ChainLogo';

import '../styles/Home.module.css';
import GameCard from '@/components/GameCard';
import { useAccount, useNetwork } from 'wagmi';
import Dashboard from '@/components/Dashboard/Dashboard';

export default function Home() {

  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()

  console.log('chain', chain?.rpcUrls.default)

  const isLoggedIn = isConnected && address

  if (isLoggedIn) {
    return <Dashboard />
  }

  return <>
    <Head>
      <title>Storylok | Explore the world unkown to others | GenAI x NFT Based Game</title>
      <meta name="description" content="World's first Generative AI based NFT Game in which player emerses themselves into text-based storyline and take decisions to progress on-chain." />
      <link rel="icon" href="/favicon.png" />
    </Head>
    <div className='flex flex-col flex-1 h-[70vh] justify-center items-center'>
      <div className='flex flex-1 justify-center items-center flex-col'>
        <h1 className='text-4xl font-bold text-center text-black leading-relaxed'>Unleash Your Imagination, Forge Your Storyline, Collect NFT Memories!</h1>
        <h2 className='text-xl text-black font-bold flex flex-row items-center mt-2'>
          powered by GenAI & Web3
          <div className='ml-2 flex flex-row'>
            <ChainLogo chain='astarTestnet' />
            <ChainLogo chain='optimism' />
            <ChainLogo chain='base' />
            <ChainLogo chain='zora' />
            <ChainLogo chain='mode' />
          </div>
        </h2>
      </div>
    </div>

    {/* Carousel of NFTs */}
    <div className='flex flex-row place-content-evenly'>
      <Marquee style={{ overflowY: 'hidden' }} className='flex flex-2' pauseOnHover>
        <GameCard tokenId='3' title='Nightmare in the Abandoned Lab' nftImage='https://i.seadn.io/gcs/files/f36b3ccf9c1b06c548946cbf6cb89126.png' chain='optimism' address='0x1422789cE590Bdc6724C0B24A495327f1a214000' />
        <GameCard tokenId='1' title='The Haunting Symphony' nftImage='https://i.seadn.io/gcs/files/01c35b44653484221393a55807b4cb95.png' chain='zora' address='0x1422789cE590Bdc6724C0B24A495327f1a214000' />
        <GameCard tokenId='2' title='The Haunting at Ravenwood Manor' nftImage='https://i.seadn.io/gcs/files/e958ff88564197419337e0c9806fe858.png' chain='optimism' address='0x1422789cE590Bdc6724C0B24A495327f1a214000' />
        <GameCard tokenId='1' title='The Abandoned Laboratory' nftImage='https://i.seadn.io/gcs/files/1d5b01a095a216ce5f62b9b2258fb8c9.png' chain='base' address='0x1422789cE590Bdc6724C0B24A495327f1a214000' />
        <GameCard tokenId='2' title='The Haunting at Blackwood Manor' nftImage='https://i.seadn.io/gcs/files/5a48da9483ab920acc90ca56cfde54b7.png' chain='base' address='0x1422789cE590Bdc6724C0B24A495327f1a214000' />
      </Marquee>
    </div>
  </>
}
