import Head from 'next/head'
import Marquee from "react-fast-marquee";
import Modal from 'react-modal';

import '../styles/Home.module.css';
import GameCard from '@/components/GameCard';
import Dashboard from '@/components/Dashboard/Dashboard';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { fetchLatestNfts } from '@/components/helpers/contract';
import { loks } from '@/components/Gameplay/loks.json'
import Image from 'next/image'
import { useRouter } from 'next/router';
import { useAccount } from '@particle-network/connect-react-ui';

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#modal');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    filter: 'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))',
    zIndex: 100,
    overflow: 'hidden'
  },
};

export default function Home() {
  const { publicKey: account } = useWallet()
  const [nfts, setNfts] = useState<any[]>([])
  const [modalIsOpen, setIsOpen] = useState(false);
  const [startGame, setStartGame] = useState(false);

  const { push } = useRouter()

  function getRandomElementsFromArray(arr: any[], numberOfElements: number): any[] {
    let shuffledArray = arr.slice(); // Create a copy of the original array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      // Shuffle the array using Fisher-Yates algorithm
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray.slice(0, numberOfElements); // Return the first numberOfElements elements from the shuffled array
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    // Fetch NFTs.
    const fetchNfts = async () => {
      const nfts = await fetchLatestNfts()
      setNfts(nfts ?? [])
    }
    fetchNfts()
  }, [])

  useEffect(() => {
    console.log('a', account)

    const isNotLoggedIn = account == null
    setIsOpen(!isNotLoggedIn)
  }, [account])

  const startRandomGame = () => {
    setStartGame(true)
  }

  const startCustomGame = (title: string) => {
    push(`/lok/${title}`)
  }

  const loka = getRandomElementsFromArray(loks, 4)

  if (startGame) return <Dashboard />

  return <>
    <Head>
      <title>Storylok | Explore the world unkown to others | GenAI x NFT Based Game</title>
      <meta name="description" content="World's first Generative AI based NFT Game in which player emerses themselves into text-based storyline and take decisions to progress on-chain." />
      <link rel="icon" href="/favicon.png" />
    </Head>
    <div className='flex flex-col flex-1 h-[70vh] justify-center items-center'>
      <div className='flex flex-1 justify-center items-center flex-col'>
        <h1 className='text-4xl font-bold text-center text-black leading-relaxed'>Unleash Your Imagination, Forge Your Storyline, Collect NFT Memories!</h1>
        <h2 className='text-xl text-black font-bold flex flex-row items-center justify-center mt-2'>
          powered by GenAI & <span><img className="mb-2 mx-0" alt="NFT Image" height={50} width={150} src={'/logos/solana.png'} /></span>
        </h2>
      </div>
    </div>

    {/* Carousel of NFTs */}
    <div className='flex flex-row place-content-evenly z-0'>
      <Marquee style={{ overflowY: 'hidden', position: 'relative', zIndex: 0 }} className='flex flex-2' pauseOnHover>
        {nfts.map((item: any) => {
          return <GameCard tokenId={item.id} title={item.name} nftImage={item.image} chain='optimism' address={item.ownerAddress} />
        })}
      </Marquee>
    </div>
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="NFT Modal"
      shouldCloseOnOverlayClick={false}
    >
      <h1 className='text-2xl font-bold'>Pick a Storylok</h1>
      <div className='flex md:flex-row flex-col'>
        <div className='flex flex-1 justify-center items-center md:border-r-2 mr-2'>
          <div onClick={startRandomGame} className="font-bold hover:bg-gray-100 md:text-xl text-md md:my-0 my-4 rounded-xl p-4 border-2 cursor-pointer">
            Start Random ⚡️
          </div>
        </div>
        <div className='flex flex-1 flex-col justify-center items-center'>
          <div className='flex flex-row flex-1 w-full'>
            {loka.slice(0, 2).map((lok) => {
              return <div onClick={() => startCustomGame(lok.title)} className="cursor-pointer duration-500 hover:opacity-60 relative mr-2 flex flex-1 flex-col">
                <Image className='aboslute boxNoColor box1' alt={'A Storylok'} height="300" width="300" src={'/banners/' + lok.image ?? ''} />
                <div className='absolute text-white text-lg top-0 left-0 w-full h-full flex flex-1 justify-center items-center'>
                  <h1 className='drop-shadow-md text-xl text-center font-bold'>{lok.title}</h1>
                </div>
              </div>
            })}
          </div>
          <div className='flex flex-row flex-1 w-full mt-2'>
            {loka.slice(2, 4).map((lok) => {
              return <div onClick={() => startCustomGame(lok.title)} className="cursor-pointer duration-500 hover:opacity-60 relative mr-2 flex flex-1 flex-col">
                <Image className='aboslute boxNoColor box1' alt={'A Storylok'} height="300" width="300" src={'/banners/' + lok.image ?? ''} />
                <div className='absolute text-white text-lg top-0 left-0 w-full h-full flex flex-1 justify-center items-center'>
                  <h1 className='drop-shadow-md text-xl text-center font-bold'>{lok.title}</h1>
                </div>
              </div>
            })}
          </div>
        </div>
      </div>
    </Modal>
  </>
}
