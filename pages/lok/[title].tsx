import Head from 'next/head'
import Marquee from "react-fast-marquee";
import Modal from 'react-modal';

import '../../styles/Home.module.css';
import GameCard from '@/components/GameCard';
import Dashboard from '@/components/Dashboard/Dashboard';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { fetchLatestNfts } from '@/components/helpers/contract';
import { loks } from '@/components/Gameplay/loks.json'
import Image from 'next/image'
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Gameplay from '@/components/Gameplay/Gameplay';

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

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export default function Home() {
  const { query } = useRouter()

  const { title } = query

  const { publicKey } = useWallet()

  const [lok, setLok] = useState<string>('')
  const [nfts, setNfts] = useState<any[]>([])
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isInvalid, setIsInvalid] = useState(true);

  const isLoggedIn = publicKey != null

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
    if (!isLoggedIn) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
    console.log(isLoggedIn)
  }, [isLoggedIn])


  useEffect(() => {
    // Find item from title.
    const lok = loks.find((item) => item.title === title)

    console.log('finding here', lok)
    if (lok) {
      setIsInvalid(false)

      setLok(lok.plot)
    }
  }, [isLoggedIn])

  console.log('is', isLoggedIn && !isInvalid)

  if (isLoggedIn && !isInvalid) return <>
    <Gameplay plot={lok} />
  </>

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
      <h1 className='text-2xl font-bold mb-4 text-center'>Please Login via Phantom Wallet</h1>
      <p className='text-lg mb-4 text-center'>We will be able to mint the NFT on Game Completion<br></br> to your wallet as a Memory from this World.</p>
      <div className='flex flex-1 w-full justify-center'>
        <WalletMultiButtonDynamic />
      </div>
    </Modal>
  </>
}
