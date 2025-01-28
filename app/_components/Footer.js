import Link from "next/link"
import Facebook from "./socials/FacebookSocialIcon"
import Instagram from "./socials/InstagramSocialIcon"
import Twitter from "./socials/TwitterSocialIcon"
import ArrowLongRight from "./ui/ArrowLongRight"
import { gsap } from "gsap";
import { useEffect } from "react";

export default function Footer() {

  useEffect(() => {
    const lines = document.querySelectorAll(".stagger-line");
  
    lines.forEach((line) => {
      gsap.fromTo(
        line.querySelectorAll(".stagger-word"),
        {
          yPercent: 100,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: line,
            start: "top 80%",
          },
        }
      );
    });
  }, []);

  
  return (
    <div
      className="relative h-[620px]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className=" relative h-[calc(100vh+620px)] -top-[100vh]">
        <div className="h-[620px] sticky top-[calc(100vh-620px)]">
          <footer id="footer" className="w-full h-full bg-black pb-4 sm:pb-32 sm:pt-4 lg:pt-8">
          <div className="container p-6 mx-auto space-y-3 lg:pb-8 sm:flex sm:items-baseline sm:justify-between">
      <div className="text-white text-2xl text-center sm:text-left font-helvetica-neue-light lg:text-3xl xl:text-6xl">

        <div className="stagger-line overflow-hidden">
          <span className="stagger-word">Ready</span>{" "}
          <span className="stagger-word">to</span>{" "}
          <span className="stagger-word">book</span>{" "}
          <span className="stagger-word">your</span>
        </div>
        <div className="stagger-line overflow-hidden">
          <span className="stagger-word">appointment</span>
          <span className="stagger-word">?</span>
        </div>
   
      </div>
      <div className="relative flex items-center justify-between">
  <svg
    width="508"
    height="122"
    viewBox="0 0 508 122"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute -top-4 left-0 w-full" 
  >
    <path
      className="draw-footer-path"
      d="M2 23.2421C28.9079 14.5835 113.098 -1.63994 234.594 2.73493C386.464 8.20351 515.075 37.5458 505.497 77.9274C503.774 85.1946 491.815 127.145 271.535 118.942C51.2552 110.739 32.8106 78.7919 45.7824 58.053C59.4644 36.1787 112.824 27.9758 193.548 27.9758"
      stroke="#ff6432"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
  <Link
    href="/book-now"
    className="px-4 py-2 lg:px-6 lg:py-3 xl:px-8 xl:py-4 flex items-center justify-between rounded-full space-x-2 relative"
  >
    <p className="font-neue-montreal text-white uppercase lg:text-4xl xl:text-6xl lg:mt-2">
      Book Now
    </p>
    <ArrowLongRight className="text-[#f8f1de] w-6 h-6 lg:w-12 lg:h-12" />
  </Link>
</div>

    </div>
            <div className="text-white container mx-auto divide-x divide-white flex justify-between gap-4 border-t border-white">
              <ul className="w-1/2 p-8 space-y-4 font-neue-montreal">
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
              </ul>
              <ul className="w-1/2 p-8 space-y-4 font-neue-montreal">
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
              </ul>
            </div>
            <div className="container flex flex-col-reverse md:flex-row gap-4 items-center justify-between px-4 py-8 mx-auto border-t border-white">
              <p className="text-white font-neue-montreal lg:text-md">&copy; Copyright 2025 - FreySmiles Orthodontics</p>
              <ul className="flex items-center gap-4">
                <Link href="https://www.facebook.com/FreySmiles/" className="border border-white/60 rounded-full p-4 transition duration-200 ease-in-out lg:p-4 hover:scale-110 hover:text-white hover:border-white text-white">
                  <Facebook className="w-4 h-4 lg:w-5 lg:h-5" />
                </Link>
                <Link href="https://www.instagram.com/freysmiles/" className="border border-white/60 rounded-full p-4 transition duration-200 ease-in-out lg:p-4 hover:scale-110 hover:text-white hover:border-white text-white">
                  <Instagram className="w-4 h-4 lg:w-5 lg:h-5" />
                </Link>
                <Link href="https://twitter.com/freysmiles/" className="border border-white/60 rounded-full p-4 transition duration-200 ease-in-out lg:p-4 hover:scale-110 hover:text-white hover:border-white text-white">
                  <Twitter className="w-4 h-4 lg:w-5 lg:h-5" />
                </Link>
              </ul>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
