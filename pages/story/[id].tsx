import { Fragment, useEffect, useState } from "react"
import Image from 'next/image'
import { NextSeo } from "next-seo"
import axios from "axios"
import { ChatMessage } from "@/components/helpers/types"
import { useMediaQuery } from "@/components/helpers/hooks"

type StoryPageProps = {
  nftExists: boolean
  nft?: any
}

export default function StoryPage(props: StoryPageProps) {
  const { nftExists, nft } = props
  const [loadingContent, setLoadingContent] = useState(true)

  const isMobile = useMediaQuery(468)
  const [conversation, setConversation] = useState<ChatMessage[]>([])
  const [message, setMessage] = useState<string>('')
  const [copyBtText, setCopyBtnText] = useState('Copy Link')

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://storylok.xyz/story/${nft.id}`);
    setCopyBtnText('Copied!')

    setTimeout(() => {
      setCopyBtnText('Copy Link')
    }, 2000)
  }

  const shareOnW = () => {
    // Define the tweet text and image URL
    const tweetText = `Hey, I just played ${nft.name} on Storylok, a story based NFT game on Solana that lets you explore AI-crafted realms.\n\nCheckout my story: https://storylok.xyz/story/${nft.id}`;

    // Encode the tweet text and image URL for the Twitter share URL
    const encodedTweetText = encodeURIComponent(tweetText);

    // Create the Twitter share URL
    const twitterShareUrl = `whatsapp://send?text=${encodedTweetText}`;

    // Open Twitter in a new window or tab
    window.open(twitterShareUrl, '_blank');
  }

  const shareOnX = () => {
    // Define the tweet text and image URL
    const tweetText = `Just played ${nft.name} on @Storylok_xyz, a story based NFT game on @Solana that lets you explore AI-crafted realms.\n\nCheckout my story: https://storylok.xyz/story/${nft.id}`;

    // Encode the tweet text and image URL for the Twitter share URL
    const encodedTweetText = encodeURIComponent(tweetText);

    // Create the Twitter share URL
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodedTweetText}`;

    // Open Twitter in a new window or tab
    window.open(twitterShareUrl, '_blank');
  }

  const openWalletOnSolscan = () => {
    const url = `https://solscan.io/account/${nft.ownerAddress}`
    // Open Twitter in a new window or tab
    window.open(url, '_blank');
  }

  const fetchIpfsData = async () => {
    if (nft.attributes && nft.attributes.conversation) {

      const conversation = nft.attributes.conversation
      const options = {
        method: 'GET',
        url: `https://gateway.lighthouse.storage/ipfs/${conversation}`,
        headers: {
          accept: 'application/json',
        }
      };

      const response = await axios(options)

      console.log(response.data, typeof response.data)
      if (response.data) {
        setMessage(response.data.message)
        setConversation(response.data.conversation)
        setLoadingContent(false)
      }
    }
  }

  useEffect(() => {
    try {
      if (nftExists) {
        setLoadingContent(true)
        fetchIpfsData()
      }
    } catch (e) {
      console.log('error in ipfs')
      console.log(e)
    }
  }, [])


  if (!nftExists) return <>Nft Doesn't Exists</>

  return <>
    <NextSeo
      title={nft.name}
      description={nft.description}
      canonical="https://storylok.xyz/"
      openGraph={{
        url: `https://storylok.xyz/story/${nft.id}`,
        title: nft.name,
        description: nft.description,
        images: [
          {
            url: nft.image,
            alt: 'NFT Memory Image',
            type: 'image/jpeg',
          },
        ],
        siteName: 'Storylok',
      }}
      twitter={{
        handle: '@storylok_xyz',
        site: 'https://storylok.xyz',
        cardType: 'summary_large_image',
      }}
    />
    <div className='md:mt-32 mx-4 flex md:flex-row flex-col-reverse flex-1'>
      {loadingContent ?
        <>
          <div className="flex flex-1 w-screen h-[70vh] justify-center items-center">
            <img src="/l2.gif" className="h-[50vh] w-[50vh]" />
          </div>
        </> :
        <div className="mb-8 justify-center flex flex-col items-center flex-1">
          <div className="box box1 max-h-fit md:mr-4 mr-0 pb-6 px-4">
            <div className="oddboxinner">
              <div className="text-justify text-lg px-4">
                <h1 className="text-2xl font-bold">{nft.name}</h1> <br></br>
                {message.split("<br/>").map((line, index) => (
                  <Fragment key={index}>
                    {line.replace("<br/>", "")}
                    <br />
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
          {conversation.map((i, index) => {
            if (i.role == 'user') return;
            return (
              <div className={`flex flex-1 justify-items-end items-end`}>
                <div key={i.content.slice(0, 10)} className="box box1 max-h-fit md:mr-4 mr-0 my-4 pb-4">
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
        </div>}
      <div className="px-0 py-2 pb-0 flex flex-3 flex-col items-center w-full md:w-[30vw]">
        <div className="box box1 max-h-fit">
          <div className="oddboxinner px-2 flex flex-col">

            <Image className="boxNoColor box1 mb-2 mx-0 w-full" alt="NFT Image" height={300} width={260} src={nft.image} />
            <p onClick={openWalletOnSolscan} className="text-md text-[#25b09b] hover:text-[#1f9181] cursor-pointer">{`Owner: ${nft.ownerAddress.slice(0, 4)}...${nft.ownerAddress.slice(nft.ownerAddress.length - 4, nft.ownerAddress.length)}`}</p>
            <h1 className="text-2xl font-bold">{nft.name}</h1>
            <p className="textClamp">{nft.description}</p>
            <div className="flex md:flex-row flex-col">
              <div onClick={shareOnX} className={"my-2 hover:bg-gray-100 font-bold text-lg rounded-xl p-2 border-2 cursor-pointer"}>
                Share on 𝕏
              </div>
              {isMobile && <div onClick={shareOnW} className={"my-2 hover:bg-gray-100 md:ml-2 font-bold text-lg rounded-xl p-2 border-2 cursor-pointer flex flex-row items-center"}>
                Share on <img src="/logos/whatsapp.png" className="ml-2 h-6 w-6" />
              </div>}
              <div onClick={copyToClipboard} className={"my-2 md:ml-2 hover:bg-gray-100 font-bold text-lg rounded-xl p-2 border-2 cursor-pointer"}>
                {copyBtText}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
}

export async function getServerSideProps(context: any) {
  const { id } = context.query
  console.log('id', context.query, id)


  const fetchNft = async (id: string) => {

    const options = {
      method: 'GET',
      url: `https://mainnet.underdogprotocol.com/v2/projects/1/nfts/${id}`,
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${process.env.NEXT_PUBLIC_UNDERDOG_NFT}`
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


  if (!id) {
    return { props: { nftExists: false } }
  }

  const nft = await fetchNft(id.toString())
  console.log('nft', nft)
  if (!nft) {
    return { props: { nftExists: false } }
  }

  // Pass data to the page via props
  return { props: { nft, nftExists: true } }
}
