"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PurpleOrange from "../_components/shapes/PurpleOrange.js";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap-trial";
import { motion, useScroll, useTransform } from "framer-motion";
import ArrowLeftIcon from "../_components/ui/ArrowLeftIcon";
import ArrowRightIcon from "../_components/ui/ArrowRightIcon";
import { ScrollSmoother } from "gsap-trial/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap-trial/all";
import Lenis from "@studio-freight/lenis";
import useIsomorphicLayoutEffect from "@/_helpers/isomorphicEffect";
gsap.registerPlugin(ScrollSmoother, ScrollTrigger, SplitText);

export default function OurTeam() {
  return (
    <>
      <DoctorsSection />
      <MembersSection />
    </>
  );
}

function DoctorsSection() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const [index, setIndex] = useState(1);
  const [switchDoctor, setSwitchDoctor] = useState(false);

  const toggleSwitchDoctor = () => {
    setSwitchDoctor(!switchDoctor);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        ".headline",
        { scale: 1, autoAlpha: 1 },
        {
          scale: 200,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".intro",
            start: "top top",
            end: "bottom 50%",
            scrub: true,
          },
        }
      );

      gsap.to(".headline-section", {
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".intro",
          start: "top top",
          end: "bottom 10%",
          scrub: true,
        },
      });

      gsap.fromTo(
        ".card",
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          ease: "power1.in",
          scrollTrigger: {
            trigger: ".intro",
            scrub: 0.3,
            start: "-20% center",
            end: "30% center",
          },
        }
      );

      gsap.to(".top", {
        backgroundColor: "#FBFFFE",
        scrollTrigger: {
          trigger: ".intro",
          scrub: true,
          start: "-20% center",
          end: "top center",
        },
      });
    }
  }, []);

  return (
    <section>
      <div></div>

      <div
        className="headline-section"
        style={{
          backgroundColor: "#1B1B1E",
          // backgroundImage: '../_components/shapes/PurpleOrange.js',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "#FBFFFE",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <PurpleOrange
          className="headline-section"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            transform: "rotate(90deg)",
          }}
        />
        <h1
          className="font-novela-regular headline"
          style={{
            textAlign: "center",
            fontSize: "3rem",
            textTransform: "uppercase",
          }}
        >
          MEET OUR TEAM
        </h1>
      </div>

      <div
        style={{
          backgroundColor: "#FBFFFE",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        {/* <div className="w-full px-6 mx-auto mb-12 lg:px-8 max-w-7xl">
        <h1 className="tracking-tight font-helvetica-now-thin">
          Our Doctors
        </h1>
      </div> */}
        <div className="grid grid-cols-12 gap-8 px-6 mx-auto max-w-7xl lg:px-8">
          <div className="col-span-12 col-start-1 grid-rows-2 space-y-8 lg:col-span-6">
            {/* slider controls */}
            <div
              id="controls"
              className="flex items-center justify-center space-x-4"
            >
              <button
                className="z-0 p-3 transition-all duration-200 ease-linear border rounded-full hover:text-white text-primary-50 border-primary-50 hover:bg-primary-50"
                onClick={toggleSwitchDoctor}
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <span>0{!switchDoctor ? index : index + 1} - 02</span>
              <button
                className="z-0 p-3 transition-all duration-200 ease-linear border rounded-full hover:text-white text-primary-50 border-primary-50 hover:bg-primary-50"
                onClick={toggleSwitchDoctor}
              >
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="row-span-1 row-start-2">
              {/* doctor bio */}
              {switchDoctor ? (
                <p>
                  Dr. Daniel Frey graduated from high school in 2005. He then
                  pursued his pre-dental requisites at the University of
                  Pittsburgh, majoring in Biology. Dr. Frey excelled in his
                  studies and was admitted to Temple University&apos;s dental
                  school, graduating at the top of his class with the
                  prestigious Summa Cum Laude designation. Continuing his
                  education, Dr. Frey was admitted to the esteemed orthodontic
                  residency program at the University of the Pacific in San
                  Francisco where he worked with students and faculty from
                  around the world and utilized cutting-edge orthodontic
                  techniques. During his time in San Francisco, he conducted
                  research in three-dimensional craniofacial analysis and earned
                  his Master of Science degree. Dr. Frey is a member of the
                  American Association of Orthodontists and the American Dental
                  Association. In his leisure time, he enjoys staying active
                  outdoors, camping, playing music, and spending time with loved
                  ones.
                </p>
              ) : (
                <p>
                  Dr. Gregg Frey is an orthodontist based in Pennsylvania, who
                  graduated from Temple University School of Dentistry with
                  honors and served in the U.S. Navy Dental Corps before
                  establishing his practice in the Lehigh Valley. He is a
                  Diplomat of the American Board of Orthodontics and has
                  received numerous distinctions, accreditations, and honors,
                  including being named one of America&apos;s Top Orthodontists
                  by the Consumer Review Council of America. This distinction is
                  held by fewer than 25% of orthodontists nationwide. ABO
                  certification represents the culmination of 5-10 years of
                  written and oral examinations and independent expert review of
                  actual treated patients. Recently Dr. Frey voluntarily
                  re-certified. Dr. Frey enjoys coaching soccer, vintage car
                  racing, and playing the drums.
                </p>
              )}
            </div>
          </div>
          <div className="col-span-7 lg:col-span-4 lg:col-start-7">
            <figure className="w-full aspect-[3/4] h-max overflow-hidden flex items-start">
              <img
                className={`${
                  switchDoctor ? "right" : "switch-right"
                } object-contain w-full transition-all duration-2000`}
                src="../../images/team_members/GreggFrey.jpg"
                alt="Dr. Gregg Frey"
              />
              <img
                className={`${
                  switchDoctor ? "left" : "switch-left"
                } object-contain w-full transition-all duration-2000`}
                src="../../images/team_members/DanFrey.jpg"
                alt="Dr. Daniel Frey"
              />
            </figure>
            <figcaption className="tracking-tight font-helvetica-now-thin">
              <h4>{!switchDoctor ? "Dr. Gregg Frey" : "Dr. Daniel Frey"}</h4>
              <p className="tracking-tight font-helvetica-now-thin">
                {!switchDoctor ? "DDS" : "DMD, MSD"}
              </p>
            </figcaption>
          </div>
          <div className="col-span-5 lg:col-span-2 lg:col-start-11">
            <figure
              className="grayscale h-max w-full aspect-[3/4] overflow-hidden flex items-start hover:cursor-pointer"
              onClick={toggleSwitchDoctor}
            >
              <img
                className={`${
                  switchDoctor ? "right" : "switch-right"
                } object-contain w-full transition-all duration-2000`}
                src="../../images/team_members/DanFrey.jpg"
                alt="Dr. Daniel Frey"
              />
              <img
                className={`${
                  switchDoctor ? "left" : "switch-left"
                } object-contain w-full transition-all duration-2000`}
                src="../../images/team_members/GreggFrey.jpg"
                alt="Dr. Gregg Frey"
              />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

function MembersSection() {

  const [isVisible, setIsVisible] = useState(false);
  const cardsRef = useRef(null);
  const block1Ref = useRef(null);
  const block2Ref = useRef(null);
  const block3Ref = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY - cardsRef.current.offsetTop;

      const block1X = scrollY * 0.6;
      const block1Y = scrollY * 0.4;
      block1Ref.current.style.transform = `translate(${block1X}px, ${block1Y}px)`;

      const block2X = scrollY * 0.2;
      const block2Y = -scrollY * 0.5;
      block2Ref.current.style.transform = `translate(${block2X}px, ${block2Y}px)`;

      const block3X = -scrollY * 0.8;
      const block3Y = scrollY * 0.3;
      block3Ref.current.style.transform = `translate(${block3X}px, ${block3Y}px)`;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div>
      <div className="cards" ref={cardsRef}>

  <div
    ref={block1Ref}
    id="block-1"
    className="block absolute text-center text-3xl rounded-full bg-pink-300"
    style={{ width: "200px", height: "200px",}}
  >
Our members are X-ray certified
  </div>

 
  <div
    ref={block2Ref}
    id="block-2"
    className="block absolute text-center text-3xl rounded-full bg-blue-300"
    style={{ width: "300px", height: "300px",  }}
  >
Trained in CPR and first aid
  </div>


  <div
    ref={block3Ref}
    id="block-3"
    className="block absolute text-center text-3xl rounded-full bg-orange-400"
    style={{ width: "400px", height: "400px"}}
  >
Designated by AAO as Specialized Orthodontic Assistant{" "}
          <Link
            href="https://www.trapezio.com/training-resources/course-outlines/soa-prep-course-outline/"
            className="underline transition duration-200 underline-offset-4 text-secondary-40 hover:text-secondary-50"
          >
            (SOA)
          </Link>
          -a voluntary certification program to recognize those in the profession for
          their knowledge and experience.
  </div>
</div>

      </div>
      {/* <div className="container">
 

 <div className="card ">
 <svg className="svg-background" viewBox="0 -250 600 600">
     <path
       className="blob"
       d="M194.1,-154.4C241.7,-95.1,263.7,-14.9,242.8,47C222,108.9,158.3,152.7,93.7,177.1C29.1,201.5,-36.4,206.6,-87.6,182C-138.8,157.3,-175.7,102.9,-189.7,42.9C-203.7,-17.1,-194.9,-82.8,-159.5,-139.3C-124.1,-195.9,-62,-243.5,5.6,-247.9C73.2,-252.4,146.5,-213.8,194.1,-154.4Z"
     />
   </svg>

   <div className="top-section">
   <div className="circular-border" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100px', height: '100px', borderRadius: '50%',}}>
     <img
    className="w-12 h-12"
    src="/../images/teeth_x-ray256px.png"
  />
     </div>
   </div>

   <p className="text-white">Our members are X-ray certified</p>
 </div>

 <div className="card">
 <svg className="svg-background" viewBox="0 -250 600 600">
  <path
    className="blob"
    d="M192.1,-148.2C230,-105.8,228.6,-27,204.4,33.7C180.2,94.3,133.3,136.8,77.7,165C22.1,193.1,-42.1,206.9,-94.5,185.7C-146.9,164.5,-187.5,108.3,-201.7,46C-215.9,-16.2,-203.7,-84.5,-165.7,-127C-127.7,-169.5,-63.8,-186.3,6.6,-191.6C77.1,-196.9,154.3,-190.7,192.1,-148.2Z"
  />
</svg>
 

   <div className="top-section">
   <div className="circular-border" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100px', height: '100px', borderRadius: '50%'}}>
  <img
    className="w-12 h-12"
    src="/../images/38673.svg"
  />
</div>


   </div>

   <p className="text-white">Trained in CPR and first aid</p>
 </div>

 <div className="card">
 <svg className="svg-background" viewBox="0 -250 600 600">
     <path
       className="blob"
       d="M194.1,-154.4C241.7,-95.1,263.7,-14.9,242.8,47C222,108.9,158.3,152.7,93.7,177.1C29.1,201.5,-36.4,206.6,-87.6,182C-138.8,157.3,-175.7,102.9,-189.7,42.9C-203.7,-17.1,-194.9,-82.8,-159.5,-139.3C-124.1,-195.9,-62,-243.5,5.6,-247.9C73.2,-252.4,146.5,-213.8,194.1,-154.4Z"
     />
   </svg>

   <div className="top-section">
   <div className="circular-border" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100px', height: '100px', borderRadius: '50%'}}>
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-24 h-auto">
  <path fill-rule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
</svg>

     </div>
   </div>

   <p className="text-white"> Designated by AAO as Specialized Orthodontic Assistant{" "}
          <Link
            href="https://www.trapezio.com/training-resources/course-outlines/soa-prep-course-outline/"
            className="underline transition duration-200 underline-offset-4 text-secondary-40 hover:text-secondary-50"
          >
            (SOA)
          </Link>
          -a voluntary certification program to recognize those in the profession for
          their knowledge and experience.</p>

 </div>
</div> */}
      <section className="mt-20">
        {/* <h2 className="mb-6 text-center capitalize md:mb-8 text-primary-30">Our Members</h2>
        <p className="sm:text-left md:text-center">
          Our members are X-ray certified, trained in CPR and first aid and most
          of them have received the designation of Specialized Orthodontic
          Assistant{" "}
          <Link
            href="https://www.trapezio.com/training-resources/course-outlines/soa-prep-course-outline/"
            className="underline transition duration-200 underline-offset-4 text-secondary-40 hover:text-secondary-50"
          >
            (SOA)
          </Link>
          . This is a voluntary certification program started by the American
          Association of Orthodontists to recognize those in the profession for
          their knowledge and experience.
        </p> */}

        <div className={`users-color-container ${isVisible ? "animate" : ""}`}>
          <img
            className={`item ${isVisible ? "animate" : ""}`}
            src="/../../images/team_members/kayli-Photoroom.png"
            style={{ "--i": 1 }}
            alt=""
          />
          <img
            className="item"
            src="/../../images/team_members/alyssa-Photoroom.png"
            style={{ "--i": 2 }}
            alt=""
          />
          <img
            className="item"
            src="/../../images/team_members/nicolle-Photoroom.png"
            style={{ "--i": 3 }}
            alt=""
          />
          <img
            className="item"
            src="/../../images/team_members/adriana-photoroom.png"
            style={{ "--i": 4 }}
            alt=""
          />
          <img
            className="item"
            src="/../../images/team_members/grace-Photoroom.png"
            style={{ "--i": 5 }}
            alt=""
          />
          <img
            className="item"
            src="/../../images/team_members/lexi-photoroom.jpg"
            style={{ "--i": 10 }}
            alt=""
          />
          <span className="item" style={{ "--i": 11 }}></span>
          <img
            className="item"
            src="/../../images/team_members/elizabeth-photoroom.png"
            style={{ "--i": 12 }}
            alt=""
          />
          <span className="item" style={{ "--i": 9 }}></span>
          <img
            className="item"
            src="/../../images/team_members/dana-photoroom.png"
            style={{ "--i": 8 }}
            alt=""
          />
          <span className="item" style={{ "--i": 7 }}></span>
          <img
            className="item"
            src="/../../images/team_members/lizzie-photoroom.png"
            style={{ "--i": 6 }}
            alt=""
          />
        </div>
      </section>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        body {
          font-family: sans-serif;
          color: white;
          background-color: rgb(1, 40, 51);
          text-align: center;
          padding-top: 2em;
        }
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .card {
          position: relative;
          display: inline-block;
          border-radius: 10px;
          width: 250px;
          height: 300px;
          padding: 20px;
          overflow: hidden;
          cursor: pointer;
          text-align: left;
        }
        .svg-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 120%;
          height: 120%;
          z-index: -1;
        }

        .blob {
          transform: translate(23%, 3%) scale(0.65);
          fill: rgb(217, 197, 180);
          transition: 0.4s;
        }

        .card.active .blob {
          fill: #d9c5b4;
          transform: translate(23%, 3%) scale(3.75);
        }

        .card.active .bg-overlay {
          opacity: 0;
        }

        .circular-border {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background-color: rgb(200, 180, 214);
          position: relative;
        }

        i {
          font-style: normal;
          font-size: 35px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        p {
          opacity: 0;
          transition: 0.4s;
        }

        .card.active p {
          opacity: 1;
        }
      `}</style>
      <style jsx>{`
        .users-color-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 20px;
        }

        .item {
          max-width: 200px;
          aspect-ratio: 1/1;
          box-shadow: 0 8px 8px rgba(0, 0, 0, 0.1),
            inset 0px 2px 2px rgba(255, 255, 255, 0.2);
          opacity: 0;
          transform: scale(0);
          animation: fadeIn 0.5s linear forwards;
          animation-delay: calc(0.2s * var(--i));
        }

        .item:nth-child(1) {
          border-radius: 50% 50% 0 50%;
        }
        .item:nth-child(2) {
          border-radius: 50% 50% 0 0;
        }
        .item:nth-child(3) {
          background-color: #6cc164;
          border-radius: 50%;
        }
        .item:nth-child(4) {
          border-radius: 0 0 0 50%;
        }
        .item:nth-child(5) {
          border-radius: 0 50% 50% 0;
        }
        .item:nth-child(6) {
          border-radius: 0 50% 50% 50%;
        }
        .item:nth-child(7) {
          background-color: #b2a597;
          border-radius: 50% 50% 0 50%;
        }
        .item:nth-child(8) {
          border-radius: 50% 0 0 50%;
        }
        .item:nth-child(9) {
          background-color: #aa98a9;
          border-radius: 0 50% 50% 0;
        }
        .item:nth-child(10) {
          border-radius: 50%;
        }
        .item:nth-child(11) {
          background-color: #977173;
          border-radius: 50% 0 50% 50%;
        }
        .item:nth-child(12) {
          border-radius: 50% 0 0 0;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>

    //   <main>
    //      <style>{`

    //       @keyframes loaderAnim {
    //         to {
    //           opacity: 1;
    //           transform: scale3d(0.5,0.5,1);
    //         }
    //       }

    //       .unbutton {
    //         background: none;
    //         border: 0;
    //         padding: 0;
    //         margin: 0;
    //         font: inherit;
    //       }

    //       .unbutton:focus {
    //         outline: none;
    //       }

    //       .grid {
    //         position: relative;
    //         width: 100%;
    //         display: grid;
    //         grid-template-columns: repeat(8,1fr);
    //       }

    //       .grid__item {
    //         position: relative;
    //         will-change: transform;
    //         grid-column: var(--c);
    //         grid-row: var(--r);
    //       }

    //       .grid__item-img {
    //         position: relative;
    //         width: 100%;
    //         height: auto;
    //         aspect-ratio: 1;
    //         background-size: cover;
    //         background-position: 50% 50%;
    //         will-change: transform, opacity;
    //       }

    //       .cover {
    //         position: fixed;
    //         width: 100%;
    //         height: 100vh;
    //         top: 0;
    //         left: 0;
    //         display: flex;
    //         flex-direction: column;
    //         align-items: center;
    //         justify-content: center;
    //         pointer-events: none;

    //         background-size: 50%;
    //         background-repeat: no-repeat;
    //         background-position: center center;
    //         padding: 20px;
    //       }

    //       .cover__title {
    //         font-family: novecento-sans-wide, sans-serif;
    //         font-size: 8vw;
    //         font-weight: 600;
    //         margin: 0;
    //       }

    //       @media screen and (min-width: 53em) {
    //         .frame {
    //           height: 100vh;
    //           grid-template-columns: auto 1fr;
    //           grid-template-rows: auto 1fr auto;
    //           grid-template-areas: 'prev sponsor' '... ...' 'title demos';
    //         }

    //         .frame__demos {
    //           justify-self: end;
    //           margin: 0 1rem;
    //           white-space: nowrap;
    //         }
    //         .frame__demo--current::after {
    //           content: '';
    //           position: absolute;
    //           top: 100%;
    //           height: 120%;
    //           width: 1px;
    //           left: 50%;
    //           background: currentColor;
    //         }
    //         .frame__demos-title {
    //           display: inline;
    //         }
    //       }
    //     `}</style>
    //   <div className="frame">
    //     <div className="frame__title">
    //     <h2 className="mb-6 text-center capitalize md:mb-8 text-primary-30">Our Members</h2>
    //       <p className="sm:text-left md:text-center">
    //         Our members are X-ray certified, trained in CPR and first aid and most
    //         of them have received the designation of Specialized Orthodontic
    //         Assistant{" "}
    //         <Link
    //           href="https://www.trapezio.com/training-resources/course-outlines/soa-prep-course-outline/"
    //           className="underline transition duration-200 underline-offset-4 text-secondary-40 hover:text-secondary-50"
    //         >
    //           (SOA)
    //         </Link>
    //         . This is a voluntary certification program started by the American
    //         Association of Orthodontists to recognize those in the profession for
    //         their knowledge and experience.
    //       </p>
    //     </div>
    //     <nav className="frame__demos">
    //       <span className="frame__demos-title">Contact: </span>
    //       <a href="index.html" className="frame__demo">
    //         1
    //       </a>
    //     </nav>
    //   </div>

    //   <div className="content">
    //   <div className="content" ref={gridRef}>
    //     <div className="grid">
    //       <div className="grid__item" style={{'--r': 1, '--c': 4}}>
    //         <div className="grid__item-img" style={{backgroundImage: `url('https://images.unsplash.com/photo-1673297353129-2e3fc26170a1?')`}}></div>
    //       </div>
    //       <div className="grid__item" style={{'--r': 2, '--c': 8}}>
    //         <div className="grid__item-img" style={{backgroundImage: `url('https://images.unsplash.com/photo-1673297353129-2e3fc26170a1?')`}}></div>
    //       </div>
    //       <div className="grid__item" style={{'--r': 2, '--c': 5}}>
    //         <div className="grid__item-img" style={{backgroundImage: `url('https://images.unsplash.com/photo-1673297353129-2e3fc26170a1?')`}}></div>
    //       </div>
    //       <div className="grid__item" style={{'--r': 3, '--c': 3}}>
    //         <div className="grid__item-img" style={{backgroundImage: `url('https://images.unsplash.com/photo-1673297353129-2e3fc26170a1?')`}}></div>
    //       </div>
    //       <div className="grid__item" style={{'--r': 3, '--c': 1}}>
    //         <div className="grid__item-img" style={{backgroundImage: `url('https://images.unsplash.com/photo-1673297353129-2e3fc26170a1?')`}}></div>
    //       </div>
    //       <div className="grid__item" style={{'--r': 4, '--c': 2}}>
    //         <div className="grid__item-img" style={{backgroundImage: `url('https://images.unsplash.com/photo-1673297353129-2e3fc26170a1?')`}}></div>
    //       </div>
    //       <div className="grid__item" style={{'--r': 4, '--c': 5}}>
    //         <div className="grid__item-img" style={{backgroundImage: `url('https://images.unsplash.com/photo-1673297353129-2e3fc26170a1?')`}}></div>
    //       </div>
    //       <div className="grid__item" style={{'--r': 5, '--c': 6}}>
    //         <div className="grid__item-img" style={{backgroundImage: `url('https://images.unsplash.com/photo-1673297353129-2e3fc26170a1?')`}}></div>
    //       </div>
    // 			<div class="grid__item" style={{'--r':6, '--c': 2}}>
    // 				<div class="grid__item-img" style={{backgroundImage: `url('https://images.unsplash.com/photo-1673297353129-2e3fc26170a1?')`}}></div>
    // 			</div>
    //       <div class="grid__item" style={{'--r': 7, '--c': 3}}>
    // 				<div class="grid__item-img" style={{backgroundImage: `url('https://images.unsplash.com/photo-1673297353129-2e3fc26170a1?')`}}></div>
    // 				</div>
    //         <div class="grid__item" style={{'--r': 8,'--c': 7}}>
    // 				<div class="grid__item-img" style={{backgroundImage: `url('https://images.unsplash.com/photo-1673297353129-2e3fc26170a1?')`}}></div>
    // 			</div>
    //       <div class="grid__item" style={{'--r': 8,'--c': 2}}>
    // 				<div class="grid__item-img" style={{backgroundImage: `url('https://images.unsplash.com/photo-1673297353129-2e3fc26170a1?')`}}></div>
    // 			</div>
    //     </div>
    //     </div>
    //   </div>

    //   <div className="cover"></div>

    // </main>
    // <section className="flex flex-col items-center justify-center w-full px-0 py-24 md:px-14 xl:px-8">
    //   <div className="max-w-screen-lg">
    // <h2 className="mb-6 text-center capitalize md:mb-8 text-primary-30">Our Members</h2>
    // <p className="sm:text-left md:text-center">
    //   Our members are X-ray certified, trained in CPR and first aid and most
    //   of them have received the designation of Specialized Orthodontic
    //   Assistant{" "}
    //   <Link
    //     href="https://www.trapezio.com/training-resources/course-outlines/soa-prep-course-outline/"
    //     className="underline transition duration-200 underline-offset-4 text-secondary-40 hover:text-secondary-50"
    //   >
    //     (SOA)
    //   </Link>
    //   . This is a voluntary certification program started by the American
    //   Association of Orthodontists to recognize those in the profession for
    //   their knowledge and experience.
    // </p>
    //   </div>
    //   <div className="relative flex items-center justify-center px-12 mt-8 xl:mt-14 md:px-10 2xl:px-14">
    //     <div className="relative z-10 flex flex-col items-center justify-center w-full space-y-4 sm:space-y-6 xl:space-y-0 xl:flex-row xl:space-x-6">
    //       <section className="flex flex-col items-center justify-center sm:justify-start sm:flex-row sm:items-start">
    //         <motion.div
    //           style={{ y }}
    //           className="flex flex-col items-center justify-center w-64 px-6 py-10 mb-4 space-y-8 transition duration-500 ease-in-out rounded-lg xl:w-72 md:py-14 md:mb-0 sm:mr-6 xl:mr-6 2xl:mr-8"
    //         >
    //           <img
    //             src="/../../images/team_members/Alyssa_blob.png"
    //             alt="Alyssa"
    //             className="w-3/4 xl:w-48 2xl:w-48"
    //           />
    //           <div className="flex flex-col items-center justify-center space-y-1 text-center ">
    //             <p className="text-primary-50">Alyssa</p>
    //             <p>Treatment Coordinator</p>
    //           </div>
    //         </motion.div>
    //         <motion.div
    //           style={{ y }}
    //           className="flex flex-col items-center justify-center w-64 px-6 py-10 space-y-8 transition duration-500 ease-in-out rounded-lg xl:w-72 md:py-14 sm:mt-14 xl:mt-32"
    //         >
    //           <img
    //             src="/../../images/team_members/Lexi_blob.png"
    //             alt="Lexi"
    //             className="w-3/4 xl:w-48 2xl:w-48"
    //           />
    //           <div className="flex flex-col items-center justify-center space-y-1 text-center ">
    //             <p className=" text-primary-50">Lexi</p>
    //             <p>Treatment Coordinator</p>
    //           </div>
    //         </motion.div>
    //       </section>
    //       <section className="flex flex-col items-center justify-center sm:justify-start sm:flex-row sm:items-start">
    //         <motion.div
    //           style={{ y }}
    //           className="flex flex-col items-center justify-center w-64 px-6 py-10 mb-4 space-y-8 transition duration-500 ease-in-out rounded-lg xl:w-72 md:py-14 md:mb-0 sm:mr-6 xl:mr-6 2xl:mr-8"
    //         >
    //           <img
    //             src="/../../images/team_members/Dana_blob.png"
    //             alt="Dana"
    //             className="w-3/4 xl:w-48 2xl:w-48"
    //           />
    //           <div className="flex flex-col items-center justify-center space-y-1 text-center">
    //             <p className="text-primary-50">Dana</p>
    //             <p>Marketing Operations</p>
    //           </div>
    //         </motion.div>
    //         <motion.div
    //           style={{ y }}
    //           className="flex flex-col items-center justify-center w-64 px-6 py-10 space-y-8 transition duration-500 ease-in-out rounded-lg xl:w-72 md:py-14 sm:mt-14 xl:mt-32"
    //         >
    //           <img
    //             src="/../../images/team_members/Lizzie_blob.png"
    //             alt="Lizzie"
    //             className="w-3/4 xl:w-48 2xl:w-48"
    //           />
    //           <div className="flex flex-col items-center justify-center space-y-1 text-center">
    //             <p className="text-primary-50">Lizzie</p>
    //             <p>Patient Services</p>
    //           </div>
    //         </motion.div>
    //       </section>
    //     </div>
    //   </div>
    //   <div className="relative flex items-center justify-center px-12 mt-8 xl:mt-14 md:px-10 2xl:px-14">
    //     <div className="relative z-10 flex flex-col items-center justify-center w-full space-y-4 sm:space-y-6 xl:space-y-0 xl:flex-row xl:space-x-6">
    //       <section className="flex flex-col items-center justify-center sm:justify-start sm:flex-row sm:items-start">
    //         <motion.div
    //           style={{ y }}
    //           className="flex flex-col items-center justify-center w-64 px-6 py-10 mb-4 space-y-8 transition duration-500 ease-in-out rounded-lg xl:w-72 md:py-14 md:mb-0 sm:mr-6 xl:mr-6 2xl:mr-8"
    //         >
    //           <img
    //             src="/../../images/team_members/Kayli_blob.png"
    //             alt="Kayli"
    //             className="w-3/4 xl:w-48 2xl:w-48"
    //           />
    //           <div className="flex flex-col items-center justify-center space-y-1 text-center">
    //             <p className="text-primary-50">Kayli</p>
    //             <p>Financial Coordinator</p>
    //           </div>
    //         </motion.div>
    //         <motion.div
    //           style={{ y }}
    //           className="flex flex-col items-center justify-center w-64 px-6 py-10 space-y-8 transition duration-500 ease-in-out rounded-lg xl:w-72 md:py-14 sm:mt-14 xl:mt-32"
    //         >
    //           <img
    //             src="/../../images/team_members/Adriana_blob.png"
    //             alt="Adriana"
    //             className="w-3/4 xl:w-48 2xl:w-48"
    //           />
    //           <div className="flex flex-col items-center justify-center space-y-1 text-center">
    //             <p className="text-primary-50">Adriana</p>
    //             <p>Insurance Coordinator</p>
    //           </div>
    //         </motion.div>
    //       </section>
    //       <section className="flex flex-col items-center justify-center sm:justify-start sm:flex-row sm:items-start">
    //         <motion.div
    //           style={{ y }}
    //           className="flex flex-col items-center justify-center w-64 px-6 py-10 mb-4 space-y-8 transition duration-500 ease-in-out rounded-lg xl:w-72 md:py-14 md:mb-0 sm:mr-6 xl:mr-6 2xl:mr-8"
    //         >
    //           <img
    //             src="/../../images/team_members/Ibis_blob.png"
    //             alt="Ibis"
    //             className="w-3/4 xl:w-48 2xl:w-48"
    //           />
    //           <div className="flex flex-col items-center justify-center space-y-1 text-center">
    //             <p className="text-primary-50">Ibis</p>
    //             <p>Lab Manager</p>
    //           </div>
    //         </motion.div>
    //         <motion.div
    //           style={{ y }}
    //           className="flex flex-col items-center justify-center w-64 px-6 py-10 space-y-8 transition duration-500 ease-in-out rounded-lg xl:w-72 md:py-14 sm:mt-14 xl:mt-32"
    //         >
    //           <img
    //             src="/../../images/team_members/Aleah_blob.png"
    //             alt="Aleah"
    //             className="w-3/4 xl:w-48 2xl:w-48"
    //           />
    //           <div className="flex flex-col items-center justify-center space-y-2 text-center">
    //             <p className="text-primary-50">Aleah</p>
    //             <p>Specialized Orthodontic Assistant</p>
    //           </div>
    //         </motion.div>
    //       </section>
    //     </div>
    //   </div>
    //   <div className="relative flex items-center justify-center px-12 mt-8 xl:mt-14 md:px-10 2xl:px-14">
    //     <div className="relative z-10 flex flex-col items-center justify-center w-full space-y-4 sm:space-y-6 xl:space-y-0 xl:flex-row xl:space-x-6">
    //       <section className="flex flex-col items-center justify-center sm:justify-start sm:flex-row sm:items-start">
    //         <motion.div
    //           style={{ y }}
    //           className="flex flex-col items-center justify-center w-64 px-6 py-10 mb-4 space-y-8 transition duration-500 ease-in-out rounded-lg xl:w-72 md:py-14 md:mb-0 sm:mr-6 xl:mr-6 2xl:mr-8"
    //         >
    //           <img
    //             src="/../../images/team_members/Nicolle_blob.png"
    //             alt="Nicolle"
    //             className="w-3/4 xl:w-48 2xl:w-48"
    //           />
    //           <div className="flex flex-col items-center justify-center space-y-2 text-center">
    //             <p className="text-primary-50">Nicolle</p>
    //             <p>Specialized Orthodontic Assistant</p>
    //           </div>
    //         </motion.div>
    //         <motion.div
    //           style={{ y }}
    //           className="flex flex-col items-center justify-center w-64 px-6 py-10 space-y-8 transition duration-500 ease-in-out rounded-lg xl:w-72 md:py-14 sm:mt-14 xl:mt-32"
    //         >
    //           <img
    //             src="/../../images/team_members/Grace_blob.png"
    //             alt="Grace"
    //             className="w-3/4 xl:w-48 2xl:w-48"
    //           />
    //           <div className="flex flex-col items-center justify-center space-y-2 text-center">
    //             <p className="text-primary-50">Grace</p>
    //             <p>Specialized Orthodontic Assistant</p>
    //           </div>
    //         </motion.div>
    //       </section>
    //       <section className="flex flex-col items-center justify-center sm:justify-start sm:flex-row sm:items-start">
    //         <motion.div
    //           style={{ y }}
    //           className="flex flex-col items-center justify-center w-64 px-6 py-10 mb-4 space-y-8 transition duration-500 ease-in-out rounded-lg xl:w-72 md:py-14 md:mb-0 sm:mr-6 xl:mr-6 2xl:mr-8"
    //         >
    //           <img
    //             src="/../../images/team_members/Samantha_blob.png"
    //             alt="Samantha"
    //             className="w-3/4 xl:w-48 2xl:w-48"
    //           />
    //           <div className="flex flex-col items-center justify-center space-y-1 text-center">
    //             <p className="text-primary-50">Samantha</p>
    //             <p>Patient Services</p>
    //           </div>
    //         </motion.div>
    //         <motion.div
    //           style={{ y }}
    //           className="flex flex-col items-center justify-center w-64 px-6 py-10 space-y-8 transition duration-500 ease-in-out rounded-lg xl:w-72 md:py-14 sm:mt-14 xl:mt-32"
    //         >
    //           <img
    //             src="/../../images/team_members/Elizabeth_blob.png"
    //             alt="Elizabeth"
    //             className="w-3/4 xl:w-48 2xl:w-48"
    //           />
    //           <div className="flex flex-col items-center justify-center space-y-1 text-center">
    //             <p className="text-primary-50">Elizabeth</p>
    //             <p>Patient Services</p>
    //           </div>
    //         </motion.div>
    //       </section>
    //     </div>
    //   </div>
    // </section>
  );
}
