'use client'
import React, { useRef } from "react";
import Link from "next/link"
// framer motion
import { motion } from "framer-motion"
import clsx from "clsx"
import GalaxyShape from "../_components/shapes/galaxy";
import Shape02 from "../_components/shapes/shape02"
import Shape03 from "../_components/shapes/shape03"
import Shape04 from "../_components/shapes/shape04"
import Shape05 from "../_components/shapes/shape05"
import Shape06 from "../_components/shapes/shape06"
import Shape07 from "../_components/shapes/shape07"
import { TextReveal } from "../_components/TextReveal"


export default function WhyChooseUs() {
  return (

    <>
      <Hero />
      <StackCards />
      <ScrollTextReveal />
      <CTA />
      <DragTable />
      <BentoGrid />
    </>
  )
}



  

function Hero() {

  return (
    <div className="w-full h-[100vh] flex flex-col justify-center items-center relative">
      <video autoPlay loop muted preload="true" className="absolute inset-0 object-cover object-center w-full h-full -z-10">
        {/* undulating waves */}
        {/* <source src="/../../videos/production_id_4779866.mp4" type="video/mp4" /> */}
        {/* sharp waves */}
        {/* <source src="/../../videos/pexels-rostislav-uzunov-9150545.mp4" type="video/mp4" /> */}
        {/* shutterstock */}
        <source src="/../../videos/shutterstock_1111670177.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 m-4 bg-gray-300 border border-gray-100 rounded-xl -z-10 backdrop-filter bg-clip-padding backdrop-blur-sm bg-opacity-30" />
      <section className="flex flex-col gap-4 mx-auto my-16 text-center md:h-16 md:text-left md:flex-row w-max">
        
        <h1 className="py-1 text-zinc-800 font-helvetica-now-thin">Experts in</h1> {/* text-[#5f6368] */}
        <div className="h-full overflow-hidden">
          <ul
            style={{
              animation: "scroll-text-up 5s infinite",
            }}
          >
            <li className="text-[#ea4335] py-1">
              <h1 className="font-helvetica-now-thin">Invisalign</h1>
            </li>
            <li className="text-[#4285f4] py-1">
              <h1 className="font-helvetica-now-thin">Damon Braces</h1>
            </li>
            <li className="text-[#34a853] py-1">
              <h1 className="font-helvetica-now-thin">Accelerated Orthodontic Treatment</h1>
            </li>
            <li className="text-[#fbbc04] py-1">
              <h1 className="font-helvetica-now-thin">low-dose 3D Digital Radiographs</h1>
            </li>
            <li className="text-[#ea4335] py-1">
              <h1 className="font-helvetica-now-thin">Invisalign</h1>
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}

function StackCards() {
  return (
    <section className="py-32 bg-[#f5f5eb]">
      <div className="relative container mx-auto border border-[#51733f]">
        <div className="flex flex-col items-center gap-6 mx-auto -translate-y-10 lg:mx-0 lg:-translate-x-10 lg:flex-row w-max">
          <img
            src="/../../images/freysmilepatient.jpg"
            alt="frey smiles patient"
            className="rounded-full left-1/4 w-96 h-96 border-2 border-[#51733f]"
          />
          <h1 className="z-10 px-4 tracking-tighter uppercase font-neue-montreal lg:text-7xl mix-blend-multiply text-[#51733f]">Uncompromising<br/>quality</h1>
        </div>
        <div className="max-w-screen-lg mx-auto space-y-16">
          <div className="font-neue-montreal relative px-8 lg:px-16 py-8 mx-auto max-w-[60dvw] translate-x-[4dvw] border-2 border-[#51733f] -rotate-2 hover:rotate-0 transition-all duration-150 ease-linear hover:scale-105 bg-[#f5f5eb]">
            <h4>We strive to attain finished results consistent with the <span>American Board of Orthodontics (ABO)</span> qualitative standards. Our doctors place great priority on the certification and recertification process, ensuring that all diagnostic records adhere to ABO standards.</h4>
            <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/4 w-36 h-36 -z-10">
              <Shape07 />
            </div>
          </div>
          <div className="font-neue-montreal px-8 lg:px-16 py-8 mx-auto max-w-[60dvw] -translate-x-[2dvw] border-2 border-[#51733f] transition-all duration-150 ease-linear hover:scale-105 bg-[#f5f5eb] rotate-2">
            <h4>Currently, Dr. Gregg Frey is a certified orthodontist, and is preparing cases for recertification. Dr. Daniel Frey is in the final stages of obtaining his initial certification.</h4>
            <div className="absolute bottom-0 left-0 w-48 h-48 -translate-x-1/4 -z-10">
              <Shape06 />
            </div>
          </div>
          <div className="font-neue-montreal px-8 lg:px-16 py-8 mx-auto max-w-[60dvw] translate-x-[2dvw] border-2 border-[#51733f] rotate-2 lg:-rotate-2 relative hover:rotate-0 hover:scale-105 transition-all duration-150 ease-linear bg-[#f5f5eb]">
            <h4>To complement our use of cutting-edge diagnostic technology, we uphold the highest standards for our records, ensuring accuracy and precision throughout the treatment process.</h4>
            <div className="absolute bottom-0 right-0 translate-x-1/2 w-44 h-44 translate-y-1/4 -z-10">
              <Shape05 />
            </div>
          </div>
          <div className="font-neue-montreal relative px-8 lg:px-16 py-8 mx-auto max-w-[60dvw] -translate-x-[2dvw] border-2 border-[#51733f] rotate-2 hover:rotate-0 transition-all duration-150 ease-linear hover:scale-105 bg-[#f5f5eb]">
            <h4>Our office holds the distinction of being the <span className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 font-helvetica-now-thin">longest-standing, active board-certified orthodontic office in the area</span>. With four offices in the Lehigh Valley, we have been providing unparalleled orthodontic care for over four decades.</h4>
            <div className="absolute bottom-0 left-0 w-40 h-40 -translate-x-1/2 -translate-y-6 -z-10">
              <Shape04 />
            </div>
          </div>
        </div>
        <div className="flex translate-x-10 translate-y-10 place-content-end">
          <div className="overflow-hidden border border-black rounded-full w-max">
            <span className="relative">
              <Shape02 className="absolute inset-0 left-0 right-0 z-10 object-fill object-center scale-110 top-1/2 text-zinc-100/80 h-96 w-96" />
              <img
                className="object-cover object-center h-96 w-96"
                src="/../../images/drfreyperfecting.jpg"
                alt="Dr. Gregg Frey attending a FreySmiles patient"
              />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function ScrollTextReveal() {
  const text = "Frey Smiles believes in providing accessible orthodontic care for everyone. In 2011, they established a non-profit organization called More Than Smiles, which offers orthodontic treatment to deserving individuals who may not have access to world-class orthodontic care or cannot afford it."

  return (
    <section className="w-full px-10 bg-[#d2d3c3]">
      <div className="container flex flex-col-reverse mx-auto md:flex-row md:justify-between">
        <div className="w-full min-h-screen px-8 py-12 md:w-1/2 md:px-0">
          <TextReveal body={text} className="relative mx-auto h-[100vh] w-full max-w-lg">
            {(tokens) => (
              <div className="sticky top-0 left-0 flex items-center h-full text-primary-50 font-larken font-extralight text-[clamp(1.125rem,_0.4688rem_+_2.9167vw,_2rem)] leading-[clamp(1.125rem,_0.4688rem_+_2.9167vw,_2rem)]">
                <div>
                  {tokens.map((token, index) => (
                    <TextReveal.Token key={index} index={index}>
                      {(isActive) => (
                        <span
                          className={clsx(
                            {
                              "opacity-20": !isActive,
                            },
                            "transition",
                          )}>
                          {token}
                        </span>
                      )}
                    </TextReveal.Token>
                  ))}
                </div>
              </div>
            )}
          </TextReveal>
        </div>
        <div className="flex flex-col items-center justify-center w-full md:w-1/2">
          <img
            className="mt-16 rounded-lg"
            src="/../../images/smilescholarship.jpg"
            alt="Frey Smiles patient receiving FreySmile scholarship"
          />
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="sm:py-32 bg-[#b1c0a0]">
      <div className="container flex flex-col gap-8 mx-auto md:flex-row md:justify-between lg:gap-16">
        <div className="flex flex-col justify-center space-y-8 md:w-1/2">
          <h4 className="font-neue-montreal">If you know someone who could benefit from this gift, please visit the website for details on how to nominate a candidate.</h4>
          <Link href="https://morethansmiles.org/" className="block px-6 py-2 w-fit transition-all shadow-[6px_6px_0px_rgba(39,_39,_42,_0.9)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] font-larken font-light tracking-wide bg-indigo-500 text-white">Learn More</Link>
        </div>
        <Shape03 className="md:w-1/2" />
      </div>
    </section>
  )
}

function DragTable() {
  const freySmilesRef = useRef()
  const othersRef = useRef()

  return (
    <section className="hidden lg:block bg-[#d2d3c3] py-24">
      <div className="container grid-cols-12 grid-rows-6 mx-auto mb-32 lg:grid place-content-stretch font-neue-montreal">
        <div className="flex col-span-6 col-start-1 row-start-1 mb-12 text-center font-extralight place-content-center place-items-end font-larken text-zinc-800"><h1>FreySmiles Orthodontics</h1></div>
        <div className="flex col-span-6 col-start-7 row-start-1 mb-12 text-center place-content-center place-items-end font-larken text-zinc-800 font-extralight"><h1>Others</h1></div>
        <motion.div ref={freySmilesRef} className="relative col-span-6 col-start-1 row-span-5 row-start-2 translate-x-8 border-2 rounded-full aspect-square border-[#51733f]">
          <motion.div className="absolute left-0 flex w-48 h-48 text-center rotate-45 rounded-full top-1/2 -translate-y-1/3 bg-[#9dbb81] place-content-center place-items-center text-zinc-800" drag dragConstraints={freySmilesRef}>
            <p className="text-2xl leading-6"><span className="text-4xl">4</span><br/> convenient<br/> locations</p>
          </motion.div>
          <motion.div className="absolute flex text-center -rotate-45 translate-x-1/2 translate-y-1/2 border rounded-full left-1/3 w-36 h-36 top-1/2 border-zinc-800 bg-zinc-800 place-content-center place-items-center text-zinc-100" drag dragConstraints={freySmilesRef}>
            <p className="text-xl leading-5">Modern<br/> office<br/> settings</p>
          </motion.div>
          <motion.div className="absolute bottom-0 left-0 flex w-56 h-56 text-center translate-x-1/2 rounded-full text-zinc-800 -translate-y-1/4 bg-[#9dbb81] place-content-center place-items-center -rotate-12" drag dragConstraints={freySmilesRef}>
            <p className="text-2xl leading-6">Over<br/><span className="text-4xl">50+ years</span><br/> of experience</p>
          </motion.div>
          <motion.div className="absolute bottom-0 flex text-center -translate-y-2 border rounded-full text-zinc-800 w-36 h-36 -translate-x-1/4 left-1/2 border-zinc-800 place-content-center -rotate-12 place-items-center" drag dragConstraints={freySmilesRef}>
            <p className="text-xl leading-5">Financial<br/> options</p>
          </motion.div>
          <motion.div className="absolute bottom-0 right-0 flex w-48 h-48 my-auto text-center rotate-45 -translate-x-1/2 -translate-y-1/2 rounded-full text-zinc-800 bg-[#9dbb81] place-content-center place-items-center" drag dragConstraints={freySmilesRef}>
            <p className="text-2xl leading-6"><span className="text-3xl leading-8">Leaders<br/></span> in the <br/>industry</p>
          </motion.div>
        </motion.div>
        <motion.div ref={othersRef} className="relative z-0 col-span-6 col-start-7 row-span-5 row-start-2 -translate-x-8 border-2 border-dashed rounded-full aspect-square border-[#51733f]">
          <motion.div className="absolute bottom-0 flex w-48 h-48 text-center -translate-x-1/2 rounded-full rotate-12 left-1/2 bg-zinc-800 place-content-center place-items-center text-zinc-100" drag dragConstraints={othersRef}>
            <p>Financial options</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function BentoGrid() {
  return (
    <section className="sm:my-32">
      <div className="grid grid-cols-8">
        <div className="relative col-span-5 place-content-center">
          <GalaxyShape className="absolute inset-0 object-cover object-center -translate-x-1/2 -translate-y-1/2 opacity-70 top-1/2 left-1/2 fill-primary-70" />
          <p className="text-center text-[#CBB99F] text-[clamp(1rem,_-0.6667rem_+_4.1667vw,_2rem)] leading-[clamp(1rem,_-0.6667rem_+_4.1667vw,_2rem)]">We have <br/> <span className="inline-block uppercase">50+ years</span> <br/> of experience.</p>
        </div>
        <div className="col-span-3 overflow-hidden">
          <img className="object-cover object-center" src="/../../images/pexels-cedric-fauntleroy-4269276_1920x2880.jpg" />
        </div>
        {/* <div className="relative flex flex-col items-center justify-center w-2/3">
          <GalaxyShape className="absolute inset-0 object-cover object-center w-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70 top-1/2 left-1/2 fill-primary-70" />
          <p className="text-5xl leading-snug text-center text-stone-500 font-extralight font-larken">We have <br/> <span className="inline-block mt-3 uppercase text-7xl">50+ years</span> <br/> of experience.</p>
        </div>
        <div className="w-1/3">
          <img className="object-cover object-center" src="/../../images/pexels-cedric-fauntleroy-4269276_1920x2880.jpg" />
        </div> */}
      </div>
      <div className="grid grid-cols-6 grid-rows-6">
        <div className="col-span-3 row-span-2 lg:col-span-2 place-content-center">
          <p className="text-center text-[#CBB99F] text-[clamp(1rem,_-0.6667rem_+_4.1667vw,_2rem)] leading-[clamp(1rem,_-0.6667rem_+_4.1667vw,_2rem)] uppercase">25K+ <br/> Patients</p>
        </div>
        <div className="col-span-3 row-span-2 lg:col-span-2">
          <img className="object-cover object-center" src="/../../images/aurela-redenica-VuN-RYI4XU4-unsplash_2400x3600.jpg" />
        </div>
        <div className="col-span-3 row-span-2 lg:col-span-2 place-content-center">
          <p className="text-center text-[#CBB99F] text-[clamp(1rem,_-0.6667rem_+_4.1667vw,_2rem)] leading-[clamp(1rem,_-0.6667rem_+_4.1667vw,_2rem)] uppercase">ABO <br/> Certified</p>
        </div>
        <div className="relative col-span-3 row-span-2 lg:col-span-2">
          <img className="object-cover object-right-bottom w-full h-full" src="/../../images/goby-D0ApR8XZgLI-unsplash_2400x1467.jpg" alt="hand reaching towards another hand offering pink toothbrush" />
        </div>
        <div className="col-span-3 row-span-2 place-content-center lg:col-span-2">
          <p className="text-center text-[#CBB99F] text-[clamp(1rem,_-0.6667rem_+_4.1667vw,_2rem)] leading-[clamp(1rem,_-0.6667rem_+_4.1667vw,_2rem)] uppercase">10+ <br/> Members</p>
        </div>
        <div className="col-span-3 row-span-2 lg:col-span-2">
          <img className="object-cover object-center" src="/../../images/pexels-cedric-fauntleroy-4269491_1920x2880.jpg" alt="dental equipment" />
        </div>
        <div className="col-span-3 row-span-2 place-content-center lg:col-span-2">
          <p className="text-center text-[#CBB99F] text-[clamp(1rem,_-0.6667rem_+_4.1667vw,_2rem)] leading-[clamp(1rem,_-0.6667rem_+_4.1667vw,_2rem)] uppercase">4 <br/> Locations</p>
        </div>
        <div className="col-span-3 row-span-2 lg:col-span-2">
          <img className="object-cover object-center" src="/../../images/tony-litvyak-glPVwPr1FKo-unsplash_2400x3600.jpg" alt="smile" />
        </div>
        <div className="col-span-6 row-span-2 py-8 lg:col-span-2 place-content-center">
          <p className="text-center text-[#CBB99F] text-[clamp(1rem,_-0.6667rem_+_4.1667vw,_2rem)] leading-[clamp(1rem,_-0.6667rem_+_4.1667vw,_2rem)] uppercase">We Use <br/> Modern Technology</p>
        </div>
      </div>
    </section>
  )
}

      // <motion.div ref={constraintsRef} className="grid grid-cols-5 col-span-1 gap-4 p-8 prose border-2 border-blue-300 border-dashed rounded-full place-items-end place-content-end aspect-w-1 aspect-h-1 lg:prose-xl">
      //   <motion.div className="flex col-span-1 p-8 text-center border border-pink-300 rounded-full aspect-square item place-content-center place-items-center" drag dragConstraints={constraintsRef}>
      //     <p><span className="text-2xl">4</span> Convenient Locations</p>
      //   </motion.div>
      //   <motion.div className="flex col-span-1 p-8 text-center border border-pink-300 rounded-full aspect-square item place-content-center place-items-center" drag dragConstraints={constraintsRef}>
      //     <p>Leaders in the industry</p>
      //   </motion.div>
      //   <motion.div className="flex col-span-1 p-8 text-center border border-pink-300 rounded-full aspect-square item place-content-center place-items-center" drag dragConstraints={constraintsRef}>
      //     <p>Modern office settings</p>
      //   </motion.div>
      //   <motion.div className="flex col-span-1 p-8 text-center border border-pink-300 rounded-full aspect-square item place-content-center place-items-center" drag dragConstraints={constraintsRef}>
      //     <p>Over 50+ years of experience</p>
      //   </motion.div>
      //   <motion.div className="flex col-span-1 p-8 text-center border border-pink-300 rounded-full aspect-square item place-content-center place-items-center" drag dragConstraints={constraintsRef}>
      //     <p>Financial options</p>
      //   </motion.div>
      // </motion.div>


//  <div className="relative self-center w-full md:w-1/2">
//           <img
//             className="w-full"
//             src="/../../images/smilescholarship.jpg"
//             alt="Frey Smiles patient receiving FreySmile scholarship"
//           />
//           <div className="absolute bottom-0 right-0 w-1/2 -translate-y-1/2 -translate-x-1/3">
//             <div className="flex flex-col overflow-hidden shadow-[5px_5px_rgba(0,_98,_90,_0.4),_10px_10px_rgba(0,_98,_90,_0.3),_15px_15px_rgba(0,_98,_90,_0.2),_20px_20px_rgba(0,_98,_90,_0.1),_25px_25px_rgba(0,_98,_90,_0.05)] text-center bg-white p-8">
//               <h3 className="font-helvetica-now-thin">Giving Back</h3>
//             </div>
//           </div>
//         </div>
