"use client";
// gsap
// import { Curtains, useCurtains, Plane } from "react-curtains";
// import { Vec2 } from "curtainsjs";
// import SimplePlane from "./curtains"
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Keyboard, Mousewheel } from "swiper/core";
import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollSmoother } from "gsap-trial/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap-trial/all";
// framer motion
import GalaxyShape from "../_components/shapes/galaxy";
import Shape03 from "../_components/shapes/shape03";
import Shape05 from "../_components/shapes/shape05";
import Shape06 from "../_components/shapes/shape06";
import VennDiagram from "./vennDiagram";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollSmoother, ScrollTrigger, SplitText, useGSAP)
}

export default function WhyChooseUs() {
  return (
    <>
      <Hero />
      <MarqueeAnimation />
      <StackCards />
      <ScrollTextReveal />
      <About />
      <CTA />
      <VennDiagram />
      <GridLayout />

      {/* <TextSection /> */}
      {/* <div className="min-h-screen"> */}
        {/* <Curtains pixelRatio={Math.min(1.5, window.devicePixelRatio)}>
        <SimplePlane />
      </Curtains> */}
      {/* </div> */}
    </>
  );
}


const About = () => {
  const timelineRef = useRef(null);
  const [swiper, setSwiper] = useState(null); // (vertical) swiper
  const [swiper2, setSwiper2] = useState(null); // (horizontal) swiper

  useEffect(() => {
    gsap.fromTo(
      ".lines__line.mod--timeline-1",
      { width: "0" },
      {
        width: "340px",
        duration: 1,
        scrollTrigger: {
          trigger: ".timeline-section",
          start: "top center",
          toggleActions: "play none none none",
        },
      }
    );

    gsap.fromTo(
      ".lines__line.mod--timeline-2",
      { width: "0" },
      {
        width: "980px",
        duration: 1,
        scrollTrigger: {
          trigger: ".timeline-section",
          start: "top center",
          toggleActions: "play none none none",
        },
      }
    );

    gsap.fromTo(
      ".timeline__line2",
      { width: "0" },
      {
        width: "100%",
        duration: 1,
        scrollTrigger: {
          trigger: ".timeline-section",
          start: "top center",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  useEffect(() => {
    if (swiper2) {
      swiper2.slideTo(2, 0);
    }

    const handleScroll = () => {
      const timelineElement = timelineRef.current;
      if (timelineElement) {
        const offset = timelineElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (offset.top < 0 && offset.bottom - windowHeight > 0) {
          const perc = Math.round(
            (100 * Math.abs(offset.top)) / (offset.height - windowHeight)
          );

          if (perc > 10 && perc < 30) {
            swiper?.slideTo(0, 1000);
            swiper2?.slideTo(0, 1000);
          } else if (perc >= 30 && perc < 55) {
            swiper?.slideTo(1, 1000);
            swiper2?.slideTo(1, 1000);
          } else if (perc >= 55) {
            swiper?.slideTo(2, 1000);
            swiper2?.slideTo(2, 1000);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [swiper, swiper2]);

  return (
    <section
      className="timeline-section timeline-section--timeline"
      ref={timelineRef}
    >
      <div className="timeline_sticky">
        <div className="content-timeline">
          <div className="timeline__lines-wrap">
            <div className="lines mod--timeline">
              <div className="lines__line mod--timeline-1"></div>
              <div className="lines__line mod--timeline-2"></div>
            </div>
          </div>

          {/* (Horizontal Swiper) */}
          <div className="timeline-grid mod--timeline w-layout-grid">
            <div className="timeline__col mod--2">
              <Swiper
                onSwiper={(swiper) => setSwiper2(swiper)}
                mousewheel={true}
                slidesPerView={1}
                spaceBetween={20}
                speed={800}
                allowTouchMove={false}
                initialSlide={2}
                wrapperClass="horizontal-wrapper"
                className="swiper swiper-reviews-numb"
              >
                <SwiperSlide className="swiper-slide slide--reviews-numb">
                  <div className="timeline__year">2001</div>
                </SwiperSlide>
                <SwiperSlide className="swiper-slide slide--reviews-numb">
                  <div className="timeline__year">2009</div>
                </SwiperSlide>
                <SwiperSlide className="swiper-slide slide--reviews-numb">
                  <div className="timeline__year">2024</div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>

          <div className="timeline__line2"></div>
          <Swiper
            onSwiper={setSwiper}
            mousewheel={true}
            slidesPerView={1}
            speed={1000}
            allowTouchMove={false}
            initialSlide={0}
            direction="vertical"
            wrapperClass="vertical-wrapper"
            breakpoints={{
              992: {
                spaceBetween: 0,
                centeredSlides: false,
                slidesPerView: 1,
              },
              320: {
                spaceBetween: 48,
                centeredSlides: true,
                slidesPerView: 1,
              },
            }}
            className="swiper swiper--reviews"
          >
            {/* First Slide - Renovation (2005) */}
            <SwiperSlide className="swiper-slide slide--reviews">
              <div className="timeline-grid mod--timeline2">
                <div className="timeline__col mod--1">
                  {/* <img
                    src="images/ico_building-01.svg"
                    loading="lazy"
                    alt=""
                    className="timeline__ico"
                  /> */}
                  <div className="timeline__ico-title">
                    Invisalign <br />
                    Pioneers
                  </div>
                </div>
                <div className="timeline__col mod--4">
                  <div className="timeline__txt-block">
                    <p className="timeline__p">
                      Lehigh Valley's first Invisalign provider. Continuing to
                      hone our skill-set while testing new aligner systems.
                    </p>
                    <div className="timeline__tags">
                      <div className="btn-tag">
                        <span className="btn-tag__star"></span>i-Tero
                      </div>
                      <div className="btn-tag">
                        <span className="btn-tag__star"></span>Diamond Plus
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            {/* Second Slide - Innovation () */}

            <SwiperSlide className="swiper-slide slide--reviews">
              <div className="timeline-grid mod--timeline2">
                <div className="timeline__col mod--1">
                  {/* <img
                    src="images/ico_builing-03.svg"
                    loading="lazy"
                    alt=""
                    className="timeline__ico"
                  /> */}
                  <div className="timeline__ico-title">
                    Expertise <br />
                    Defined
                  </div>
                </div>
                <div className="timeline__col mod--4">
                  <div className="timeline__txt-block">
                    <p className="timeline__p">
                      Our doctors bring a combined 60 years of experience.
                    </p>
                    <div className="timeline__tags">
                      <div className="btn-tag">
                        <span className="btn-tag__star"></span>Lorem
                      </div>
                      <div className="btn-tag">
                        <span className="btn-tag__star"></span>Ipsum
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            {/* Third Slide - Board Certification (1995) */}
            <SwiperSlide className="swiper-slide slide--reviews">
              <div className="timeline-grid mod--timeline2">
                <div className="timeline__col mod--1">
                  {/* <img
                    src="images/ico_builing-02.svg"
                    loading="lazy"
                    alt=""
                    className="timeline__ico"
                  /> */}
                  <div className="timeline__ico-title">
                    Leading <br />
                    Recognition
                  </div>
                </div>
                <div className="timeline__col mod--4">
                  <div className="timeline__txt-block">
                    <p className="timeline__p">
                      We’ve had more patients featured on the cover of the
                      American Journal of Orthodontics than any other practice.
                    </p>
                    <div className="timeline__tags">
                      <div className="btn-tag">
                        <span className="btn-tag__star"></span>i-Tero
                      </div>
                      <div className="btn-tag">
                        <span className="btn-tag__star"></span>3D Fabrication
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </section>
  );
};
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
    <div className="h-screen bg-212121">
      <div className="bg-[#DFFF00] min-h-screen min-w-full flex justify-center items-center">
        <div className="relative my-[10vh] mx-auto p-0 rounded-[5rem] overflow-hidden w-[90vw] h-[80vh] bg-[#E8E8E4]">
          <h2 className="absolute top-20 left-[5vw] m-0 text-[10vw] uppercase text-center">
            {title}
          </h2>
          <img
            src={imageUrl}
            alt={title}
            className="block object-cover w-full h-full"
          />
        </div>
      </div>

      <section>
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

        <section className="absolute w-full mx-auto my-16 text-center top-60 md:h-16 md:flex-row">
          <div className="h-full overflow-hidden">
            <ul
              style={{
                animation: "scroll-text-up 5s infinite",
              }}
            >
              <li className="py-1 ">
                <h1 className="font-neue-montreal text-7xl">Invisalign</h1>
              </li>
              <li className="py-1 ">
                <h1 className="font-neue-montreal text-7xl">Damon Braces</h1>
              </li>
              <li className="py-1 ">
                <h1 className="font-neue-montreal text-7xl">
                  Accelerated Orthodontic Treatment
                </h1>
              </li>
              <li className="py-1 ">
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
          className="inline-flex transition-transform duration-100 book-svg"
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
          className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
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

function MarqueeAnimation() {
  const textContainerRef = useRef(null);
  const textRef1 = useRef(null);
  const textRef2 = useRef(null);

  useEffect(() => {
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
      <g clipPath="url(#clip0_104_26)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
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
    <section className="project-section">
      <div
        ref={marqueeRef}
        className="flex w-full overflow-hidden whitespace-nowrap"
      >
        <div className="text-[#E8E2D6] flex">
          {duplicatedItems.map((item, index) => (
            <div key={index} className="mx-4 marquee-item">
              <h3 className="text-3xl font-semibold uppercase">{item}</h3>
            </div>
          ))}
        </div>
        <div className="text-[#E8E2D6] flex">
          {duplicatedItems.map((item, index) => (
            <div
              key={index + duplicatedItems.length}
              className="mx-4 marquee-item"
            >
              <h3 className="text-3xl font-semibold uppercase">{item}</h3>
            </div>
          ))}
        </div>
      </div>
      {/* <div className="flex items-center appointmentMarquee">
        <svg width="50" height="50" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_104_26)">
          <path fillRule="evenodd" clipRule="evenodd" d="M107.143 0H92.8571V82.7556L34.3401 24.2385L24.2386 34.3401L82.7556 92.8571H0V107.143H82.7555L24.2386 165.66L34.3401 175.761L92.8571 117.244V200H107.143V117.244L165.66 175.761L175.761 165.66L117.244 107.143H200V92.8571H117.244L175.761 34.34L165.66 24.2385L107.143 82.7555V0Z" fill="#E8E2D6"/>
        </g>
          <clipPath id="clip0_104_26">
            <rect width="200" height="200" fill="white"/>
          </clipPath>
        </svg>
        <div className="project-heading col-lg-6">
          <h1>UNPARALLELED CARE AND EXPERTISE</h1>
        </div>
        <svg width="50" height="50" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_104_26)">
            <path fillRule="evenodd" clipRule="evenodd" d="M107.143 0H92.8571V82.7556L34.3401 24.2385L24.2386 34.3401L82.7556 92.8571H0V107.143H82.7555L24.2386 165.66L34.3401 175.761L92.8571 117.244V200H107.143V117.244L165.66 175.761L175.761 165.66L117.244 107.143H200V92.8571H117.244L175.761 34.34L165.66 24.2385L107.143 82.7555V0Z" fill="#E8E2D6"/>
          </g>
          <clipPath id="clip0_104_26">
            <rect width="200" height="200" fill="white"/>
          </clipPath>
        </svg>
      </div> */}
    </section>
  );
}

function StackCards() {
  return (
    <section className="rounded-2xl bg-[#F1F1F1] py-24 sm:py-32">
      <div className="container relative mx-auto">
        <div className="max-w-screen-lg mx-auto mt-10 space-y-16">
          <div className="font-neue-montreal relative px-8 lg:px-16 py-8 mx-auto max-w-[60dvw] translate-x-[4dvw] border-2 border-[#c5cfc7] -rotate-2 hover:rotate-0 transition-all duration-150 ease-linear hover:scale-105 ">
            <h4>
              We strive to attain finished results consistent with the{" "}
              <span>American Board of Orthodontics (ABO)</span> qualitative
              standards. Our doctors place great priority on the certification
              and recertification process, ensuring that all diagnostic records
              adhere to ABO standards.
            </h4>
          </div>
          <div className="font-neue-montreal px-8 lg:px-16 py-8 mx-auto max-w-[60dvw] -translate-x-[2dvw] border-2 border-[#c5cfc7] transition-all duration-150 ease-linear hover:scale-105 rotate-2 hover:rotate-0">
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
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const textRef = useRef(null);
  const bgTextColor = "#CECED3";
  const fgTextColor = "#161818";

  useEffect(() => {
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
      <div className="flex ">
        <div className="px-40">
          <p ref={textRef} className="text-3xl uppercase font-helvetica-neue">
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
              className="w-4/5 max-w-xs cursor-pointer h-4/5"
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
        <div className="flex items-center self-start ml-60">
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
        <div className="flex items-center self-start ml-60">
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

function GridLayout() {
  useGSAP(() => {
    const isTouchDevice = 'ontouchstart' in window

    let targetMedias = gsap.utils.toArray('.media')

    const parallaxMouse = () => {
      document.addEventListener('mousemove', (e) => {
        targetMedias.forEach((targetMedia, i) => {
          const deltaX = (e.clientX - window.innerWidth / 2) * 0.01
          const deltaY = (e.clientY - window.innerHeight / 2) * 0.01

          gsap.to(targetMedia, {
            x: deltaX,
            y: deltaY,
            scale: 1.02,
            duration: 0.75,
            ease: "power4",
          })
        })
      })

      document.addEventListener('mouseleave', (e) => {
        targetMedias.forEach((targetMedia) => {
          gsap.to(targetMedia, {
            x: 0,
            y: 0,
            scale: 1.02,
            duration: 0.75,
            ease: "power4",
          })
        })
      })
    }

    if (!isTouchDevice) {
      parallaxMouse()
    }
  })

  return (
    <section>
      <div className="grid grid-cols-8 h-[60dvh]">
        <div className="relative col-span-4 lg:col-span-5 h-full place-content-center place-items-center bg-[#6a7265] text-center flex gap-2 p-8">
          <h2 className="text-2xl break-words lg:text-4xl xl:text-6xl font-editorial-new text-[#1d1f1b]">
            <span
              className="text-4xl lg:text-6xl xl:text-8xl font-nautica"
              style={{
                color: "#434840",
                WebkitTextFillColor: "#6a7265",
                WebkitTextStroke: "1px #434840",
              }}
            >
              We{" "}
            </span>
            have 50+ years of experience
          </h2>
          <GalaxyShape className="absolute inset-0 hidden object-cover object-center w-full h-full p-8 lg:block lg:p-16 text-[#444941]" />
        </div>
        <div className="relative h-full col-span-4 overflow-hidden lg:col-span-3">
          <img
            src="/../../images/pexels-cedric-fauntleroy-4269276_1920x2880.jpg"
            alt="dental chair"
            className="absolute inset-0 object-cover object-center w-full h-full media"
          />
        </div>
      </div>
      <div className="grid grid-cols-9 lg:h-[50vh]">
        <div className="min-h-[50vh] h-full col-span-9 bg-[#988193] text-[#f4f4f4] lg:col-span-3 place-content-center place-items-center p-8">
          <p className="text-2xl tracking-wide text-center font-editorial-new">
            <span className="block uppercase font-agrandir-grandheavy">
              25,000+{" "}
            </span>
            patients treated
          </p>
        </div>
        <div className="relative min-h-[50vh] h-full col-span-9 lg:col-span-3 place-content-center overflow-hidden">
          <img
            src="/../../images/aurela-redenica-VuN-RYI4XU4-unsplash_2400x3600.jpg"
            alt="invisalign aligners and case"
            className="absolute inset-0 object-cover object-bottom w-full h-full media"
          />
        </div>
        <div className="min-h-[50vh] h-full col-span-9 bg-[#988193] text-[#f4f4f4] lg:col-span-3 place-content-center place-items-center p-8">
          <p className="text-2xl tracking-wide text-center font-editorial-new">
            <span className="block uppercase font-agrandir-grandheavy">
              ABO{" "}
            </span>
            certified
          </p>
        </div>
      </div>
      <div className="grid grid-cols-9 lg:h-[50vh]">
        <div className="relative min-h-[50vh] h-full col-span-9 lg:col-span-3 place-content-center overflow-hidden">
          <img
            src="/../../images/goby-D0ApR8XZgLI-unsplash_2400x1467.jpg"
            alt="hand reaching towards another hand offering pink toothbrush"
            className="absolute inset-0 object-cover object-right w-full h-full media"
          />
        </div>
        <div className="min-h-[50vh] h-full col-span-9 bg-[#988193] text-[#f4f4f4] lg:col-span-3 place-content-center place-items-center p-8">
        <p className="text-2xl tracking-wide text-center font-editorial-new">
          <span className="block uppercase font-agrandir-grandheavy">
            10+{" "}
          </span>
          members
        </p>
        </div>
        <div className="relative min-h-[50vh] h-full col-span-9 lg:col-span-3 place-content-center overflow-hidden">
          <img
            src="/../../images/pexels-cedric-fauntleroy-4269491_1920x2880.jpg"
            alt="dental equipment"
            className="absolute inset-0 object-cover object-center w-full h-full media"
          />
        </div>
      </div>
      <div className="grid grid-cols-9 lg:h-[50vh]">
        <div className="min-h-[50vh] h-full col-span-9 bg-[#988193] text-[#f4f4f4] lg:col-span-3 place-content-center place-items-center p-8">
          <p className="text-2xl tracking-wide text-center font-editorial-new">
            <span className="block uppercase font-agrandir-grandheavy">
              4{" "}
            </span>
            locations
          </p>
        </div>
        <div className="relative min-h-[50vh] h-full col-span-9 lg:col-span-3 place-content-center overflow-hidden">
          <img
            src="/../../images/tony-litvyak-glPVwPr1FKo-unsplash_2400x3600.jpg"
            alt="woman smiling"
            className="absolute inset-0 object-cover object-center w-full h-full media"
          />
        </div>
        <div className="min-h-[50vh] h-full col-span-9 bg-[#988193] text-[#f4f4f4] lg:col-span-3 place-content-center place-items-center p-8">
          <p className="text-2xl tracking-wide text-center font-editorial-new">
            <span className="block uppercase font-agrandir-grandheavy">
              advanced{" "}
            </span>
            technology
          </p>
        </div>
      </div>
    </section>
  )
}