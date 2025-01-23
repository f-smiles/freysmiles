"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
// import DotPattern from "../svg/DotPattern";
import {
  motion,
  useScroll,
  useSpring,
  useAnimation,
  useTransform,
} from "framer-motion";
import gsap from "gsap";

import { ScrollSmoother } from "gsap-trial/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap-trial/all";

// function Invisalign() {
//   const sectionRef = useRef()
//   const { scrollYProgress } = useScroll({
//     target: sectionRef,
//     offset: ["end end", "center center"],
//   })
//   const springScroll = useSpring(scrollYProgress, {
//     stiffness: 100,
//     damping: 30,
//     restDelta: 0.001
//   })
//   const scale = useTransform(springScroll, [0, 1], [1.2, 0.9])
//   const transformText = useTransform(springScroll, [0, 1], ["0%", "150%"])
//   const transformCase = useTransform(springScroll, [0, 1], ["150%", "0%"])
//   const transformRetainer = useTransform(springScroll, [0, 1], ["-150%", "-100%"])

//   return (
//     <section ref={sectionRef} className="container flex flex-col-reverse py-24 mx-auto overflow-hidden lg:flex-row lg:items-start">

//       <div className="lg:w-1/2">
//         <motion.img style={{ translateY: transformCase }} className="object-cover w-full h-auto mx-auto object-start" src="/../../../images/invisalign_case_transparent.png" alt="invisalign case" />
//         <motion.img style={{ translateY: transformRetainer, scale }} className="object-cover w-3/4 h-auto object-start ml-36 lg:ml-24 xl:ml-36" src="/../../../images/invisalign_bottom.png" alt="invisalign bottom" />
//       </div>
//     </section>
//   )
// }

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

const Section = ({ children, onHoverStart, onHoverEnd }) => (
  <motion.div
    onHoverStart={onHoverStart}
    onHoverEnd={onHoverEnd}
    style={{
      height: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      backgroundColor: "transparent",
      color: "black",
      fontSize: "2em",
      fontFamily: "HelveticaNeue-Light",
      userSelect: "none",
      position: "relative",
      zIndex: 2,
      textAlign: "center",
      width: "100%",
      boxSizing: "border-box",
      border: "1px solid black",
    }}
  >
    {children}
  </motion.div>
);

const Invisalign = () => {
  const headingRef = useRef(null);

  useEffect(() => {
    gsap.killTweensOf(".lineChild, .lineParent");

    const split = new SplitText(headingRef.current, {
      type: "lines",
      linesClass: "lineChild",
    });
    new SplitText(headingRef.current, {
      type: "lines",
      linesClass: "lineParent",
    });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: headingRef.current,
        start: "top bottom",
        toggleActions: "restart pause resume pause",
      },
    });
    tl.from(".lineChild", {
      y: 50,
      duration: 0.75,
      stagger: 0.25,
      autoAlpha: 0,
    });

    return () => {
      split.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);
  const controls = useAnimation();

  const handleHover = (index) => {
    controls.start({
      y: `${index * 100}%`,
      transition: { type: "tween", duration: 0.3 },
    });
  };

  const alignerRef = useRef(null);

  useEffect(() => {
    gsap.to(alignerRef.current, {
      y: -100,
      ease: "power1.out",
      scrollTrigger: {
        trigger: alignerRef.current,
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
    });
  }, []);


  const cardRefs = useRef([]);

  useEffect(() => {
    cardRefs.current.forEach((card, index) => {
      const cardBg = card.querySelector(".feature-card-bg");
      const i = index + 1;

      const fade = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "bottom bottom-=25%",
          end: "bottom top",
          scrub: true,
          markers: false,
        },
      });

      const scale = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "bottom bottom-=25%",
          end: "bottom top",
          scrub: true,
          markers: false,
        },
      });

      if (index + 1 !== cardRefs.current.length) {
        fade.fromTo(cardBg, { opacity: 0 }, { opacity: `0.${index + 1}` });

        scale.to(card, { scale: 0.8 + i / 10 });
      }
    });
  }, []);

  const features = [
    {
      text: "Invisalign has worked for over a million smiles across the country. Some dentists and orthodontists may not feel comfortable recommending Invisalign to their patients, but as Diamond Plus providers of Invisalign and Invisalign Teen (top 1% of Invisalign providers in the US) we have the experience to deliver the smile you deserve. Dr. Gregg Frey and Dr. Daniel Frey have treated many hundreds of patients with this leading-edge appliance system. Their expertise shows in the smile results of their satisfied patients. The cost of Invisalign treatment is comparable to the cost of braces.",
      image: "https://picsum.photos/400/300?random=1",
    },
    {
      text: "Invisalign uses a series of customized, clear aligners to straighten teeth faster and with fewer office visits than traditional braces. Thousands of orthodontists in the United States and Canada use Invisalign to accurately and effectively treat their patients. This type of treatment in the hands of experts delivers fantastic results. Aligners are:",
      image: "https://picsum.photos/400/300?random=1",
    },
    {
      text: "Customized just for you – Your aligners are customized to fit your mouth. Dr. Frey and Dr. Frey uses advanced 3-D computer imaging technology to replicate an exact impression of your mouth and teeth, then our doctors customize each aligner treatment plan specific to your needs. This RX is sent to the lab that fabricates a series of your custom aligners so that they fit your mouth, and over time they move your teeth into the proper position.",
      image: "https://picsum.photos/400/300?random=1",
    },
  ];
  

  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-8">
        <div className="grid grid-rows-2 gap-8 w-full max-w-screen-xl mx-auto md:grid-cols-2">
          <div className="font-helvetica-neue-light flex flex-col justify-start">
            <div className="flex items-start mt-24 ">
              <div className="text-content text-left max-w-xl">
                <h1 className="text-[48px] md:text-[48px] mb-6 leading-tight">
                  Solutions designed <br /> to fit your needs
                </h1>
                <p className="text-lg font-neue-montreal text-gray-600">
                  As Diamond Plus providers of Invisalign and Invisalign
                  Teen—ranked within the top 1% of practitioners nationwide—we
                  are equipped with the expertise necessary to deliver the smile
                  you aspire to attain. Under the skilled guidance of our
                  doctors, countless individuals have experienced the
                  transformative benefits of this advanced orthodontic
                  treatment.
                </p>
              </div>
            </div>

            <div className="image-content flex mt-16">
              <img
                ref={alignerRef}
                src="../images/invisalignset.png"
                alt="aligner"
                className="w-[400px] h-[400px] object-contain"
                style={{
                  willChange: "transform",
                }}
              />
            </div>
          </div>

          <div className="relative hidden md:flex justify-end items-start">
            <div
              className="rounded-full bg-black absolute top-[100px] right-60"
              style={{ height: "450px", width: "300px" }}
            ></div>
            <div
              className="rounded-full bg-black absolute top-[200px] -right-14"
              style={{ height: "450px", width: "300px" }}
            ></div>
          </div>
        </div>
      </div>
      <div className="feature-jacket">
      <ul className="feature-cards">
        {features.map((feature, index) => (
         <li
         className={`feature-card feature-card-${index + 1}`}
         key={index}
         ref={(el) => (cardRefs.current[index] = el)}
       >
         <div>
           <span className="feature-card-bg"></span>
           <img
             src={feature.image}
             alt={`Feature ${index + 1}`}
             className="feature-card w-full h-auto rounded-lg mb-4"
           />
           <p className="feature-card">{feature.text}</p>
         </div>
       </li>
        ))}
      </ul>
    </div>
      <div className=" bg-[#FFF7F4]">
        <div
          style={{
            backgroundImage: "url('../images/invisalignset.png')",
            backgroundSize: "30%",
          }}
          className="bg-contain bg-no-repeat  h-screen p-10"
        >
          <main className="flex flex-col items-center justify-end h-screen relative">
            <div
              style={{
                position: "absolute",
                top: "0%",
                left: "50%",
                width: "50%",
                height: "50%",
                backgroundImage: "url('../images/alignercase.png')",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
            <div className="z-10 flex flex-col ">
              <div className="w-full pb-20 ">
                <h1 className="text-[7em] font-bold leading-none">
                  <div className="mb-4">SOLUTIONS</div>
                  <div>
                    <span className="px-2 rounded-full  border border-black">
                      DESIGNED
                    </span>{" "}
                    TO FIT
                  </div>
                  <div className="flex ">
                    <span className="mt-4">YOUR NEEDS</span>
                    <div className="-mt-10">
                      <Link href="/book-now">
                        <button
                          data-text="BOOK CONSULT"
                          className="link link--leda font-cera-bold bg-[#F5FF7D] font-bold py-6 px-16 rounded-full ml-4 text-[.3em]"
                        >
                          BOOK CONSULT
                        </button>
                      </Link>
                    </div>
                  </div>
                </h1>
              </div>
            </div>
          </main>
        </div>
        <div className="text-white min-h-screen flex relative">
          <div className="flex w-full min-h-screen">
            <div className="flex-1">
              <video
                autoPlay
                loop
                muted
                style={{
                  width: "60%",
                  height: "80%",
                  objectFit: "contain",
                }}
              >
                <source src="../images/invisfullvideo.mov" type="video/mp4" />{" "}
                Your browser does not support the video tag.
              </video>{" "}
            </div>
            <div
              className="w-1/3 relative"
              style={{ height: "600px", overflow: "hidden" }}
            >
              <motion.div
                initial={{ y: "0%" }}
                animate={controls}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "50%",
                  background: "rgb(245,255,125,.6)",
                  zIndex: 1,
                }}
              />

              <Section onHoverStart={() => handleHover(0)}>
                A healthier journey to a better smile
              </Section>
              <Section onHoverStart={() => handleHover(1)}>
                Fewer appointments, faster treatment
              </Section>
            </div>
          </div>
        </div>
        <div className="flex  items-center ">
          <div className="w-1/2">
            <h1 ref={headingRef} className="  max-w-xl text-xl overflow-hidden">
              Our team, led by the skilled Dr. Gregg and Dr. Daniel, possesses
              the expertise required to achieve the smile you desire. Countless
              individuals have already experienced the transformative effects of
              our advanced orthodontic treatments
            </h1>
          </div>
          <div className="rounded-2xl max-w-xl bg-black w-1/3  items-center">
            <div className="h-[32rem]">
              <svg role="group" viewBox="0 0 233 184">
                <defs>
                  <pattern
                    id="grid"
                    width="16"
                    height="10"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="15" cy="5" r="1" fill="grey" />
                  </pattern>
                </defs>

                <rect width="100%" height="100%" fill="url(#grid)" />

                <g
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                >
                  <path
                    stroke="#3a3d4c"
                    d="M37.05 102.4s11.09 23.44 28.46 23.44 22.3-36 47.05-36 28.4 33.7 39.83 33.7S164.74 102.1 199 102.1"
                  />

                  <path
                    class="squiggle"
                    pathLength="1"
                    stroke="#FD6635"
                    d="M37.05 102.4s11.09 23.44 28.46 23.44 22.3-36 47.05-36c11.63 0 18.61 7.45 23.92 15.35"
                  />
                </g>

                <g fill="none" stroke-linecap="round" stroke-width="1">
                  <path
                    stroke="#3a3d4c"
                    stroke-linejoin="round"
                    d="M37.05 92.88s8.34-12.11 25.72-12.11S88.6 111.86 111 111.86s22-37.27 35.21-37.27 13.49 34 51.9 12.35"
                  />

                  <path
                    class="squiggle squiggle-2"
                    pathLength="1"
                    stroke="#EBE3F5"
                    stroke-miterlimit="10"
                    d="M37.05 92.88s8.34-12.11 25.72-12.11S88.6 111.86 111 111.86c14 0 19.08-14.56 24.15-25.47"
                  />
                </g>

                <g
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                >
                  <path
                    stroke="#3a3d4c"
                    d="M37.05 72.9s14.52-7.55 26.63-7.55 20.81 18.91 39.56 18.91 29.26-24.39 44.58-24.39S167.25 81.59 199 81.59"
                  />

                  <path
                    class="squiggle squiggle-3"
                    pathLength="1"
                    stroke="#BCE456"
                    d="M37.05 72.9s14.52-7.55 26.63-7.55 20.81 18.91 39.56 18.91 29.26-24.39 44.58-24.39c7 0 11.66 4.54 17.7 9.47"
                  />
                </g>
                <foreignObject width="200" height="200">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "120%",
                      height: "120%",
                    }}
                  >
                    <img
                      src="../images/logo_icon.png"
                      alt="Description"
                      style={{ width: "24px", height: "24px" }}
                    />
                  </div>
                </foreignObject>
              </svg>
            </div>
          </div>
        </div>

        <div></div>
      </div>
    </>
  );
};
export default Invisalign;
