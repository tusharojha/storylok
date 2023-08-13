import Image from 'next/image'

export type Chain = 'optimism' | 'base' | 'zora' | 'mode'

export const ChainDetails = {
  'optimism': {
    alt: 'Optimism',
    src: '/logos/op.png',
    accentColor: '#FE051F',
    rpc: 'https://goerli.optimism.io',
    contractAddress: '0x36Ea9816306F30B1Bc08395AD7a416Ddd54388d9'
  },
  'base': {
    alt: 'Base',
    src: '/logos/base.png',
    accentColor: '#3979FB',
    rpc: 'https://goerli.base.org',
    contractAddress: '0x36Ea9816306F30B1Bc08395AD7a416Ddd54388d9'
  },
  'zora': {
    alt: 'Zora',
    src: '/logos/zora.png',
    accentColor: '#334067',
    rpc: 'https://testnet.rpc.zora.energy/',
    contractAddress: '0x36Ea9816306F30B1Bc08395AD7a416Ddd54388d9'
  },
  'mode': {
    alt: 'Mode',
    src: '/logos/mode.svg',
    accentColor: '#DFFE00',
    rpc: 'https://sepolia.mode.network/',
    contractAddress: '0x36Ea9816306F30B1Bc08395AD7a416Ddd54388d9'
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

type ChainLogoType = {
  chain: Chain
  size?: number
}

export default function ChainLogo(props: ChainLogoType) {
  const { size, chain } = props

  const { src, alt, accentColor } = ChainDetails[chain]

  return <div className='hover:cursor-pointer'>
    <Image style={{ borderColor: accentColor }} className={'rounded-full mx-1 hover:p-[1px] hover:border-2'} width={size ?? 32} height={size ?? 32} alt={alt} src={src} />
  </div>
}