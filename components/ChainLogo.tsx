import Image from 'next/image'

type Chain = 'optimism' | 'base' | 'zora' | 'mode'

const ChainDetails = {
  'optimism': {
    alt: 'Optimism',
    src: '/logos/op.png',
    accentColor: '#FE051F'
  },
  'base': {
    alt: 'Base',
    src: '/logos/base.png',
    accentColor: '#3979FB'
  },
  'zora': {
    alt: 'Zora',
    src: '/logos/zora.png',
    accentColor: '#334067'
  },
  'mode': {
    alt: 'Mode',
    src: '/logos/mode.svg',
    accentColor: '#DFFE00'
  },
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