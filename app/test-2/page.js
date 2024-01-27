"use client"
import Link from "next/link"
// gsap
import { gsap } from "gsap-trial"
import { ScrollSmoother } from "gsap-trial/ScrollSmoother"
import { ScrollTrigger } from "gsap-trial/ScrollTrigger"

import useIsomorphicLayoutEffect from "@/_helpers/isomorphicEffect"

export default function Test2() {
  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

    const smoother = ScrollSmoother.create({
      content: "#scrollsmoother-container",
      smooth: 3,
      normalizeScroll: true,
      ignoreMobileResize: true,
      effects: true,
      //preventDefault: true,
      //ease: 'power4.out',
      //smoothTouch: 0.1, 
    })

  }, [])
  
  return (
    <div id="scrollsmoother-container">
      <Hero />
      <Features />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden w-full h-[90vh]">
      <img className="absolute bottom-0 mx-auto w-full object-cover h-[140%]" data-speed="auto" src="https://images.unsplash.com/photo-1519608487953-e999c86e7455?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80" />
    </section>
    // <section className="hidden relative overflow-hidden w-full h-[90vh]">
    //   <img className="absolute bottom-0 mx-auto w-full object-cover h-[140%]" data-speed="auto" src="https://images.unsplash.com/photo-1519608487953-e999c86e7455?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80" />
    // </section>
  )
}

function Features() {
  return (
    <>
      <section className="container px-0 mx-auto h-[50vh] bg-white rounded-lg md:flex md:items-center md:space-x-28 bg-opacity-5 my-44">		
        <div className="relative py-12 pl-6 space-y-6 border-l-4 border-pink-500 md:py-0">
          <h1 className="text-transparent uppercase font-helvetica-now-thin bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">Invisalign</h1>
          <h4>As part of the top 1% of Invisalign providers in the US, we have the experience to deliver the smile you deserve.</h4>
        </div>
        <div className="relative w-full h-full rounded-lg overflow-show"> 
          {/* <img className="absolute bottom-0 mx-auto h-auto object-cover w-[100%]" data-speed="auto" src="/../../../images/blobpurple.png" alt="purple blob" /> */}
          <img className="absolute bottom-0 mx-auto h-auto object-cover w-[150%]" data-speed="auto" src="/../../../images/invisalign_case_transparent.png" alt="invisalign case" />
          <img className="absolute bottom-0 left-1/4 mx-auto h-auto object-cover w-[75%]" data-speed="auto" src="/../../../images/invisalign_bottom.png" alt="invisalign bottom" />
        </div>
      </section>

      <section className="container px-0 mx-auto mt-12 bg-white border-2 border-dashed rounded-lg border-primary-50 md:flex md:items-center md:space-x-28 bg-opacity-5 my-44 h-[50vh]">	
        <div className="relative w-full h-full overflow-hidden rounded-lg"> 
          <img className="absolute bottom-0 mx-auto w-full object-cover h-[120%]" data-speed="auto" src="https://images.unsplash.com/photo-1561344640-2453889cde5b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=967&q=80" alt="" />
        </div>	
        <div className="relative py-12 pr-6 border-r-4 border-pink-500 md:py-0">
          <h2 className="mb-6 text-6xl font-bold"><strong>Easy parallax image effects</strong></h2>
          <p>Pop your images in a container with overflow hidden, size them a little larger than the container and set data-speed to auto. GSAP does the rest.</p>
        </div>		
      </section>

      <section className="container px-0 mx-auto bg-white border-2 border-dashed rounded-lg md:flex md:items-center md:space-x-28 bg-opacity-5 my-44 border-primary-50 h-[50vh]">		
        <div className="relative py-12 pl-6 border-l-4 border-pink-500 md:py-0">
          <h2 className="mb-6 text-6xl font-bold"><strong>Easy parallax image effects</strong></h2>
          <p>Pop your images in a container with overflow hidden, size them a little larger than the container and set data-speed to auto. GSAP does the rest.</p>
        </div>
        <div className="relative w-full h-full overflow-hidden rounded-lg"> 
          <img className="absolute bottom-0 mx-auto w-full object-cover h-[120%]" data-speed="auto" src="https://images.unsplash.com/photo-1561344640-2453889cde5b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=967&q=80" alt="" />
        </div>
      </section>
    </>
  )
}