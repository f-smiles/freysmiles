import Link from "next/link"
import ArrowRightIcon from "./ui/ArrowRightIcon"
import CalendarIcon from "./ui/CalendarIcon"
import Facebook from "./socials/FacebookSocialIcon"
import Instagram from "./socials/InstagramSocialIcon"
import Twitter from "./socials/TwitterSocialIcon"

const about_us_links = [
  { name: "Our Team", href: "/our-team" },
  { name: "Why Choose Us", href: "/why-choose-us" },
  { name: "Testimonials", href: "/testimonials" },
]

const patient_links = [
  { name: "Your Care", href: "/your-care" },
  { name: "Financing Treatment", href: "/financing-treatment" },
  { name: "Virtual Consultation", href: "/virtual-consultation" },
  { name: "Caring For Your Braces", href: "/caring-for-your-braces" },
]

const treatments_links = [
  { name: "Invisalign", href: "/invisalign" },
  { name: "Braces", href: "/braces" },
  { name: "Early Orthodontics", href: "/early-orthodontics" },
  { name: "Adult Orthodontics", href: "/adult-orthodontics" },
]

export default function Footer() {
  return (
    <>
    <footer className="w-full p-8 mx-auto mb-32 sm:pb-16">
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
    <footer className="hidden max-w-screen-xl p-8 mx-auto mb-32 space-y-4">
      <div className="flex flex-col items-stretch gap-4 lg:flex-row">
        <section className="flex items-stretch justify-between w-full space-y-4 bg-center bg-no-repeat bg-cover rounded-xl overflow-clip lg:w-1/3" style={{
          backgroundImage: `url("/../../../images/_mesh_gradients/06. Wisteria.jpg")`,
        }}>
          <span className="p-8 backdrop-blur-sm">
            <h4 className="text-white normal-case font-cera">Ready to make an appointment?</h4>
            <Link href="/book-now" className="inline-block px-6 py-4 mt-4 text-center bg-left-top bg-no-repeat bg-cover border-2 rounded-md shadow-md bg-white/30 border-white/30 shadow-white/30">
              <h5 className="text-white font-cera">Book Now</h5>
            </Link>
          </span>
          <span className="relative">
            <CalendarIcon className="absolute bottom-0 right-0 w-56 h-56 translate-x-1/2 translate-y-16 text-white/30 md:w-64 md:h-64 md:translate-y-1/3 md:translate-x-0 lg:translate-x-1/3" />
          </span>
        </section>
        <section className="flex flex-col items-stretch w-full gap-2 p-2 bg-top bg-no-repeat bg-cover lg:flex-row lg:w-2/3 rounded-xl overflow-clip" style={{
          backgroundImage: `url("/../../../images/_mesh_gradients/96. Lake.jpg")`,
        }}>
          <div className="p-4 rounded-lg lg:w-1/3">
            <h6 className="pb-2 border-b border-gray-700/30 font-cera">About</h6>
            <ol className="mt-2 space-y-2">
              {about_us_links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.name}</Link>
                </li>
              ))}
            </ol>
          </div>
          <div className="p-4 rounded-lg lg:w-1/3">
            <h6 className="pb-2 border-b border-gray-700/30 font-cera">Patient</h6>
            <ol className="mt-2 space-y-2">
              {patient_links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.name}</Link>
                </li>
              ))}
            </ol>
          </div>
          <div className="p-4 rounded-lg lg:w-1/3">
            <h6 className="pb-2 border-b border-gray-700/30 font-cera">Treatments</h6>
            <ol className="mt-2 space-y-2">
              {treatments_links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.name}</Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
      <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:justify-center">
				<section className="p-8 bg-center bg-no-repeat bg-cover rounded-xl overflow-clip"
					style={{
						backgroundImage: `url("/../../../images/_mesh_gradients/67. Rain.jpg")`,
					}}
				>
          <ol className="space-y-2">
						<li><Link href="/products">Shop</Link></li>
						<li><Link href="">Gift Cards</Link></li>
						<li><Link href="">Patient Login</Link></li>
					</ol>
				</section>
				<section className="flex flex-row justify-between px-8 py-6 text-gray-700 bg-center bg-no-repeat bg-cover lg:flex-col rounded-xl overflow-clip"
					style={{
						backgroundImage: `url("/../../../images/_mesh_gradients/03. Snowy Mint.jpg")`,
					}}
				>
					<Link href="https://www.facebook.com/FreySmiles/">
						<Facebook className="w-6 h-6" />
					</Link>
					<Link href="https://www.instagram.com/freysmiles/">
						<Instagram className="w-6 h-6" />
					</Link>
					<Link href="https://twitter.com/freysmiles/">
						<Twitter className="w-6 h-6" />
					</Link>
				</section>
				<section className="flex flex-col items-center justify-between gap-6 p-8 bg-top bg-no-repeat bg-cover lg:gap-4 rounded-xl overflow-clip"
					style={{
						backgroundImage: `url("/../../../images/_mesh_gradients/78. Night Sky.jpg")`, // bg-top
					}}
				>
					<ol className="flex justify-between w-full">
						<li><Link href="/contact">Contact</Link></li>
						<li><Link href="/sitemap">Sitemap</Link></li>
						<li><Link href="/privacy-policy">Privacy Policy</Link></li>
					</ol>
					<p>&copy; Copyright 2023 - FreySmiles Orthodontics</p>
				</section>
			</div>
    </footer>
    </>
  )
}
