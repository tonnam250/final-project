import Navbar from "@/components/Navbar"
import './globals.css'
import { Raleway as RalewayFont } from 'next/font/google'

const Raleway = RalewayFont({
  subsets: ['latin'],
})

const layout = ( {children} ) => {
  return (
    <html lang="en">
      <body className={Raleway.className}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
export default layout