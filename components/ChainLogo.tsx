import Image from 'next/image'

export type Chain = 'optimism' | 'base' | 'zora' | 'mode' | 'astarTestnet'

export const openseaTestnetBaseUrl = 'https://testnets.opensea.io'

export const ChainDetails = {
  'astarTestnet': {
    alt: 'Astar',
    src: '/logos/astar.jpeg',
    accentColor: '#FE051F',
    rpc: 'https://evm.shibuya.astar.network',
    contractAddress: '0x36Ea9816306F30B1Bc08395AD7a416Ddd54388d9',
    opensea: 'shibuya-testnet'
  },
  'optimism': {
    alt: 'Optimism',
    src: '/logos/op.png',
    accentColor: '#FE051F',
    rpc: 'https://goerli.optimism.io',
    contractAddress: '0x36Ea9816306F30B1Bc08395AD7a416Ddd54388d9',
    opensea: 'optimism-goerli'
  },
  'base': {
    alt: 'Base',
    src: '/logos/base.png',
    accentColor: '#3979FB',
    rpc: 'https://goerli.base.org',
    contractAddress: '0x36Ea9816306F30B1Bc08395AD7a416Ddd54388d9',
    opensea: 'base-goerli'
  },
  'zora': {
    alt: 'Zora',
    src: '/logos/zora.png',
    accentColor: '#334067',
    rpc: 'https://testnet.rpc.zora.energy',
    contractAddress: '0x195411c4DE4203035B6237a89C4840275eF62179',
    opensea: 'zora-testnet'
  },
  'mode': {
    alt: 'Mode',
    src: '/logos/mode.svg',
    accentColor: '#DFFE00',
    rpc: 'https://sepolia.mode.network',
    contractAddress: '0x36Ea9816306F30B1Bc08395AD7a416Ddd54388d9',
    opensea: 'base-goerli'
  },
}

export const getContractAddressFromRpc = (rpc: string): string => {
  let contractAddress = ''
  Object.values(ChainDetails).forEach((i) => {
    if (i.rpc == rpc) {
      contractAddress = i.contractAddress
    }
  })
  return contractAddress
}

export const getOpenseaUrl = (rpc: string, tokenId: string): string => {
  let opensea = ''
  let contractAddress = ''
  Object.values(ChainDetails).forEach((i) => {
    if (i.rpc == rpc) {
      contractAddress = i.contractAddress
      opensea = i.opensea
    }
  })
  return `${openseaTestnetBaseUrl}/assets/${opensea}/${contractAddress}/${tokenId}`
}

type ChainLogoType = {
  chain: Chain
  size?: number
}

export default function ChainLogo(props: ChainLogoType) {
  const { size, chain } = props

  const { src, alt, accentColor } = ChainDetails[chain]

  return <a href={`${openseaTestnetBaseUrl}/assets/${ChainDetails[chain].opensea}/${ChainDetails[chain].contractAddress}/`} target='_blank'>
    <div className='hover:cursor-pointer'>
      <Image style={{ borderColor: accentColor }} className={'rounded-full mx-1 hover:p-[1px] hover:border-2'} width={size ?? 32} height={size ?? 32} alt={alt} src={src} />
    </div>
  </a>
}