import Image from "next/image"
import ChainLogo from "./ChainLogo"

export default function GameCard() {
  return <div className="box box1 mx-4">
    <div className="oddboxinner">
      <Image className="boxNoColor box1 mb-2 mx-0" alt="NFT Image" height={300} width={260} src={'/1.jpg'} />
      <h1 className="font-bold">The Cursed Palace of Ismac</h1>
      <div className="flex flex-row flex-1 items-center">
        <ChainLogo size={20} chain='base' />
        <h2 className="ml-2 mt-1 text-xs">0x142...4000</h2>
      </div>
    </div>
  </div>
}