"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowLeftIcon from "../_components/ui/ArrowLeftIcon";
import ArrowRightIcon from "../_components/ui/ArrowRightIcon";
const YourTeam = () => {
  const [isVisible, setIsVisible] = useState(false);
  const cardsRef = useRef(null);
  const block1Ref = useRef(null);
  const block2Ref = useRef(null);
  const block3Ref = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      if (!cardsRef.current) return;
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
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const headerRevealAnimation = gsap.to(".header-reveal", {
      scale: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".headerFirst",
        start: "top top",

        scrub: 1,
        pin: true,
        end: "+=2000",
        onEnter: () =>
          gsap.to("body", { backgroundColor: "black", duration: 1 }),
        onLeaveBack: () =>
          gsap.to("body", { backgroundColor: "originalColor", duration: 1 }),
      },
    });

    gsap.fromTo(
      ".headline",
      { scale: 1, autoAlpha: 1 },
      {
        scale: 20,
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
    gsap.to(".left-img", {
      yPercent: -30,
      ease: "none",
      scrollTrigger: {
        trigger: ".art-wrapper",
        scrub: 1,
      },
    });

    gsap.to(".right-img", {
      yPercent: -10,
      ease: "none",
      scrollTrigger: {
        trigger: ".art-wrapper",
        scrub: 1,
      },
    });

    gsap.to(".titel", {
      yPercent: -0,
      ease: "none",
      scrollTrigger: {
        trigger: ".art-wrapper",
        scrub: 1,
        end: "100px",
      },
    });

    return () => {
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      }
    };
  }, []);
  const [index, setIndex] = useState(1);
  const [switchDoctor, setSwitchDoctor] = useState(false);

  const toggleSwitchDoctor = () => {
    setSwitchDoctor(!switchDoctor);
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = document.querySelector(".horizontalScroller");
    const containerWidth =
      container.scrollWidth - document.documentElement.clientWidth;

    gsap.to(container, {
      x: () => -containerWidth,
      scrollTrigger: {
        markers: false,
        trigger: ".horizontalWrapper",
        start: "top top",
        scrub: 0.5,
        pin: ".horizontalContainer",
        end: () => `+=${containerWidth}`,
        invalidateOnRefresh: true,
      },
    });
  }, []);

  return (
    <>
      <section
        className="headerFirst"
        style={{
          height: "100vh",
          maxWidth: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        <div className="header-reveal  text-8xl"></div>
        <h1
          className="font-novela-regular headline text-white"
          style={{
            textAlign: "center",
            fontSize: "4rem",
            textTransform: "uppercase",
            zIndex: 10,
          }}
        >
          MEET OUR TEAM
        </h1>
      </section>

      <section
        className="text-wrapper"
        style={{
          height: "100vh",
          maxWidth: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        <div className="imageContainer">
          <div
            className="collumn"
            style={{ position: "relative", display: "inline-block" }}
          >
            <img
              src="../../images/bannerright.svg"
              alt=""
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "80%",
                height: "80%",
                objectFit: "contain",
              }}
            />

            <div
              id="controls"
              style={{
                position: "absolute",
                top: "10%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
            >
              <button
                className="border-white z-0 p-3 transition-all duration-200 ease-linear border rounded-full hover:text-white text-primary-50 border-primary-50 hover:bg-primary-50"
                onClick={toggleSwitchDoctor}
              >
                <ArrowLeftIcon className="w-5 h-5" style={{ color: "white" }} />
              </button>
              <span className="text-white">
                0{!switchDoctor ? index : index + 1} - 02
              </span>
              <button
                className="border-white z-0 p-3 transition-all duration-200 ease-linear border rounded-full hover:text-white text-primary-50 border-primary-50 hover:bg-primary-50"
                onClick={toggleSwitchDoctor}
              >
                <ArrowRightIcon
                  className="w-5 h-5"
                  style={{ color: "white" }}
                />
              </button>
            </div>

            <div
              style={{
                position: "absolute",
                bottom: "10%",
                left: "10%",
                zIndex: 10,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "10px",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                padding: "20px",
                maxWidth: "80%",
              }}
            >
              <div className="text-white row-span-1 row-start-2">
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
                    research in three-dimensional craniofacial analysis and
                    earned his Master of Science degree. Dr. Frey is a member of
                    the American Association of Orthodontists and the American
                    Dental Association. In his leisure time, he enjoys staying
                    active outdoors, camping, playing music, and spending time
                    with loved ones.
                  </p>
                ) : (
                  <p>
                    Dr. Gregg Frey is an orthodontist based in Pennsylvania, who
                    graduated from Temple University School of Dentistry with
                    honors and served in the U.S. Navy Dental Corps before
                    establishing his practice in the Lehigh Valley. He is a
                    Diplomat of the American Board of Orthodontics and has
                    received numerous distinctions, accreditations, and honors,
                    including being named one of America&apos;s Top
                    Orthodontists by the Consumer Review Council of America.
                    This distinction is held by fewer than 25% of orthodontists
                    nationwide. ABO certification represents the culmination of
                    5-10 years of written and oral examinations and independent
                    expert review of actual treated patients. Recently Dr. Frey
                    voluntarily re-certified. Dr. Frey enjoys coaching soccer,
                    vintage car racing, and playing the drums.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="collumn">
            <figure className="w-full aspect-[3/4] h-max overflow-hidden flex items-start">
              <img
                className={`${
                  switchDoctor ? "right" : "switch-right"
                } mid-image object-contain w-full transition-all duration-2000`}
                src="../../images/team_members/GreggFrey.jpg"
                alt="Dr. Gregg Frey"
              />
              <img
                className={`${
                  switchDoctor ? "left" : "switch-left"
                } mid-image object-contain w-full transition-all duration-2000`}
                src="../../images/team_members/DanFrey.jpg"
                alt="Dr. Daniel Frey"
              />
            </figure>
          </div>
          <div className="collumn">
            <figure
              className="grayscale h-max w-full aspect-[3/4] overflow-hidden flex items-start hover:cursor-pointer"
              onClick={toggleSwitchDoctor}
            >
              <img
                className={`${
                  switchDoctor ? "right" : "switch-right"
                } right-image object-contain w-full transition-all duration-2000`}
                src="../../images/team_members/DanFrey.jpg"
                alt="Dr. Daniel Frey"
              />
              <img
                className={`${
                  switchDoctor ? "left" : "switch-left"
                } right-image object-contain w-full transition-all duration-2000`}
                src="../../images/team_members/GreggFrey.jpg"
                alt="Dr. Gregg Frey"
              />
            </figure>
          </div>
        </div>
        <div className="titel">Our Doctors</div>
      </section>
      <>
        <div className="horizontalContainer">
          <div className="horizontalWrapper">
            <div className="horizontalScroller">
              <div className="horizontalRow">
                <div className="horizontalItem horizontalFilled">
                  <p className="sm:text-left md:text-center">
                    Our members have received the designation of Specialized
                    Orthodontic Assistant . This is a voluntary certification
                    program started by the American Association of Orthodontists
                    to recognize those in the profession for their knowledge and
                    experience.
                  </p>

                  <a
                    href="https://www.trapezio.com/training-resources/course-outlines/soa-prep-course-outline/"
                    className="horizontalItemLink"
                  >
                    <span className="link-text" data-text="Check our content">
                      Learn More
                    </span>
                  </a>
                </div>
                <div className="horizontalItem horizontalFilled">
                  <p>
            ...and first aid 
                  </p>
                </div>
                <div className="horizontalItem horizontalBig">
                  <p>This office is on 🔥! The orthodontists as well as every single staff member. Keary Riddick</p>
                  <a
  href="https://g.co/kgs/Sds93Ha"
  className="horizontalItemLink"
>
  <span className="link-text" data-text="Check it out">
    Check it out
  </span>
</a>
                </div>
              </div>
              <div className="horizontalRow">
                <div className="horizontalItem horizontalBig">
                  <p>Trained in CPR</p>
                </div>
                <div className="horizontalItem horizontalFilled">
                  <p>
                 5 stars Had a wonderful experience at FreySmiles.
Everyone is extremely professional, polite, timely. Would highly recommend! -TK
                  </p>
                  <a
  href="https://g.co/kgs/YkknjNg"
  className="horizontalItemLink"
>
  <span className="link-text" data-text="Check it out">
    Check it out
  </span>
</a>

                </div>
                <div className="horizontalItem horizontalFilled">
                  <p>
                    Fun fact 2:Our team is made up of former FreySmiles patients, something we think is important, because we have all experienced treatment and can help guide you through it. 
                  </p>
                </div>
                <div className="horizontalItem horizontalFilled">
                  <p>New Content 1</p>
                  <a className="horizontalItemLink">
                    <span className="link-text" data-text="Learn More">
                      Learn More
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div>
      <div className="cards" ref={cardsRef}>

      <div
  ref={block1Ref}
  id="block-1"
  className="block absolute text-center text-xl text-white rounded-full"
  style={{
    width: "250px", 

    height: "250px", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    background: "radial-gradient(at 100% 100%, rgba(129,104,206,1) 20%, rgba(156,171,207,1) 100%)",
    boxShadow: "4px 4px 20px 4px rgba(156, 171, 207, 0.5)"
  }}
>
  Our members are X-ray certified
</div>

 
  <div
    ref={block2Ref}
    id="block-2"
    className="block absolute text-center text-xl rounded-full text-white"
    style={{    display: "flex",  width: "300px", height: "300px",     alignItems: "center", 
    justifyContent: "center",  background: "radial-gradient(at 100% 100%, rgb(177,161,225) 20%, rgba(156,171,207,1) 100%)",  }}
  >
Trained in CPR and first aid
  </div>


  <div
  ref={block3Ref}
  id="block-3"
  className="block absolute text-center text-white text-xl rounded-full"
  style={{
    display: "flex", 
    width: "400px", 
    height: "400px", 
    alignItems: "center", 
    justifyContent: "center", 
    background: "radial-gradient(at 100% 100%, rgb(188,161,225, 1) 20%, rgba(156,171,207,1) 100%)"
  }}
>
  <span>
    Recognized by the AAO as a 
    <Link
      href="https://www.trapezio.com/training-resources/course-outlines/soa-prep-course-outline/"
      className=" transition duration-200 text-secondary-40 hover:text-secondary-50"
    >
      Specialized Orthodontic Assistant
    </Link>

  </span>
</div>

</div>

      </div>  */}

        <section className="mt-20">
          <h2 className="mb-6 text-center capitalize md:mb-8 text-primary-30">
            Our Members
          </h2>
          <p className="sm:text-left md:text-center">
            Our members are X-ray certified, trained in CPR and first aid and
            most of them have received the designation of Specialized
            Orthodontic Assistant{" "}
            <Link
              href="https://www.trapezio.com/training-resources/course-outlines/soa-prep-course-outline/"
              className="underline transition duration-200 underline-offset-4 text-secondary-40 hover:text-secondary-50"
            >
              (SOA)
            </Link>
            . This is a voluntary certification program started by the American
            Association of Orthodontists to recognize those in the profession
            for their knowledge and experience.
          </p>

          <div
            className={`users-color-container ${isVisible ? "animate" : ""}`}
          >
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
    </>
  );
};

export default YourTeam;

// 'use client'
// import Link from "next/link"
// import { Swiper, SwiperSlide } from 'swiper/react'
// import 'swiper/css'
// import 'swiper/css/pagination'
// import { Mousewheel, Pagination } from 'swiper/modules'
// import clsx from "clsx"
// import Shape02 from "../_components/shapes/shape02"
// import Shape05 from "../_components/shapes/shape05"
// import { TextReveal } from "../_components/TextReveal"

// export default function WhyChooseUs() {
//   return (
//     <>
//       <HeadingAnimation />
//       <TextContentOne />
//       <TextContentTwo />
//       <AnimateTextScroll />
//       <CTA />
//     </>
//   )
// }

// function HeadingAnimation() {
//   return (
//     <section className="flex flex-col gap-4 mx-auto my-16 text-center md:h-12 md:text-left md:flex-row w-max">
//       <p className="text-2xl md:text-4xl text-[#5f6368] py-1">Experts in</p>
//       <div className="h-12 overflow-hidden">
//         <ul
//           style={{
//             animation: "scroll-text-up 5s infinite",
//           }}
//         >
//           <li className="text-[#ea4335] py-1">
//             <p className="text-2xl md:text-4xl">Invisalign</p>
//           </li>
//           <li className="text-[#4285f4] py-1">
//             <p className="text-2xl md:text-4xl">Damon Braces</p>
//           </li>
//           <li className="text-[#34a853] py-1">
//             <p className="text-2xl md:text-4xl">
//               Accelerated Orthodontic Treatment
//             </p>
//           </li>
//           <li className="text-[#fbbc04] py-1">
//             <p className="text-2xl md:text-4xl">
//               low-dose 3D Digital Radiographs
//             </p>
//           </li>
//           <li className="text-[#ea4335] py-1">
//             <p className="text-2xl md:text-4xl">Invisalign</p>
//           </li>
//         </ul>
//       </div>
//     </section>
//   )
// }

// function TextContentOne() {
//   return (
//     <section className="flex flex-col items-center justify-between w-full gap-8 px-8 mx-auto mb-32 md:flex-row md:items-center max-w-7xl">
//       <div className="overflow-hidden rounded-full">
//         <img
//           src="/../../images/freysmilepatient.jpg"
//           alt="frey smiles patient"
//           className="w-full aspect-square"
//         />
//       </div>
//       <Swiper
//         style={{
//           width: "100%",
//           height: "80vh",
//           position: "relative",
//           "--swiper-pagination-color": "#ad79e3", // primary-60
//         }}
//         // loop={true}
//         pagination={true}
//         mousewheel={true}
//         direction={"vertical"}
//         modules={[Pagination, Mousewheel]}
//         className="mySwiper"
//       >
//         <SwiperSlide
//           style={{
//             width: "100%",
//             height: "100%",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//           }}
//         >
//           <div className="px-8 space-y-4">
//             <h3>Uncompromising quality</h3>
//             <h4>
//               We strive to attain finished results consistent with the{" "}
//               <span>American Board of Orthodontics (ABO)</span> qualitative
//               standards. Our doctors place great priority on the certification
//               and recertification process, ensuring that all diagnostic
//               records adhere to ABO standards.
//             </h4>
//           </div>
//         </SwiperSlide>
//         <SwiperSlide
//           style={{
//             width: "100%",
//             height: "100%",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//           }}
//         >
//           <div className="px-8">
//             <h4>
//               Currently, Dr. Gregg Frey is a certified orthodontist, and is
//               preparing cases for recertification. Dr. Daniel Frey is in the
//               final stages of obtaining his initial certification.
//             </h4>
//           </div>
//         </SwiperSlide>
//         <SwiperSlide
//           style={{
//             width: "100%",
//             height: "100%",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             gap: "1rem",
//           }}
//         >
//           <div className="px-8">
//             <h4>
//               To complement our use of cutting-edge diagnostic technology, we
//               uphold the highest standards for our records, ensuring accuracy
//               and precision throughout the treatment process.
//             </h4>
//           </div>
//         </SwiperSlide>
//       </Swiper>
//     </section>
//   )
// }

// function TextContentTwo() {
//   return (
//     <section className="flex flex-col-reverse items-center justify-between gap-16 px-8 mx-auto my-16 max-w-7xl md:gap-8 md:flex-row">
//       <div className="px-4 md:w-1/2">
//         <p className="text-2xl">
//           Our office holds the distinction of being the{" "}
//           <span className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
//             longest-standing, active board-certified orthodontic office in the
//             area
//           </span>
//           . With four offices in the Lehigh Valley, we have been providing
//           unparalleled orthodontic care for over four decades.
//         </p>
//       </div>
//       <div className="relative h-full md:w-1/2">
//         <Shape02 className="absolute inset-0 m-auto text-white border border-white" />
//         <img
//           className="object-fill object-center"
//           src="/../../images/drfreyperfecting.jpg"
//           alt="Dr. Gregg Frey attending a FreySmiles patient"
//         />
//       </div>
//     </section>
//   )
// }

// function AnimateTextScroll() {
//   const text = "Frey Smiles believes in providing accessible orthodontic care for everyone. In 2011, they established a non-profit organization called More Than Smiles, which offers orthodontic treatment to deserving individuals who may not have access to world-class orthodontic care or cannot afford it."

//   return (
//     <section className="w-full px-10 mx-auto max-w-7xl">
//       <div className="flex flex-col-reverse md:flex-row md:justify-between">
//         <div className="w-full min-h-screen px-8 py-12 md:w-1/2 md:px-0">
//           <TextReveal body={text} className="relative mx-auto h-[200vh] w-full max-w-lg">
//             {(tokens) => (
//               <div className="sticky top-0 left-0 flex items-center text-2xl font-medium leading-tight text-primary-50 h-1/2">
//                 <div>
//                   {tokens.map((token, index) => (
//                     <TextReveal.Token key={index} index={index}>
//                       {(isActive) => (
//                         <span
//                           className={clsx(
//                             {
//                               "opacity-20": !isActive,
//                             },
//                             "transition",
//                           )}>
//                           {token}
//                         </span>
//                       )}
//                     </TextReveal.Token>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </TextReveal>
//         </div>
//         <div className="flex flex-col items-center justify-center w-full md:w-1/2">
//           <img
//             className="mt-16 rounded-lg"
//             src="/../../images/smilescholarship.jpg"
//             alt="Frey Smiles patient receiving FreySmile scholarship"
//           />
//         </div>
//       </div>
//     </section>
//   )
// }

// function CTA() {
//   return (
//     <section className="flex flex-col mx-auto md:flex-row md:justify-between md:gap-8 lg:gap-16 max-w-7xl sm:mb-32">
//       <div className="flex flex-col justify-center space-y-8 md:w-1/2">
//         <h4>If you know someone who could benefit from this gift, please visit the website for details on how to nominate a candidate.</h4>
//         <Link href="https://morethansmiles.org/" className="block px-6 py-2 font-medium bg-indigo-500 text-white w-fit transition-all shadow-[6px_6px_0px_rgb(39,_39,_42)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]">Learn More</Link>
//       </div>
//       <Shape05 className="md:w-1/2" />
//     </section>
//   )
// }

{
  /* <div className="relative self-center w-full md:w-1/2">
          <img
            className="w-full"
            src="/../../images/smilescholarship.jpg"
            alt="Frey Smiles patient receiving FreySmile scholarship"
          />
          <div className="absolute bottom-0 right-0 w-1/2 -translate-y-1/2 -translate-x-1/3">
            <div className="flex flex-col overflow-hidden shadow-[5px_5px_rgba(0,_98,_90,_0.4),_10px_10px_rgba(0,_98,_90,_0.3),_15px_15px_rgba(0,_98,_90,_0.2),_20px_20px_rgba(0,_98,_90,_0.1),_25px_25px_rgba(0,_98,_90,_0.05)] text-center bg-white p-8">
              <h3 className="font-helvetica-now-thin">Giving Back</h3>
            </div>
          </div>
        </div> */
}
