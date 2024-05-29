"use client";
import { Curtains, useCurtains, Plane } from "react-curtains";
import { Vec2 } from "curtainsjs";
// import SimplePlane from "./curtains"
import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap-trial/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { SplitText } from "gsap-trial/all";
// framer motion
import { motion } from "framer-motion";
import clsx from "clsx";
import GalaxyShape from "../_components/shapes/galaxy";
import Shape02 from "../_components/shapes/shape02";
import Shape03 from "../_components/shapes/shape03";
import Shape04 from "../_components/shapes/shape04";
import Shape05 from "../_components/shapes/shape05";
import Shape06 from "../_components/shapes/shape06";
import Shape07 from "../_components/shapes/shape07";
import { TextReveal } from "../_components/TextReveal";
import { Circle } from "pixi.js";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

export default function WhyChooseUs() {
  return (
    <>
      <Hero />

      {/* <TextSection /> */}

      <StackCards />

      <ScrollTextReveal />
      <CTA />
      <DragTable />
      <BentoGrid />
      <div className="min-h-screen">
        {/* <Curtains pixelRatio={Math.min(1.5, window.devicePixelRatio)}>
        <SimplePlane />
      </Curtains> */}
      </div>
    </>
  );
}

const TextSection = () => {
  const circleRef = useRef(null);

  useEffect(() => {
    gsap.to(circleRef.current, {
      width: "600vmax",
      height: "600vmax",
      ease: "Power1.easeInOut",
      scrollTrigger: {
        trigger: "#text",
        start: "top 100%",
        end: "bottom top",
        scrub: 0.5,
      },
    });
  }, []);

  return (
    <section id="text">
      <div ref={circleRef} className="circle"></div>
    </section>
  );
};

function Hero() {
  const title = "EXPERTS IN";
  const imageUrl = "../images/crystal.png";
  const svgRef = useRef(null);
  let lastScrollTop = 0;
  const rotationFactor = 5;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (svgRef.current) {
        if (scrollTop > lastScrollTop) {
          svgRef.current.style.transform = `rotate(${
            scrollTop / rotationFactor
          }deg)`;
        } else {
          svgRef.current.style.transform = `rotate(${
            scrollTop / rotationFactor
          }deg)`;
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // mobile
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-212121   h-screen">
      <div className="bg-[#DFFF00] min-h-screen min-w-full flex justify-center items-center">
        <div className="relative my-[10vh] mx-auto p-0 rounded-[5rem] overflow-hidden w-[90vw] h-[80vh] bg-[#E8E8E4]">
          <h2 className="absolute top-20 left-[5vw] m-0 text-[10vw] uppercase text-center">
            {title}
          </h2>
          <img
            src={imageUrl}
            alt={title}
            className="block w-full h-full object-cover"
          />
        </div>
      </div>

      <section class="">
        <video
          autoPlay
          loop
          muted
          preload="true"
          className="absolute inset-0 object-cover object-center w-full h-full -z-10"
        >
          {/* undulating waves */}
          {/* <source src="/../../videos/production_id_4779866.mp4" type="video/mp4" /> */}
          {/* sharp waves */}
          {/* <source src="/../../videos/pexels-rostislav-uzunov-9150545.mp4" type="video/mp4" /> */}
          {/* shutterstock */}
          <source
            src="/../../videos/shutterstock_1111670177.mp4"
            type="video/mp4"
          />
        </video>

        <section className="absolute top-60 mx-auto my-16 text-center md:h-16 md:flex-row w-full">
          <div className="h-full overflow-hidden">
            <ul
              style={{
                animation: "scroll-text-up 5s infinite",
              }}
            >
              <li className=" py-1">
                <h1 className="font-neue-montreal text-7xl">Invisalign</h1>
              </li>
              <li className=" py-1">
                <h1 className="font-neue-montreal text-7xl">Damon Braces</h1>
              </li>
              <li className=" py-1">
                <h1 className="font-neue-montreal text-7xl">
                  Accelerated Orthodontic Treatment
                </h1>
              </li>
              <li className=" py-1">
                <h1 className="font-neue-montreal text-7xl">
                  low-dose 3D Digital Radiographs
                </h1>
              </li>
              <li className="py-1">
                <h1 className="font-neue-montreal text-7xl">Invisalign</h1>
              </li>
            </ul>
          </div>
     
          <div className="relative" style={{ left: '20rem' }}>
        <svg
          ref={svgRef}
          id="spinscroll"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="300px"
          height="300px"
          viewBox="0 0 300 300"
          xmlSpace="preserve"
          className="book-svg transition-transform duration-100 inline-flex"
        >
          <defs>
            <path id="circlePath" d="M75,150A75,75 0 1 1225,150A75,75 0 1 175,150" />
          </defs>
          <g id="rotatingGroup">
            <text className="scroll-text">
              <textPath xlinkHref="#circlePath">Scroll Down Scroll Down</textPath>
            </text>
          </g>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 63 305"
          width="10.75"
          height="56.25"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <path className="arrow-line" style={{ fill: 'none', stroke: '#000', strokeWidth: '1.5', strokeDashoffset: 0, strokeDasharray: '304' }} d="M31 0,31 304" />
          <path className="arrow-left" style={{ fill: 'none', stroke: '#000', strokeWidth: '1.5', strokeDashoffset: 0, strokeDasharray: '51' }} d="M1,269c0,0,29-1,30,35" />
          <path className="arrow-right" style={{ fill: 'none', stroke: '#000', strokeWidth: '1.5', strokeDashoffset: 0, strokeDasharray: '51' }} d="M61,269c0,0-29-1-30,35" />
        </svg>
      </div>

        </section>
      </section>

      <div className="w-full mt-20 h-[100vh] flex flex-col justify-center items-center relative">
        <div className="absolute inset-0 m-4 bg-gray-300 border border-gray-100 rounded-xl -z-10 backdrop-filter bg-clip-padding backdrop-blur-sm bg-opacity-30" />
      </div>
    </div>
  );
}

function StackCards() {
  const textContainerRef = useRef(null);
  const textRef1 = useRef(null);
  const textRef2 = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(SplitText);

    const onEntry = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          [textRef1, textRef2].forEach((ref) => {
            const split = new SplitText(ref.current, { type: "lines" });
            split.lines.forEach((line) => {
              gsap.fromTo(
                line,
                {
                  y: 80,
                  opacity: 0,
                  clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
                },
                {
                  y: 0,
                  opacity: 1,
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                  duration: 1.5,
                  ease: "power4.out",
                }
              );
            });
          });

          observer.disconnect();
        }
      });
    };

    const observer = new IntersectionObserver(onEntry, {
      threshold: 1,
    });

    if (textContainerRef.current) {
      observer.observe(textContainerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const marqueeRef = useRef(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;
    const speed = 0.06;
    let lastFrameTime = 0;

    const animate = (time) => {
      if (!lastFrameTime) lastFrameTime = time;
      const delta = time - lastFrameTime;
      lastFrameTime = time;

      marquee.scrollLeft += speed * delta;
      if (marquee.scrollLeft >= marquee.firstChild.offsetWidth) {
        marquee.scrollLeft -= marquee.firstChild.offsetWidth;
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, []);
  const svgIcon = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_104_26)">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M107.143 0H92.8571V82.7556L34.3401 24.2385L24.2386 34.3401L82.7556 92.8571H0V107.143H82.7555L24.2386 165.66L34.3401 175.761L92.8571 117.244V200H107.143V117.244L165.66 175.761L175.761 165.66L117.244 107.143H200V92.8571H117.244L175.761 34.34L165.66 24.2385L107.143 82.7555V0Z"
          fill="#E8E2D6"
        />
      </g>
      <clipPath id="clip0_104_26">
        <rect width="200" height="200" fill="white" />
      </clipPath>
    </svg>
  );

  const items = [
    "unparalleled",
    "CARE",
    "AND",
    "EXCELLENCE",
    "unparalleled",
    "Care",
    svgIcon,
  ];
  const duplicatedItems = [...items, ...items];
  return (
    <section className="rounded-2xl bg-[#F1F1F1] py-32 ">
      <section class="project-section">
        <div
          ref={marqueeRef}
          className="overflow-hidden w-full whitespace-nowrap flex"
        >
          <div className="text-[#E8E2D6] flex">
            {duplicatedItems.map((item, index) => (
              <div key={index} className="marquee-item mx-4">
                <h3 className="text-3xl font-semibold uppercase">{item}</h3>
              </div>
            ))}
          </div>
          <div className="text-[#E8E2D6] flex">
            {duplicatedItems.map((item, index) => (
              <div
                key={index + duplicatedItems.length}
                className="marquee-item mx-4"
              >
                <h3 className="text-3xl font-semibold uppercase">{item}</h3>
              </div>
            ))}
          </div>
        </div>
        {/* <div className="appointmentMarquee flex items-center"> 
          <svg width="50" height="50" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_104_26)">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M107.143 0H92.8571V82.7556L34.3401 24.2385L24.2386 34.3401L82.7556 92.8571H0V107.143H82.7555L24.2386 165.66L34.3401 175.761L92.8571 117.244V200H107.143V117.244L165.66 175.761L175.761 165.66L117.244 107.143H200V92.8571H117.244L175.761 34.34L165.66 24.2385L107.143 82.7555V0Z" fill="#E8E2D6"/>
    </g>
    <clipPath id="clip0_104_26">
      <rect width="200" height="200" fill="white"/>
    </clipPath>
  </svg>
  <div class="project-heading col-lg-6">
    <h1>UNPARALLELED CARE AND EXPERTISE</h1>
  </div>
  <svg width="50" height="50" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_104_26)">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M107.143 0H92.8571V82.7556L34.3401 24.2385L24.2386 34.3401L82.7556 92.8571H0V107.143H82.7555L24.2386 165.66L34.3401 175.761L92.8571 117.244V200H107.143V117.244L165.66 175.761L175.761 165.66L117.244 107.143H200V92.8571H117.244L175.761 34.34L165.66 24.2385L107.143 82.7555V0Z" fill="#E8E2D6"/>
    </g>
    <clipPath id="clip0_104_26">
      <rect width="200" height="200" fill="white"/>
    </clipPath>
  </svg>
</div> */}
      </section>
      {/* <div className="text-container" ref={textContainerRef}>
      <div className="line-container" ref={textRef1}>
        <h1 className="hidden-text font-neue-montreal font-bold text-7xl uppercase">
          Uncompromising
        </h1>
      </div>
      <div className="line-container" ref={textRef2}>
        <h1 className="hidden-text font-neue-montreal font-bold text-7xl uppercase">
          QUALITY
        </h1>
      </div>
    </div> */}
      <div className="relative container mx-auto">
        <div className="flex flex-col items-center gap-6 mx-auto -translate-y-10 lg:mx-0 lg:-translate-x-10 lg:flex-row w-max">
          {/* <img
            src="/../../images/freysmilepatient.jpg"
            alt="frey smiles patient"
            className="rounded-full left-1/4 w-96 h-96 "
          /> */}
        </div>
        <div className="mt-10 max-w-screen-lg mx-auto space-y-16">
          <div className="font-neue-montreal relative px-8 lg:px-16 py-8 mx-auto max-w-[60dvw] translate-x-[4dvw] border-2 border-[#c5cfc7] -rotate-2 hover:rotate-0 transition-all duration-150 ease-linear hover:scale-105 ">
            <h4>
              We strive to attain finished results consistent with the{" "}
              <span>American Board of Orthodontics (ABO)</span> qualitative
              standards. Our doctors place great priority on the certification
              and recertification process, ensuring that all diagnostic records
              adhere to ABO standards.
            </h4>
            <div className=" absolute bottom-0 right-0 translate-x-1/2 translate-y-1/4 w-36 h-36 -z-10"></div>
          </div>
          <div className="font-neue-montreal px-8 lg:px-16 py-8 mx-auto max-w-[60dvw] -translate-x-[2dvw] border-2 border-[#c5cfc7] transition-all duration-150 ease-linear hover:scale-105  rotate-2">
            <h4>
              Currently, Dr. Gregg Frey is a certified orthodontist, and is
              preparing cases for recertification. Dr. Daniel Frey is in the
              final stages of obtaining his initial certification.
            </h4>
            <div className="absolute bottom-0 left-0 w-48 h-48 -translate-x-1/4 -z-10">
              <Shape06 />
            </div>
          </div>
          <div className="font-neue-montreal px-8 lg:px-16 py-8 mx-auto max-w-[60dvw] translate-x-[2dvw] border-2 border-[#c5cfc7] rotate-2 lg:-rotate-2 relative hover:rotate-0 hover:scale-105 transition-all duration-150 ease-linear ">
            <h4>
              To complement our use of cutting-edge diagnostic technology, we
              uphold the highest standards for our records, ensuring accuracy
              and precision throughout the treatment process.
            </h4>
            <div className="absolute bottom-0 right-0 translate-x-1/2 w-44 h-44 translate-y-1/4 -z-10">
              <Shape05 />
            </div>
          </div>
          <div className="font-neue-montreal relative px-8 lg:px-16 py-8 mx-auto max-w-[60dvw] -translate-x-[2dvw] border-2 border-[#c5cfc7] rotate-2 hover:rotate-0 transition-all duration-150 ease-linear hover:scale-105">
            <h4>
              Our office holds the distinction of being the longest-standing,
              active board-certified orthodontic office in the area . With four
              offices in the Lehigh Valley, we have been providing unparalleled
              orthodontic care for over four decades.
            </h4>
            <div className="absolute bottom-0 left-0 w-40 h-40 -translate-x-1/2 -translate-y-6 -z-10"></div>
          </div>
        </div>
        {/* <div className="flex translate-x-10 translate-y-10 place-content-end">
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
        </div> */}
      </div>
    </section>
  );
}
function CTA() {
  const textRef = useRef(null);
  const bgTextColor = "#CECED3";
  const fgTextColor = "#161818";

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const split = new SplitText(textRef.current, { type: "chars" });
    const chars = split.chars;

    const animation = gsap.fromTo(
      chars,
      { color: bgTextColor },
      { color: fgTextColor, stagger: 0.03 }
    );

    ScrollTrigger.create({
      trigger: textRef.current,
      start: "top 80%",
      end: "bottom 70%",
      animation: animation,
      scrub: true,
      markers: false,
    });

    return () => split.revert();
  }, []);
  const btnRef = useRef();
  const hitRef = useRef();

  useEffect(() => {
    const btn = btnRef.current;
    const hit = hitRef.current;

    hit.onpointermove = (e) => {
      const domPt = new DOMPoint(e.x, e.y);
      let svgPt = domPt.matrixTransform(btn.getScreenCTM().inverse());

      gsap
        .timeline({ defaults: { duration: 0.3, ease: "power3" } })
        .to(".hit", { x: svgPt.x / 7, y: svgPt.y / 7 }, 0)
        .to(".bg", { x: svgPt.x / 2.5, y: svgPt.y / 2.5 }, 0)
        .to(".txt", { x: svgPt.x / 2, y: svgPt.y / 2 }, 0)
        .to(".bg", { attr: { fill: "rgb(197, 207, 199)" } }, 0)
        .to(".txt", { attr: { fill: "rgb(0,0,0)" } }, 0);
    };

    hit.onpointerleave = (e) => {
      gsap
        .timeline({ defaults: { duration: 0.3, ease: "power2" } })
        .to(".bg", { attr: { fill: "rgb(50,50,50)" } }, 0)
        .to(".txt", { attr: { fill: "rgb(255,255,255)" } }, 0)
        .to(
          ".hit, .bg, .txt",
          { duration: 0.7, ease: "elastic.out(0.8)", x: 0, y: 0 },
          0
        );
    };
  }, []);
  return (
    <section className="sm:py-32 ">
      <div className=" flex">
        <div className="px-40">
          <p ref={textRef} className="font-helvetica-neue text-3xl uppercase">
            Frey Smiles believes in providing accessible orthodontic care for
            everyone. In 2011, they established a non-profit organization called
            More Than Smiles, which offers orthodontic treatment to deserving
            individuals who may not have access to world-class orthodontic care
            or cannot afford it.
          </p>
        </div>
      </div>
      <div className="container flex flex-col gap-8 mx-auto md:flex-row md:justify-between lg:gap-16">
        <div className="flex flex-col justify-center space-y-8 md:w-1/2">
          <h4 className="text-[#161818] text-md font-helvetica-neue uppercase">
            If you know someone who could benefit from this gift, please visit
            the website for details on how to nominate a candidate.
          </h4>

          <a
            href="https://morethansmiles.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              ref={btnRef}
              className="w-4/5 h-4/5 max-w-xs cursor-pointer"
              viewBox="-50 -50 100 100"
            >
              <circle className="bg" r="22.4" fill="rgb(50,50,50)" />
              <text
                className="txt fill-white text-[5.5px] tracking-[0.2px] text-center"
                x="0"
                y="2"
                textAnchor="middle"
              >
                LEARN MORE
              </text>
              <circle
                ref={hitRef}
                className="hit"
                r="42"
                fill="rgba(0,0,0,0)"
              />
            </svg>
          </a>
        </div>
        <Shape03 className="md:w-1/2" />
      </div>
    </section>
  );
}

function ScrollTextReveal() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let tlMain = gsap
      .timeline({
        scrollTrigger: {
          trigger: ".section-height",
          start: "top top",
          end: "98% bottom",
          scrub: 1,
        },
      })
      .to(".track", {
        xPercent: -100,
        ease: "none",
      });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".giving-panel_wrap",
          containerAnimation: tlMain,
          start: "left left",
          end: "right right",
          scrub: true,
        },
      })
      .to(".giving-panel", { xPercent: 100, ease: "none" })
      .to(".giving-panel_photo", { scale: 1 }, 0)
      .fromTo(
        ".giving-panel_contain.is-2",
        { clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)" },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "none",
        },
        0
      );
  }, []);

  const text =
    "Frey Smiles believes in providing accessible orthodontic care for everyone. In 2011, they established a non-profit organization called More Than Smiles, which offers orthodontic treatment to deserving individuals who may not have access to world-class orthodontic care or cannot afford it.";
  return (
    <section className="w-full min-h-screen ">
      <div className="section-height">
        <div className="sticky-element">
          <div className="track">
            <div className="track-flex">
              <div className="giving-panel_wrap">
                <div className="giving-panel">
                  <div className="giving-panel_contain">
                    <p className="giving-panel_text">GIVING</p>
                    <div className="giving-panel_img is-1">
                      <div className="giving-panel_img-height">
                        <img
                          src="../images/morethansmiles2.png"
                          loading="eager"
                          alt=""
                          className="giving-panel_photo"
                        />
                      </div>
                    </div>
                    <div className="giving-panel_img is-2">
                      <div className="giving-panel_img-height">
                        <img
                          src="../images/morethansmiles3.png"
                          loading="eager"
                          alt=""
                          className="giving-panel_photo"
                        />
                      </div>
                    </div>
                    <div className="giving-panel_img is-3">
                      <div className="giving-panel_img-height">
                        <img
                          src="../images/hand.jpeg"
                          loading="eager"
                          alt=""
                          className="giving-panel_photo"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="giving-panel_contain is-2">
                    <p className="giving-panel_text">GIVING</p>
                    <div className="giving-panel_img is-1">
                      <div className="giving-panel_img-height">
                        <img
                          src="../images/morethansmiles5.png"
                          loading="eager"
                          alt=""
                          className="giving-panel_photo"
                        />
                      </div>
                    </div>
                    <div className="giving-panel_img is-2">
                      <div className="giving-panel_img-height">
                        <img
                          src="../images/wavyborderpatient.png"
                          loading="eager"
                          alt=""
                          className="giving-panel_photo"
                        />
                      </div>
                    </div>
                    <div className="giving-panel_img is-3">
                      <div className="giving-panel_img-height">
                        <img
                          src="../images/morethansmiles4.png"
                          loading="eager"
                          alt=""
                          className="giving-panel_photo"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col items-center justify-center text-[180px] leading-none">
        <div className="flex self-start ml-60 items-center">
          <span className="underline-custom">MORE</span>
          <img
            className="w-32 h-auto ml-4"
            src="../images/morethansmiles2.png"
            alt="More Than Smiles"
            style={{ transform: "rotate(10deg)" }}
          />
        </div>
        <div className="flex items-center ml-20">
          <img
            className="w-32 h-auto mr-2"
            src="../images/morethansmiles.png"
            alt="More Than Smiles"
            style={{ transform: "rotate(-10deg)" }}
          />
          <span className="underline-custom">THAN</span>
        </div>
        <div className="flex self-start ml-60 items-center">
          <span className="underline-custom">SMILES</span>
          <img
            className="w-32 h-auto ml-4"
            src="../images/morethansmiles3.png"
            alt="More Than Smiles"
            style={{ transform: "rotate(10deg)" }}
          />
        </div>
      </div> */}

      {/* <div className="container flex flex-col-reverse mx-auto md:flex-row md:justify-between"> */}

      {/* <div className="flex flex-col items-center justify-center w-full md:w-1/2">
          <img
            className="mt-16 rounded-lg"
            src="/../../images/smilescholarship.jpg"
            alt="Frey Smiles patient receiving FreySmile scholarship"
          />
        </div> */}
      {/* </div> */}
    </section>
  );
}

function DragTable() {
  const freySmilesRef = useRef();
  const othersRef = useRef();

  return (
    <section className="hidden lg:block py-24">
      <div className="container grid-cols-12 grid-rows-6 mx-auto mb-32 lg:grid place-content-stretch font-neue-montreal">
        <div className="flex col-span-6 col-start-1 row-start-1 mb-12 text-center font-extralight place-content-center place-items-end font-larken text-zinc-800">
          <h1>FreySmiles Orthodontics</h1>
        </div>
        <div className="flex col-span-6 col-start-7 row-start-1 mb-12 text-center place-content-center place-items-end font-larken text-zinc-800 font-extralight">
          <h1>Others</h1>
        </div>
        <motion.div
          ref={freySmilesRef}
          className="relative col-span-6 col-start-1 row-span-5 row-start-2 translate-x-8 border-2 rounded-full aspect-square border-[#51733f]"
        >
          <motion.div
            className="absolute left-0 flex w-48 h-48 text-center rotate-45 rounded-full top-1/2 -translate-y-1/3 bg-[#9dbb81] place-content-center place-items-center text-zinc-800"
            drag
            dragConstraints={freySmilesRef}
          >
            <p className="text-2xl leading-6">
              <span className="text-4xl">4</span>
              <br /> convenient
              <br /> locations
            </p>
          </motion.div>
          <motion.div
            className="absolute flex text-center -rotate-45 translate-x-1/2 translate-y-1/2 border rounded-full left-1/3 w-36 h-36 top-1/2 border-zinc-800 bg-zinc-800 place-content-center place-items-center text-zinc-100"
            drag
            dragConstraints={freySmilesRef}
          >
            <p className="text-xl leading-5">
              Modern
              <br /> office
              <br /> settings
            </p>
          </motion.div>
          <motion.div
            className="absolute bottom-0 left-0 flex w-56 h-56 text-center translate-x-1/2 rounded-full text-zinc-800 -translate-y-1/4 bg-[#9dbb81] place-content-center place-items-center -rotate-12"
            drag
            dragConstraints={freySmilesRef}
          >
            <p className="text-2xl leading-6">
              Over
              <br />
              <span className="text-4xl">50+ years</span>
              <br /> of experience
            </p>
          </motion.div>
          <motion.div
            className="absolute bottom-0 flex text-center -translate-y-2 border rounded-full text-zinc-800 w-36 h-36 -translate-x-1/4 left-1/2 border-zinc-800 place-content-center -rotate-12 place-items-center"
            drag
            dragConstraints={freySmilesRef}
          >
            <p className="text-xl leading-5">
              Financial
              <br /> options
            </p>
          </motion.div>
          <motion.div
            className="absolute bottom-0 right-0 flex w-48 h-48 my-auto text-center rotate-45 -translate-x-1/2 -translate-y-1/2 rounded-full text-zinc-800 bg-[#9dbb81] place-content-center place-items-center"
            drag
            dragConstraints={freySmilesRef}
          >
            <p className="text-2xl leading-6">
              <span className="text-3xl leading-8">
                Leaders
                <br />
              </span>{" "}
              in the <br />
              industry
            </p>
          </motion.div>
        </motion.div>
        <motion.div
          ref={othersRef}
          className="relative z-0 col-span-6 col-start-7 row-span-5 row-start-2 -translate-x-8 border-2 border-dashed rounded-full aspect-square border-[#51733f]"
        >
          <motion.div
            className="absolute bottom-0 flex w-48 h-48 text-center -translate-x-1/2 rounded-full rotate-12 left-1/2 bg-zinc-800 place-content-center place-items-center text-zinc-100"
            drag
            dragConstraints={othersRef}
          >
            <p>Financial options</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function BentoGrid() {
  return (
    <section className="sm:my-32">
      <div className="grid grid-cols-8">
        <div className="relative col-span-5 place-content-center">
          <GalaxyShape className="absolute inset-0 object-cover object-center -translate-x-1/2 -translate-y-1/2 opacity-70 top-1/2 left-1/2 fill-primary-70" />
          <p className="text-center text-[#CBB99F] text-[clamp(1rem,_-0.6667rem_+_4.1667vw,_2rem)] leading-[clamp(1rem,_-0.6667rem_+_4.1667vw,_2rem)]">
            We have <br />{" "}
            <span className="inline-block uppercase">50+ years</span> <br /> of
            experience.
          </p>
        </div>
        <div className="col-span-3 overflow-hidden">
          <img
            className="object-cover object-center"
            src="/../../images/pexels-cedric-fauntleroy-4269276_1920x2880.jpg"
          />
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
          <p className="text-center text-[#CBB99F] text-[clamp(1rem,_-0.6667rem_+_4.1667vw,_2rem)] leading-[clamp(1rem,_-0.6667rem_+_4.1667vw,_2rem)] uppercase">
            25K+ <br /> Patients
          </p>
        </div>
        <div className="col-span-3 row-span-2 lg:col-span-2">
          <img
            className="object-cover object-center"
            src="/../../images/aurela-redenica-VuN-RYI4XU4-unsplash_2400x3600.jpg"
          />
        </div>
        <div className="col-span-3 row-span-2 lg:col-span-2 place-content-center">
          <p className="text-center text-[#CBB99F] text-[clamp(1rem,_-0.6667rem_+_4.1667vw,_2rem)] leading-[clamp(1rem,_-0.6667rem_+_4.1667vw,_2rem)] uppercase">
            ABO <br /> Certified
          </p>
        </div>
        <div className="relative col-span-3 row-span-2 lg:col-span-2">
          <img
            className="object-cover object-right-bottom w-full h-full"
            src="/../../images/goby-D0ApR8XZgLI-unsplash_2400x1467.jpg"
            alt="hand reaching towards another hand offering pink toothbrush"
          />
        </div>
        <div className="col-span-3 row-span-2 place-content-center lg:col-span-2">
          <p className="text-center text-[#CBB99F] text-[clamp(1rem,_-0.6667rem_+_4.1667vw,_2rem)] leading-[clamp(1rem,_-0.6667rem_+_4.1667vw,_2rem)] uppercase">
            10+ <br /> Members
          </p>
        </div>
        <div className="col-span-3 row-span-2 lg:col-span-2">
          <img
            className="object-cover object-center"
            src="/../../images/pexels-cedric-fauntleroy-4269491_1920x2880.jpg"
            alt="dental equipment"
          />
        </div>
        <div className="col-span-3 row-span-2 place-content-center lg:col-span-2">
          <p className="text-center text-[#CBB99F] text-[clamp(1rem,_-0.6667rem_+_4.1667vw,_2rem)] leading-[clamp(1rem,_-0.6667rem_+_4.1667vw,_2rem)] uppercase">
            4 <br /> Locations
          </p>
        </div>
        <div className="col-span-3 row-span-2 lg:col-span-2">
          <img
            className="object-cover object-center"
            src="/../../images/tony-litvyak-glPVwPr1FKo-unsplash_2400x3600.jpg"
            alt="smile"
          />
        </div>
        <div className="col-span-6 row-span-2 py-8 lg:col-span-2 place-content-center">
          <p className="text-center text-[#CBB99F] text-[clamp(1rem,_-0.6667rem_+_4.1667vw,_2rem)] leading-[clamp(1rem,_-0.6667rem_+_4.1667vw,_2rem)] uppercase">
            We Use <br /> Modern Technology
          </p>
        </div>
      </div>
    </section>
  );
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
