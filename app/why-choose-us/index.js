"use client";
// gsap
// import { Curtains, useCurtains, Plane } from "react-curtains";
// import { Vec2 } from "curtainsjs";
// import SimplePlane from "./curtains"
import { Swiper, SwiperSlide } from "swiper/react";
import {
  motion,
  useScroll,
  useTransform,
  stagger,
  useAnimate,
  useInView,
} from "framer-motion";
import { DrawSVGPlugin } from "gsap-trial/DrawSVGPlugin";
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
  gsap.registerPlugin(
    ScrollSmoother,
    ScrollTrigger,
    SplitText,
    DrawSVGPlugin,
    useGSAP
  );
}

export default function WhyChooseUs() {
  return (
    <>
      <Hero />
      {/* <MarqueeAnimation /> */}
      <div >
<CardStack />
</div>
      {/* <ScrollTextReveal /> */}
      <About />
      <StackCards />
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



function Hero() {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const imageRefs = useRef([]);
  const boxRefs = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline();

    gsap.set(imageRefs.current, { opacity: 0, y: "100%" });
    gsap.set(boxRefs.current, { y: "0%" });
    gsap.set(contentRef.current, { opacity: 0 });

    tl.to(overlayRef.current, {
      y: "-100%",
      duration: 1.5,
      ease: "power2.inOut",
    });

    tl.add(() => {
      imageRefs.current.forEach((image, index) => {
        gsap.to(boxRefs.current[index], {
          y: "-100%",
          duration: 1.8,
          ease: "power2.inOut",
          delay: index * 0.2,
        });

        gsap.to(image, {
          opacity: 1,
          y: "0%",
          rotate: 0,
          duration: 1.5,
          ease: "power2.out",
          delay: index * 0.2,
        });
      });
    }, "+=0.2");


    tl.to(
      contentRef.current,
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
      "-=1"
    );
  }, []);

  const title = "Experts in";
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


  const pathRef = useRef(null);
const cardsectionRef =useRef(null)

useEffect(() => {
  const path = pathRef.current;
  const pathLength = path.getTotalLength();

  gsap.set(path, {
    strokeDasharray: pathLength,
    strokeDashoffset: pathLength,
  });


  gsap.to(path, {
    strokeDashoffset: 0,
    duration: 3,
    ease: "power2.out",
    onComplete: () => {
      gsap.to(path, {
        strokeDashoffset: pathLength, 
        ease: "none",
        scrollTrigger: {
          trigger: cardsectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1, 
        },
      });
    },
  });

  // Pin section 
  ScrollTrigger.create({
    trigger: cardsectionRef.current,
    start: "top top",
    end: "+=150%", 
    pin: true,
    pinSpacing: true,
  });

}, []);
  return (
    <>
      
      <div className="relative h-screen w-full bg-[#F1F2F4] text-black">
        <div ref={overlayRef} className="absolute inset-0 bg-black z-20"></div>

        <div
          className="absolute inset-0 flex items-center justify-center text-3xl font-helvetica-neue-light z-20"
          style={{ mixBlendMode: "difference", color: "white" }}
        >
          <section className="relative w-full mx-auto my-16  md:h-16">
            <h2 className="text-[3vw] ml-20">{title}</h2>

            <div className="mt-4 ml-20 h-[3rem] overflow-hidden">
              <ul
                style={{
                  animation: "scroll-text-up 5s infinite",
                }}
              >
                <li className="py-1">
                  <h1 className="font-neue-montreal text-3xl">Invisalign</h1>
                </li>
                <li className="py-1">
                  <h1 className="font-neue-montreal text-3xl">Damon Braces</h1>
                </li>
                <li className="py-1">
                  <h1 className="font-neue-montreal text-3xl">
                    Accelerated Treatment
                  </h1>
                </li>
                <li className="py-1">
                  <h1 className="font-neue-montreal text-3xl">
                    Low-Dose 3D Radiographs
                  </h1>
                </li>
                <li className="py-1">
                  <h1 className="font-neue-montreal text-3xl">Invisalign</h1>
                </li>
              </ul>
            </div>
          </section>
        </div>

        <div ref={contentRef}>
          <div className="absolute top-1/4 right-10 flex flex-col gap-8">
            {[
              "../images/landscapeimage.jpg ",
              "../images/iphonemockup.jpg",
            ].map((src, index) => (
              <div
                key={index}
                className={`wrapper-img relative overflow-hidden ${
                  index === 0
                    ? "w-[300px] h-[388px] absolute top-[120px] right-[-100px] rotate-[-10deg]"
                    : "w-[450px] h-[275px] absolute bottom-[80px] left-[-400px] rotate-[8deg]"
                }`}
              >
                <div
                  ref={(el) => (boxRefs.current[index] = el)}
                  className="box absolute inset-0 bg-black"
                ></div>

                <img
                  ref={(el) => (imageRefs.current[index] = el)}
                  src={src}
                  alt={`Placeholder ${index + 1}`}
                  className="absolute w-full h-full object-cover opacity-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 951 367"
                fill="none"
                className="w-full max-w-lg h-auto"
              >
                <path
                  ref={pathRef}
                  d="M926 366V41.4C926 32.7 919 25.6 910.2 25.6C904.6 25.6 899.7 28.4 897 32.9L730.2 333.3C727.5 338 722.3 341.2 716.5 341.2C707.8 341.2 700.7 334.2 700.7 325.4V41.6C700.7 32.9 693.7 25.8 684.9 25.8C679.3 25.8 674.4 28.6 671.7 33.1L504.7 333.3C502 338 496.8 341.2 491 341.2C482.3 341.2 475.2 334.2 475.2 325.4V41.6C475.2 32.9 468.2 25.8 459.4 25.8C453.8 25.8 448.9 28.6 446.2 33.1L280.2 333.3C277.5 338 272.3 341.2 266.5 341.2C257.8 341.2 250.7 334.2 250.7 325.4V41.6C250.7 32.9 243.7 25.8 234.9 25.8C229.3 25.8 224.4 28.6 221.7 33.1L54.7 333.3C52 338 46.8 341.2 41 341.2C32.3 341.2 25.2 334.2 25.2 325.4V1"
                  stroke="#0C0EFE"
                  strokeWidth="40"
                  strokeMiterlimit="10"
                  strokeLinejoin="round"
                  style={{ strokeDasharray: "3202.1", strokeDashoffset: "0px" }}
                />
              </svg>
     
    </>
  );
}

const CardStack = () => {
  const list1Ref = useRef(null);

  useEffect(() => {
    const container = list1Ref.current;
    const listChilds = container.querySelectorAll('.list-child');
  
    listChilds.forEach((el, i) => {
      gsap.set(el, {
        x: 0,
        y: 0,
        rotate: 0,
        zIndex: listChilds.length - i,
      });
    });
  
    const offsets = [
      { x: 100,  y: -200, rotate:  17 },
      { x: -160, y: -280, rotate: -12 },
      { x: 200,  y: -400, rotate:  -12 },
      { x: -100, y: -500, rotate: 10 },
    ];
  
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 200px',
        end: `+=${listChilds.length * 200}`, 
        scrub: true,
        pin: true,
        // markers: true,
      },
    });
  
    tl.add('animate');
    listChilds.forEach((el, i) => {
      tl.to(el, offsets[i], 'animate');
    });
  
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  return (
    <div className="l-wrapper">
      <div className="list1" id="list1" ref={list1Ref}>
        <ul className="card-list list">
<li className="list-child bg-[#c3531d]">
    <div className="card-inner">
      <h2 className="card-title">Tech-Savvy Teeth Things</h2>
      <p className="card-subtitle">Scanned. Not gooped.</p>
      <div className="card-caption-box">
      3D iTero scanning /<br />
      low-dose Radiographs /<br />
      3D printing
    </div>
    </div>
  </li>
          <li className="list-child text-type1 bg-[#8dca9c]">
          <div className="card-inner">
      <h2 className="card-title">Outcomes</h2>
      <p className="card-subtitle">Over 25,000 patients</p>
      <div className="card-caption-box">
      Web Design & Dev /<br />
      Art Direction /<br />
      Illustration
    </div>
    </div>
          </li>
          <li className="list-child text-type1 bg-[#E5AB38]">
          <div className="card-inner">
      <h2 className="card-title">Specialists, not generalists</h2>
      <p className="card-subtitle">You wouldn’t hire a generalist surgeon</p>
      <div className="card-caption-box">
      Board certified /<br />
      ABO certified /<br />
      Combined 50+ years experience
    </div>
    </div>
            
   </li>
          <li className="list-child text-type1 bg-[#BD8399]">
          <div className="card-inner">
      <h2 className="card-title">4 Locations</h2>
      <p className="card-subtitle">IRL + URL</p>
      <div className="card-caption-box">
      Allentown / Bethlehem /<br />
      Lehighton /<br />
      Schnecksville
    </div>
    </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
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
            <SwiperSlide className="swiper-slide slide--reviews">
              <div className="timeline-grid mod--timeline2">
                <div className="timeline__col mod--1">
                  <img
                    src="../images/diamondinvismockup.png"
                    loading="lazy"
                    alt=""
                    className="timeline__ico"
                  />
                  <div className="timeline__ico-title">
                    Invisalign <br />
                    Pioneers
                  </div>
                </div>
                <div className="timeline__col mod--4">
                  <div className="timeline__txt-block">
                    <p className="timeline__p">
                      Lehigh Valley&apos;s first Invisalign provider. Continuing
                      to hone our skill-set while testing new aligner systems.
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

            {/* Second Slide - Innovation */}

            <SwiperSlide className="swiper-slide slide--reviews">
              <div className="timeline-grid mod--timeline2">
                <div className="timeline__col mod--1">
                  <img
                    src="../images/doctorphoto.png"
                    loading="lazy"
                    alt=""
                    className="timeline__ico"
                  />
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
                  <img
                    src="../images/fsajo.png"
                    loading="lazy"
                    alt=""
                    className="timeline__ico"
                  />
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



function StackCards() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const topPathLength = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const bottomPathLength = useTransform(scrollYProgress, [0.5, 1], [0, 1]);

  return (
    <section ref={containerRef}>
      <section className="rounded-2xl bg-[#F1F1F1] sm:py-32">
        {/* <div className=" w-48 h-48 -translate-x-1/4 -z-10">
          <Shape06 />
        </div> */}

        <div className="flex items-start space-x-8">
          {/* <div className="flex justify-center items-center h-screen bg-gray-100">
            <svg
              className="hero__middle-line"
              width="35"
              height="1000"
              viewBox="0 0 35 767"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                id="top-line"
                d="M17 -8L17 350"
                stroke="#292929"
                strokeWidth="1"
                className="stroke-current text-gray-800"
                style={{ pathLength: topPathLength }}
              />

              <motion.path
                id="middle-icon"
                d="M28.5729 367.223C28.6362 367.054 28.5981 366.887 28.5221 366.772C28.4614 366.68 28.3867 366.633 28.3579 366.616C28.2975 366.58 28.2432 366.566 28.2305 366.563L28.2296 366.562C28.1944 366.553 28.1645 366.549 28.156 366.548L28.1556 366.548C28.1315 366.545 28.107 366.544 28.0898 366.543C28.0514 366.54 27.9995 366.539 27.9377 366.537C27.8124 366.533 27.6276 366.53 27.3867 366.527C26.9041 366.521 26.1876 366.516 25.253 366.512C23.3833 366.504 20.636 366.5 17.1301 366.5C14.107 366.5 11.3585 366.503 9.36568 366.507C8.36934 366.509 7.5615 366.512 7.00254 366.515C6.72321 366.516 6.50525 366.518 6.35674 366.52C6.2828 366.52 6.22448 366.521 6.18394 366.522C6.16427 366.523 6.14557 366.523 6.13038 366.524C6.12397 366.524 6.11154 366.525 6.09793 366.526L6.0977 366.526C6.09281 366.526 6.07479 366.528 6.05272 366.532L6.05234 366.532C6.04416 366.533 6.01208 366.539 5.97322 366.552C5.94983 366.561 5.88834 366.591 5.85162 366.614C5.78642 366.669 5.66176 366.872 5.6378 367.025C5.64027 367.074 5.65304 367.147 5.65958 367.171C5.66393 367.184 5.67195 367.206 5.67541 367.215C5.68206 367.231 5.68815 367.243 5.69044 367.248C5.69577 367.259 5.70048 367.267 5.70217 367.27C5.70639 367.278 5.71051 367.285 5.7131 367.289C5.71886 367.299 5.72622 367.311 5.73432 367.325C5.75089 367.352 5.77485 367.391 5.80541 367.44C5.86673 367.539 5.9568 367.684 6.07229 367.869C6.30339 368.239 6.63741 368.773 7.0494 369.43C7.87344 370.744 9.00995 372.554 10.2601 374.541C13.0572 378.987 14.6416 381.504 15.5359 382.919C15.9828 383.626 16.2584 384.059 16.4272 384.32C16.5114 384.451 16.5708 384.541 16.6124 384.602L16.6161 384.608C16.644 384.649 16.6921 384.72 16.742 384.769L16.7422 384.77C16.9317 384.957 17.1611 384.918 17.2469 384.891C17.3302 384.865 17.3862 384.823 17.4039 384.809C17.4475 384.776 17.4788 384.742 17.4905 384.729C17.5206 384.695 17.5515 384.655 17.5787 384.618C17.6365 384.539 17.7162 384.424 17.8179 384.272C18.0229 383.966 18.3328 383.489 18.7664 382.812C19.6345 381.456 21.0061 379.286 23.0428 376.05C24.5464 373.66 25.9153 371.482 26.9096 369.899C27.4067 369.107 27.8103 368.464 28.0902 368.017C28.2301 367.793 28.3393 367.618 28.414 367.498C28.4512 367.439 28.4802 367.392 28.5001 367.36L28.5245 367.32L28.5341 367.304L28.5416 367.29C28.5431 367.288 28.5461 367.282 28.5496 367.275L28.5497 367.275C28.5512 367.272 28.5624 367.251 28.5729 367.223ZM28.5729 367.223L28.1047 367.047M28.5729 367.223C28.573 367.222 28.573 367.222 28.5731 367.222L28.1047 367.047M28.1047 367.047C28.1028 367.052 28.0104 367.201 27.8412 367.472M28.1047 367.047C28.1049 367.047 28.1031 367.046 28.0992 367.045C28.0992 367.045 28.0991 367.045 28.0991 367.045C28.0675 367.04 27.9007 367.035 27.6048 367.03C27.6065 366.979 27.6163 366.926 27.6362 366.873L27.8412 367.472M27.8412 367.472C27.8447 367.474 27.8478 367.476 27.8505 367.477C27.9098 367.512 27.9627 367.526 27.974 367.529L27.9749 367.529C28.0071 367.538 28.032 367.541 28.0326 367.541C28.0372 367.541 28.04 367.542 28.04 367.542C28.04 367.542 28.0373 367.541 28.0308 367.541C28.0087 367.54 27.9696 367.538 27.9101 367.536C27.8786 367.536 27.8427 367.535 27.8024 367.534M27.8412 367.472L27.8024 367.534M27.8024 367.534C27.0551 368.729 25.0072 371.989 22.6196 375.783C19.5692 380.631 18.0131 383.082 17.4054 383.989L27.8024 367.534ZM17.1257 370.356C19.6999 370.356 21.0865 370.357 21.8284 370.367C21.6977 370.578 21.5409 370.829 21.3646 371.111C20.8444 371.944 20.1555 373.042 19.4672 374.136C18.779 375.23 18.0918 376.32 17.5749 377.136C17.4044 377.405 17.2527 377.644 17.1256 377.843C16.9985 377.644 16.8467 377.405 16.6763 377.136C16.1594 376.32 15.4721 375.231 14.784 374.137C14.0958 373.043 13.4069 371.945 12.8867 371.113C12.7101 370.83 12.553 370.578 12.4222 370.367C13.1631 370.357 14.549 370.356 17.1257 370.356ZM1.90839 372.718L1.90843 372.718L9.45227 384.757C11.4356 387.922 13.2432 390.799 14.5576 392.886C15.2148 393.929 15.749 394.775 16.1203 395.36C16.3059 395.652 16.4512 395.88 16.5511 396.036C16.6008 396.113 16.6402 396.174 16.6679 396.216C16.6814 396.236 16.6939 396.255 16.7042 396.27C16.7087 396.276 16.7163 396.287 16.7249 396.298C16.7283 396.303 16.7384 396.316 16.7522 396.332C16.7579 396.338 16.7748 396.357 16.799 396.378C16.8124 396.389 16.8482 396.415 16.8712 396.43C16.9123 396.452 17.0396 396.492 17.1266 396.5C17.2625 396.5 17.3575 396.444 17.3805 396.431C17.4167 396.41 17.4426 396.389 17.455 396.378C17.4809 396.356 17.4997 396.335 17.5074 396.327C17.5253 396.307 17.5407 396.287 17.5503 396.274C17.5716 396.246 17.5966 396.211 17.6225 396.173C17.6755 396.097 17.7472 395.989 17.8314 395.861C18.0005 395.602 18.227 395.248 18.4707 394.859L18.047 394.593L18.4707 394.859L19.3522 393.452L19.519 393.186L19.3516 392.92L18.0586 390.868C17.3479 389.74 14.3521 384.962 11.4009 380.25L6.03552 371.683L5.88983 371.45L5.61535 371.448L3.80947 371.435L2.00359 371.422L1.09253 371.416L1.57631 372.188L1.90839 372.718ZM20.5486 390.629C20.5767 390.644 20.6754 390.695 20.8125 390.688L20.8126 390.688C20.9228 390.67 21.0636 390.605 21.099 390.579C21.1159 390.564 21.1414 390.541 21.1506 390.531C21.1662 390.514 21.1774 390.5 21.1808 390.496C21.1897 390.485 21.1967 390.475 21.1995 390.471C21.2065 390.461 21.2138 390.45 21.2199 390.441C21.2329 390.421 21.2505 390.394 21.2719 390.361C21.3149 390.295 21.3773 390.197 21.4576 390.071C21.6183 389.818 21.8525 389.447 22.15 388.976C22.7451 388.032 23.5943 386.681 24.6167 385.053C26.6616 381.795 29.3998 377.424 32.1848 372.971L32.6738 372.189L33.1522 371.424H32.2498H30.4516H28.6535H28.376L28.2292 371.659L28.022 371.991C27.9084 372.174 25.74 375.634 23.2028 379.683C21.934 381.707 20.7805 383.556 19.944 384.905C19.5259 385.579 19.1866 386.128 18.9516 386.512C18.8343 386.704 18.7421 386.856 18.679 386.961C18.6477 387.014 18.6221 387.057 18.6037 387.09C18.5949 387.105 18.5853 387.122 18.577 387.138C18.5733 387.145 18.5664 387.159 18.5593 387.175C18.556 387.182 18.5492 387.198 18.5422 387.218L18.5422 387.218C18.5412 387.22 18.5137 387.293 18.5143 387.386L18.5143 387.386C18.5149 387.469 18.5365 387.533 18.5406 387.545L18.541 387.546C18.5485 387.569 18.5563 387.587 18.5611 387.598C18.5709 387.621 18.5817 387.642 18.5901 387.658C18.6076 387.692 18.6303 387.733 18.6551 387.776C18.7054 387.863 18.7755 387.981 18.8574 388.115C19.0217 388.385 19.2402 388.736 19.4595 389.084C19.6788 389.431 19.9004 389.777 20.0708 390.037C20.1557 390.166 20.2299 390.277 20.2854 390.357C20.3125 390.396 20.339 390.433 20.3619 390.463C20.3722 390.477 20.389 390.498 20.4086 390.519C20.4171 390.529 20.4377 390.551 20.4665 390.574C20.4803 390.585 20.5088 390.608 20.5486 390.629Z"
                stroke="#292929"
              />

              <motion.path
                id="bottom-line"
                d="M17 410L17 850"
                stroke="#292929"
                strokeWidth="1"
                className="stroke-current text-gray-800"
                style={{ pathLength: bottomPathLength }}
              />
            </svg>
          </div> */}
          <div className="container relative mx-auto">
            <div className="max-w-screen-lg mx-auto mt-10 space-y-16">
              <div className="transition-all duration-150 ease-linear hover:scale-105 hover:rotate-0 relative flex items-center justify-center mx-auto max-w-[80vw]">
                <div className="absolute inset-0 bg-[#1d2120] h-full w-full" />

                <div className="relative w-[110%] bg-[#F1F1F1] px-12 py-6 rounded-[100px] border-t border-b border-[#1d2120] overflow-hidden">
                  <div className="py-12 font-neue-montreal text-center text-[18px] text-black">
                    We strive to attain finished results consistent with the{" "}
                    <span className="font-bold">
                      American Board of Orthodontics (ABO)
                    </span>{" "}
                    qualitative standards. Our doctors place great priority on
                    the certification and recertification process, ensuring that
                    all diagnostic records adhere to ABO standards.
                  </div>
                </div>
              </div>

              <div className="transition-all duration-150 ease-linear hover:scale-105 hover:rotate-0 relative flex items-center justify-center mx-auto max-w-[80vw]">
                <div className="absolute inset-0 bg-[#1d2120] h-full w-full" />

                <div className="relative w-[110%] bg-[#F1F1F1] px-12 py-6 rounded-[100px] border-t border-b border-[#1d2120] overflow-hidden">
                  <div className="py-12 font-neue-montreal text-center text-[18px] text-black">
                    Currently, Dr. Gregg Frey is a certified orthodontist and is
                    preparing cases for recertification. Dr. Daniel Frey is in
                    the final stages of obtaining his initial certification.
                  </div>
                </div>
              </div>

              <div className="transition-all duration-150 ease-linear hover:scale-105  hover:rotate-0 relative flex items-center justify-center mx-auto max-w-[80vw]">
                <div className="absolute inset-0 bg-[#1d2120] h-full w-full" />

                <div className="relative w-[110%] bg-[#F1F1F1] px-12 py-6 rounded-[100px] border-t border-b border-[#1d2120] overflow-hidden">
                  <div className="py-12 font-neue-montreal text-center text-[18px] text-black">
                    To complement our use of cutting-edge diagnostic technology,
                    we uphold the highest standards for our records, ensuring
                    accuracy and precision throughout the treatment process.
                  </div>
                </div>
              </div>

              <div className="transition-all duration-150 ease-linear hover:scale-105 hover:rotate-0 relative flex items-center justify-center mx-auto max-w-[80vw]">
                <div className="absolute inset-0 bg-[#1d2120] h-full w-full" />

                <div className="relative w-[110%] bg-[#F1F1F1] px-12 py-6 rounded-[100px] border-t border-b border-[#1d2120] overflow-hidden">
                  <div className="py-12 font-neue-montreal text-center text-[18px] text-black">
                    Our office holds the distinction of being the
                    longest-standing, active board-certified orthodontic office
                    in the area. With four offices in the Lehigh Valley, we have
                    been providing unparalleled orthodontic care for over four
                    decades.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
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
    const isTouchDevice = "ontouchstart" in window;

    let targetMedias = gsap.utils.toArray(".media");

    const parallaxMouse = () => {
      document.addEventListener("mousemove", (e) => {
        targetMedias.forEach((targetMedia, i) => {
          const deltaX = (e.clientX - window.innerWidth / 2) * 0.01;
          const deltaY = (e.clientY - window.innerHeight / 2) * 0.01;

          gsap.to(targetMedia, {
            x: deltaX,
            y: deltaY,
            scale: 1.02,
            duration: 0.75,
            ease: "power4",
          });
        });
      });

      document.addEventListener("mouseleave", (e) => {
        targetMedias.forEach((targetMedia) => {
          gsap.to(targetMedia, {
            x: 0,
            y: 0,
            scale: 1.02,
            duration: 0.75,
            ease: "power4",
          });
        });
      });
    };

    if (!isTouchDevice) {
      parallaxMouse();
    }
  });

  return (
    <section>
      <div className="grid grid-cols-8 h-[60dvh]">
        <div className="relative col-span-4 lg:col-span-5 h-full place-content-center place-items-center bg-[#20282D] text-center flex gap-2 p-8">
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
            <span className="block uppercase font-agrandir-grandheavy">4 </span>
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
  );
}
