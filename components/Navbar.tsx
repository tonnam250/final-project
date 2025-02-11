import Link from "next/link"
import Image from "next/image"
import profileImg from "./profileImg.jpg"

const Navbar = () => {
  return (
    <nav className="z-10 fixed">
      <div className="flex px-8 h-24 bg-[#637648] items-center text-white text-2xl">

        <div className="flex justify-start items-center gap-4 w-1/2">
          <a href="/" className="flex items-center gap-2">
          <div className="overflow-hidden bg-white w-16 h-16">
            <img src="./images/LogoWText.png" alt="Logo" />
          </div>
            <div className="flex flex-col justify-center items-start">
              <p className="text-3xl font-bold">Purely</p>
              <small>TRACE</small>
            </div>
          </a>
        </div>

        <div className="flex gap-24 justify-end items-center w-1/2">

          <Link href={'/FarmGeneralInfo'}>General information</Link>
          <Link href={'/RawMilk'}>Raw Milk</Link>

          <div className="flex flex-wrap m-2 items-center border-2 rounded-full px-3 py-2 justify-center shadow-md gap-3">
            <img src="./images/profile2.jpg" alt="profile" className="rounded-full w-12 h-12" />
            <p>Profile</p>
          </div>
        </div>
      </div>
    </nav>
  )
}
export default Navbar