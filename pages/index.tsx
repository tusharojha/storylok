import Head from 'next/head'
import Marquee from "react-fast-marquee";
import ChainLogo from '@/components/ChainLogo';

import '../styles/Home.module.css';
import GameCard from '@/components/GameCard';

export default function Home() {
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
          powered by the OP stack
          <div className='ml-2 flex flex-row'>
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
        <GameCard />
        <GameCard />
        <GameCard />
        <GameCard />
        <GameCard />
        <GameCard />
      </Marquee>
    </div>
  </>
}
