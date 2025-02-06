import Link from "next/link"
import Image from "next/image"
import profileImg from "./profileImg.jpg"

const Navbar = () => {
  return (
    <nav>
      <div className="flex justify-between px-4 h-16 bg-[#637648] items-center text-white">

        <div className="flex justify-center items-center gap-4">
          <img src="./images/FarmLogo.png" alt="Logo" className="rounded-full bg-white w-12" />
          <p>Farm</p>
        </div>

        <div className="flex gap-4 justify-center items-center">
          <Link href='/'>Home</Link>
          <Link href={'/FarmGeneralInfo'}>General information</Link>
          <Link href={'/RawMilk'}>Raw Milk</Link>

          <div className="flex m-2 items-center border-2 rounded-md p-2 justify-center shadow-md">
            <img src="./images/profile2.jpg" alt="profile" className="rounded-full w-9 h-9 mx-2" />
            <p>Profile</p>
          </div>
        </div>
      </div>
    </nav>
  )
}
export default Navbar