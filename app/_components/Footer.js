import Link from "next/link"
import CalendarIcon from "./ui/CalendarIcon"
import Facebook from "./socials/FacebookSocialIcon"
import Instagram from "./socials/InstagramSocialIcon"
import Twitter from "./socials/TwitterSocialIcon"

export default function Footer() {
  return (
    <>
      <footer className="w-full p-8 mx-auto sm:pb-32">
        <div className="flex flex-col justify-center gap-4 lg:flex-row lg:flex-wrap">
          <section className="flex items-stretch justify-between space-y-4 bg-center bg-no-repeat bg-cover rounded-xl overflow-clip" style={{
            backgroundImage: `url("/../../../images/_mesh_gradients/06. Wisteria.jpg")`,
          }}>
            <span className="z-10 p-8 space-y-4 backdrop-blur-sm">
              <h4 className="text-white normal-case font-cera">Ready for your appointment?</h4>

              <div className="box box-shadow">
                <Link href="/book-now" className="inline-block px-6 py-3 text-zinc-50">Book Now</Link>
              </div>
            </span>
            <span className="relative">
              <CalendarIcon className="absolute bottom-0 right-0 w-56 h-56 translate-x-1/2 translate-y-16 text-white/30 md:w-64 md:h-64 md:translate-y-1/3 md:translate-x-0 lg:translate-x-1/3" />
            </span>
          </section>
          <section className="p-8 bg-center bg-no-repeat bg-cover rounded-xl overflow-clip"
            style={{
              backgroundImage: `url("/../../../images/_mesh_gradients/67. Rain.jpg")`,
            }}
          >
            <ol className="flex flex-col w-full space-y-4">
              <li className="group w-max">
                <Link href="https://my.orthoblink.com/bLink/Login">Patient Login</Link>
                <span className="block max-w-0 group-hover:max-w-full transition-all delay-150 duration-300 h-0.5 bg-primary-60 ease-in-out" />
              </li>
              <li className="group w-max">
                <Link href="/products">Shop</Link>
                <span className="block max-w-0 group-hover:max-w-full transition-all delay-150 duration-300 h-0.5 bg-primary-60 ease-in-out" />
              </li>
              <li className="group w-max">
                <Link href="/gift-cards">Gift Cards</Link>
                <span className="block max-w-0 group-hover:max-w-full transition-all delay-150 duration-300 h-0.5 bg-primary-60 ease-in-out" />
              </li>
            </ol>
          </section>
          <section className="flex flex-row justify-between px-4 text-gray-700 bg-left-top bg-no-repeat bg-cover lg:flex-col rounded-xl overflow-clip"
            style={{
              backgroundImage: `url("/../../../images/_mesh_gradients/96. Lake.jpg")`,
            }}
          >
            <Link href="https://www.facebook.com/FreySmiles/" className="inline-block p-8 transition duration-200 ease-in-out lg:p-4 hover:scale-110 hover:text-primary-60">
              <Facebook className="w-6 h-6" />
            </Link>
            <Link href="https://www.instagram.com/freysmiles/" className="inline-block p-8 transition duration-200 ease-in-out lg:p-4 hover:scale-110 hover:text-primary-60">
              <Instagram className="w-6 h-6" />
            </Link>
            <Link href="https://twitter.com/freysmiles/" className="inline-block p-8 transition duration-200 ease-in-out lg:p-4 hover:scale-110 hover:text-primary-60">
              <Twitter className="w-6 h-6" />
            </Link>
          </section>
          <section className="flex flex-col items-center justify-between gap-6 p-8 bg-top bg-no-repeat bg-cover lg:gap-4 rounded-xl overflow-clip"
            style={{
              backgroundImage: `url("/../../../images/_mesh_gradients/78. Night sky.jpg")`, // bg-top
            }}
          >
            <ol className="flex justify-between w-full">
              <li className="group w-max">
                <Link href="/contact">Contact</Link>
                <span className="block max-w-0 group-hover:max-w-full transition-all delay-150 duration-300 h-0.5 bg-primary-60 ease-in-out"></span>
              </li>
              <li className="group w-max">
                <Link href="/sitemap">Sitemap</Link>
                <span className="block max-w-0 group-hover:max-w-full transition-all delay-150 duration-300 h-0.5 bg-primary-60 ease-in-out"></span>
              </li>
              <li className="group w-max">
                <Link href="/privacy-policy">Privacy Policy</Link>
                <span className="block max-w-0 group-hover:max-w-full transition-all delay-150 duration-300 h-0.5 bg-primary-60 ease-in-out"></span>
              </li>
            </ol>
            <p>&copy; Copyright 2023 - FreySmiles Orthodontics</p>
          </section>
        </div>
      </footer>
    </>
  )
}
