import Image from "next/image"
import ChainLogo, { Chain, ChainDetails, openseaTestnetBaseUrl } from "./ChainLogo"

export type GameCardProps = {
  title: string;
  nftImage: string;
  address: string;
  chain: Chain;
  tokenId: string;
}

export default function GameCard(props: GameCardProps) {
  const { title, nftImage, address, chain, tokenId } = props

  return <a href={`/story/${tokenId}`} target="_blank">
    <div className="box box1 mx-4 z-0">
      <div className="oddboxinner flex flex-col">
        <Image className="boxNoColor box1 mb-2 mx-0" alt="NFT Image" height={300} width={260} src={nftImage} />
        <h1 className="font-bold w-[260px]">{title}</h1>
        <div className="flex flex-row flex-1 items-center">
          <h2 className="ml-2 mt-1 text-xs">{address.slice(0, 3)}...{address.slice(address.length - 4, address.length - 1)}</h2>
        </div>
      </div>
    </div>
  </a>
}