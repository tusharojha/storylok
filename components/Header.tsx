import Link from "next/link"

const Header = () => {

  return <div className="navbar flex flex-1 justify-center p-4 z-50 bg-white w-full fixed top-0">
    <div className="flex-1">
      <div className="w-full">
        <Link href={"/"}><h1 className="text-3xl">storylok.xyz</h1></Link>
        <p className="pt-2 text-sm">Lok is a Sanskrit term meaning "a particular division of the universe." </p>
      </div>
    </div>
    <div className="flex-none">  
    </div>
  </div>
}

export default Header
