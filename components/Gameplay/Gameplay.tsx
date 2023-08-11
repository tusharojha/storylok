import Head from "next/head";
import { Fragment, useEffect, useRef, useState } from "react";
import { continueStory, createImage, createImagePrompt, startNewStory } from "../helpers/story";
import { ChatMessage } from "../helpers/types";
import lighthouse from '@lighthouse-web3/sdk'
import axios from "axios";

export default function Gameplay() {

  const [loading, setLoading] = useState(false)
  const [userCommand, setUserCommand] = useState('')
  const [base64Image, setBase64Image] = useState('')
  const [imageIpfs, setImageIpfs] = useState('')
  const [conversation, setConversation] = useState<ChatMessage[]>([])
  const [baseline, setBaseline] = useState(
    {
      title: '',
      message: '',
      summary: ''
    }
  )

  const divRef = useRef(null);

  const scrollToBottom = () => {
    if (divRef.current) {
      (divRef.current as any).scrollTop = (divRef.current as any).scrollHeight;
    }
  };

  useEffect(() => {
    const startGame = async () => {
      setLoading(true)
      const story = await startNewStory()
      setLoading(false)
      setBaseline({ title: story.title, summary: story.summary, message: story.message })
    }

    if (baseline.title == '' && baseline.message == '' && !loading)
      startGame()
  }, [])

  const takeAction = async () => {
    if (loading) return;
    if (userCommand.trim() == "") return;

    const userRequest = {
      role: 'user',
      content: userCommand
    }

    const msgs = [{
      role: 'assistant',
      content: baseline.summary ?? '',
    }, ...conversation, userRequest]

    setUserCommand('')
    setLoading(true)

    const response = await continueStory(msgs)

    console.log(response)
    setConversation([...conversation, userRequest, {
      role: 'assistant',
      content: response ?? ''
    }])
    setLoading(false)
    scrollToBottom()
  }

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      takeAction();
    }
  };

  async function getImageData(url: string) {
    try {
      const response = await axios.post('/api/getImage', {
        url: url
      });
      console.log('response', response.data)
      console.log(response.data);
      return response.data
    } catch (error) {
      console.error('Error fetching file:', error);
    }
  }

  const generateImage = async () => {
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
      const data = await createImage('digital artwork for ' + response)
      console.log('data', data)

      if (data) {
        const bufferData = await getImageData(data)
        console.log(bufferData['base64'])
        const uploadResponse = await lighthouse.uploadText('data:image/png;base64,' + bufferData['base64'], process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY ?? ''); // path, apiKey

        console.log(uploadResponse)
        setImageIpfs(uploadResponse.data.Hash)
        setBase64Image('data:image/png;base64,' + bufferData['base64']);
        (window as any).nft_modal.showModal()
      }
    }

    setLoading(false)
  }

  return <>
    <Head>
      <title>Storylok | Explore the world unkown to others | GenAI x NFT Based Game</title>
      <meta name="description" content="World's first Generative AI based NFT Game in which player emerses themselves into text-based storyline and take decisions to progress on-chain." />
      <link rel="icon" href="/favicon.png" />
    </Head>
    <div className='mt-32 mx-4 flex flex-col flex-1 bg-red justify-end items-center'>
      <div className="flex flex-1 w-2/3 px-4 flex-row justify-between items-end mb-2">
        <div className="flex flex-1 flex-col">
          <h1 className="text-xl">Progress</h1>
          <div style={{ backgroundSize: ((conversation.length / 20) * 100) + '%' }} className="progress-7"></div>
        </div>
        <div className="font-bold text-md rounded-xl p-2 border-2 cursor-pointer">Save Game NFT</div>
      </div>
      <div className="mb-16 justify-center flex flex-col items-center flex-1">
        <div className="box box1 max-h-fit w-2/3">
          <div ref={divRef} className="oddboxinner min-h-5/6">
            <div className="text-justify text-lg px-4">
              <h1 className="text-2xl font-bold">{baseline.title}</h1> <br></br>
              {baseline.message.split("<br>").map((line, index) => (
                <Fragment key={index}>
                  {line.replace("<br>", "")}
                  <br />
                </Fragment>
              ))}
            </div>
          </div>
        </div>
        {conversation.map(i => {
          return (
            <div className="box box1 max-h-fit min-h-[20vh] my-4 w-2/3">
              <div className="oddboxinner min-h-5/6">
                <div key={i.content.slice(0, 10)} style={{ color: i.role === 'user' ? '#25b09b' : 'black' }} className={"h-auto mx-4 mb-4 rounded-lg p-4 " + (i.role == "user" ? "bg-red" : "bg-white")}>
                  <p className="text-justify text-lg">
                    {i.content.split("<br>").map((line, index) => (
                      <Fragment key={index}>
                        {line.replace("<br>", "")}
                        <br />
                      </Fragment>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="fixed bottom-0 left-0 right-0 px-4 py-2 pb-0 w-full flex flex-row justify-center">
        <div className="flex flex-row bg-white w-2/3 py-1 px-4">
          <input
            value={userCommand}
            onKeyPress={handleKeyPress}
            onChange={(e) => setUserCommand(e.target.value)}
            type="text" aria-multiline
            placeholder="What's your next move?"
            className="input w-full px-6 py-2 mr-2 rounded-xl border-2" />

          <button onClick={takeAction} className={`rounded-full p-4 bg-[#25b09b]`}>
            {
              loading ?
                <svg aria-hidden="true" className="w-6 h-6 text-white animate-spin fill-black" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#fff">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
            }
          </button>
        </div>
      </div>
    </div>
  </>
}