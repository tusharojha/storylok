'use client'

import Head from "next/head";
import { Fragment, useEffect, useRef, useState } from "react";
import { continueStory, createImage, createImagePrompt, getImageData, startNewStory } from "../helpers/story";
import { ChatMessage } from "../helpers/types";
import Modal from 'react-modal';
import { mintNftOnWallet, prepareNftMetadata } from "../helpers/contract";
import { NFTStorage } from 'nft.storage'
import { useWallet } from "@solana/wallet-adapter-react";
import * as ed from '@noble/ed25519'
import { sha512 } from "@noble/hashes/sha512";
ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

const controls = ['A', 'B', 'C']

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#modal');

export default function Gameplay() {

  const { publicKey, disconnect, signMessage } = useWallet()

  const [pageNumber, setPageNumber] = useState(0)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [userCommand, setUserCommand] = useState('')
  const [base64Image, setBase64Image] = useState('')
  const [imageIpfs, setImageIpfs] = useState('')
  const [conversation, setConversation] = useState<ChatMessage[]>([])
  const [modalIsOpen, setIsOpen] = useState(false);

  const [mint, setMint] = useState()
  const [options, setOptions] = useState([])
  const [baseline, setBaseline] = useState(
    {
      title: '',
      message: '',
      summary: ''
    }
  )

  useEffect(() => {
    function handleKeyDown(e: any) {
      console.log(e.key, options.length);

      switch (e.key.toString().toUpperCase()) {
        case controls[0]:
          console.log('hi')
          if (options.length < 1) break;
          takeActionWithPrompt(options[0])
          break;
        case controls[1]:
          if (options.length < 2) break;
          takeActionWithPrompt(options[1])
          break;
        case controls[2]:
          if (options.length < 3) break;
          takeActionWithPrompt(options[2])
          break;
      }

    }

    document.addEventListener('keydown', handleKeyDown);

    // Don't forget to clean up
    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [options]);

  async function openModal() {
    setLoading(true)
    await generateImage()
    setLoading(false)
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }


  const divRef = useRef(null);

  const mintNftOnChain = async () => {
    if (!publicKey || loading) return;
    try {
      setLoading(true)

      // Request message signing from the user.
      // `publicKey` will be null if the wallet isn't connected
      if (!publicKey) throw new Error('Wallet not connected!');
      // `signMessage` will be undefined if the wallet doesn't support it
      if (!signMessage) throw new Error('Wallet does not support message signing!');
      // Encode anything as bytes
      const msg = 'You are authenticating to mint the Storylok NFT on your wallet.'
      const message = new TextEncoder().encode(msg);
      // Sign the bytes using the wallet
      const signature = await signMessage(message);
      // Verify that the bytes were signed using the private key that matches the known public key
      if (!ed.verify(signature, message, publicKey.toBytes())) throw new Error('Invalid signature!');


      // Prepare NFT Metadata.
      const data = await prepareNftMetadata(imageIpfs, baseline.title, baseline.summary)


      const mint = await mintNftOnWallet(publicKey.toString(), data.description, data.image, data.name)

      if (!mint) {
        setLoading(false)
        alert('Error minting the NFT on Wallet!')
        return;
      }

      console.log(mint)
      setMint(mint)
      alert('NFT minted successfully on Solana!')
      await disconnect()

      setLoading(false)
      closeModal()
    } catch (e: any) {
      console.log('error minting nft', e)
      if (e?.message) {
        alert(e.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    if (divRef.current) {
      (divRef.current as any).scrollTop = (divRef.current as any).scrollHeight;
    }
  };

  useEffect(() => {
    const startGame = async () => {
      setLoading(true)
      let story = await startNewStory()
      if (!story) {
        story = await startNewStory()
      }
      setLoading(false)
      if (story && story.title) {
        setBaseline({ title: story.title, summary: story.summary, message: story.message })
        setOptions(story.options)
      }
    }

    if (baseline.title == '' && baseline.message == '' && !loading)
      startGame()
  }, [])

  const takeAction = async (action?: string) => {
    // if (loading) return;
    if (userCommand.trim() == "" && !action) return;

    const userRequest = {
      role: 'user',
      content: `User takes the action: ${action ?? userCommand}

Response must be in the following JSON format:
{ 
    "message": "the story data that you generated based on user actions, should be around 350 words. Use "<br/>" tag where you want new line. Avoid using double quotes.",
    "options": ["option a", "option b", "option c"]
}
      `
    }

    const msgs = [{
      role: 'assistant',
      content: baseline.summary ?? '',
    }, ...messages, userRequest]

    console.log(msgs)
    setLoading(true)

    const response = await continueStory(msgs)

    setUserCommand('')
    console.log(response)
    setMessages([...msgs, userRequest, {
      role: 'assistant',
      content: JSON.stringify(response) ?? ''
    }])
    setConversation([
      ...conversation,
      {
        role: 'user',
        content: action ?? userCommand
      },
      {
        role: 'assistant',
        content: response.message ?? ''
      }])
    setOptions(response.options)
    setLoading(false)
    scrollToBottom()
  }

  const takeActionWithPrompt = (action: string) => {
    setUserCommand(action)
    takeAction(action)
  }

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      takeAction();
    }
  };

  const generateImage = async () => {
    try {
      const userRequest = {
        role: 'user',
        content: `Create description for the scene of this story. You must include a subject (the main focus of the visual), what the subject is doing, where, and how, along with additional descriptive words to describe the rendering's visual style, environment, weather, lighting, etc. And the description should be concise in a paragraph while capturing all the details about the surroundings to incorporate in the picture based on this story plot. You must mention all the important artifacts.  
      ensure that you show the character in the image engaging with items or doing what exactly presented in the story. Don't mention any names but always present about the main or side characters i.e. subjects.`
      }

      const msgs = [{
        role: 'assistant',
        content: baseline.message ?? '',
      }, ...conversation, userRequest]

      setUserCommand('')
      setLoading(true)

      const response = await createImagePrompt(msgs)

      console.log(response)

      if (response) {
        const data = await createImage('realistic image for ' + response)
        console.log('data', data)

        if (data) {
          const bufferData = await getImageData(data)
          console.log(bufferData['base64'])


          // Convert base64 to binary
          const binaryData = atob(bufferData['base64']);

          // Create a Uint8Array from the binary data
          const uint8Array = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            uint8Array[i] = binaryData.charCodeAt(i);
          }

          // Create a Blob from the Uint8Array
          const blob = new Blob([uint8Array], { type: 'image/png' });

          // Create a File object from the Blob
          const file = new File([blob], 'image.png', { type: 'image/png' });

          const client = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE ?? '' })

          const cfid = await client.storeBlob(file)
          setImageIpfs(cfid)
          setBase64Image('data:image/png;base64,' + bufferData['base64']);
        }
      }
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  const progress = ((conversation.length / 20) * 100)

  return <>
    <Head>
      <title>Storylok | Explore the world unkown to others | GenAI x NFT Based Game</title>
      <meta name="description" content="World's first Generative AI based NFT Game in which player emerses themselves into text-based storyline and take decisions to progress on-chain." />
      <link rel="icon" href="/favicon.png" />
    </Head>
    <div ref={divRef} className='mt-32 mx-4 flex flex-row flex-1'>
      <div className="mb-16 justify-center flex flex-col items-center flex-1">
        <div className="box box1 max-h-fit mr-4 pb-6 px-4">
          <div className="oddboxinner">
            <div className="text-justify text-lg px-4">
              <h1 className="text-2xl font-bold">{baseline.title}</h1> <br></br>
              {baseline.message.split("<br/>").map((line, index) => (
                <Fragment key={index}>
                  {line.replace("<br/>", "")}
                  <br />
                </Fragment>
              ))}
            </div>
          </div>
        </div>
        {conversation.map((i, index) => {
          if(i.role == 'user') return;
          return (
            <div className={`flex flex-1 justify-items-end items-end`}>
              <div key={i.content.slice(0, 10)} className="box box1 max-h-fit mr-4 my-4 pb-4">
                <div className="oddboxinner">
                  <div className="flex flex-1 mx-4 my-4 mt-6 text-lg rounded-lg p-4 justify-end text-[#25b09b]"><>{conversation[index - 1].content}</></div>
                  <div key={i.content.slice(0, 10)} style={{ color: i.role === 'user' ? '#25b09b' : 'black' }} className={"h-auto mx-4 mb-4 rounded-lg p-4"}>
                    <p className="text-justify text-lg">
                      {i.content.split("<br/>").map((line, index) => (
                        <Fragment key={index}>
                          {line.replace("<br/>", "")}
                          <br />
                        </Fragment>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="px-0 py-2 pb-0 flex flex-3 flex-col items-center w-[30vw]">
        <div className="box box1 max-h-fit">
          <div className="oddboxinner px-2">

            {/* Progress Bar */}
            <div className="flex flex-1 px-0 flex-row justify-between items-end mb-8">
              <div className="flex flex-1 flex-col">
                <h1 className="text-xl">Progress</h1>
                <div style={{ backgroundSize: progress + '%' }} className="progress-7"></div>
              </div>
              {progress > 0 && <div onClick={openModal} className="font-bold text-md rounded-xl p-2 border-2 cursor-pointer">
                {
                  loading ? <div className="flex flex-row">
                    <svg aria-hidden="true" className="w-6 h-6 text-white animate-spin fill-black" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                    <h1 className="ml-2">Loading</h1>
                  </div> : 'Save Game NFT'
                }
              </div>}
            </div>

            <span className="text-2xl font-bold">What's your next move?</span>
            <div className="flex flex-1 flex-col mt-4">
              {options.map((i, index) => {
                return <div onClick={() => takeActionWithPrompt(i)} className="flex flex-row items-center"> <span className="bg-[#e5e7eb] p-2 rounded-md">{controls[index]}</span> <div className="m-2 mx-0 ml-2 px-4 py-2 text-lg cursor-pointer rounded-xl text-white bg-[#25b09b]">{i}</div></div>
              })}
            </div>

            <div className="flex flex-row bg-white py-1 px-0">

              <input
                value={userCommand}
                onKeyPress={handleKeyPress}
                onChange={(e) => setUserCommand(e.target.value)}
                type="text" aria-multiline
                placeholder="do something else?"
                className="input w-full px-6 py-2 mr-2 rounded-xl border-2" />


              <button onClick={() => takeAction()} className={`rounded-full p-4 bg-[#25b09b]`}>
                {
                  loading ?
                    <svg aria-hidden="true" className="w-4 h-4 text-white animate-spin fill-black" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="#fff">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="NFT Modal"
    >
      <div className="flex w-[50vw] flex-col justify-center items-center">
        <div className="flex flex-1 flex-row justify-center items-center">
          <img className="boxNoColor box1 w-64 rounded-md" src={base64Image} alt="NFT Image" />
          <div className="text-left px-4">
            <h1 className="text-xl font-bold">{baseline.title}</h1>
            <p className="py-2 max-lines-2">{baseline.summary}</p>
            <div className="mt-2">
              {/* if there is a button in div, it will close the modal */}
              <button disabled={loading} onClick={() => mintNftOnChain()} className="font-bold text-md rounded-xl p-2 border-2 cursor-pointer">{loading ? 'loading...' : 'Mint NFT'}</button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </>
}