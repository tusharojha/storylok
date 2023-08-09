import Head from 'next/head'
import ChainLogo from '@/components/ChainLogo';

import '../styles/Home.module.css';

export default function Home() {
  return <>
    <Head>
      <title>Storylok | Explore the world unkown to others | GenAI x NFT Based Game</title>
      <meta name="description" content="World's first Generative AI based NFT Game in which player emerses themselves into text-based storyline and take decisions to progress on-chain." />
      <link rel="icon" href="/favicon.png" />
    </Head>
    <div className='flex flex-col flex-1 h-screen justify-center items-center'>
      <div className='flex flex-1 justify-center items-center flex-col'>
        <h1 className='text-4xl font-bold text-black leading-relaxed'>Unleash Your Imagination, Forge Your Storyline, Collect NFT Memories!</h1>
        <h2 className='text-xl text-black font-bold flex flex-row items-center mt-2'>
          powered by the OP stack
          <div className='ml-2 flex flex-row'>
            <ChainLogo accentColor='#FE051F' alt="OP" src="/logos/op.png" />
            <ChainLogo accentColor='#3979FB' alt="Base" src="/logos/base.png" />
            <ChainLogo accentColor='#334067' alt="Zora" src="/logos/zora.png" />
            <ChainLogo accentColor='#DFFE00' alt="Mode" src="/logos/mode.svg" />
          </div>
        </h2>
      </div>
    </div>
  </>
}
