import Image from 'next/image'

type ChainLogoType = {
  src: string;
  alt: string;
  accentColor?: string;
}

export default function ChainLogo(props: ChainLogoType) {
  const { src, alt, accentColor } = props
  console.log(accentColor)
  return <div className='hover:cursor-pointer'>
    <Image style={{ borderColor: accentColor }} className={'rounded-full mx-1 hover:p-[1px] hover:border-2'} width={32} height={32} alt={alt} src={src} />
  </div>
}