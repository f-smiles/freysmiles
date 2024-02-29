"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll } from 'framer-motion';
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowLeftIcon from "../_components/ui/ArrowLeftIcon";
import ArrowRightIcon from "../_components/ui/ArrowRightIcon";
const OurTeam = () => {
  
  const [isVisible, setIsVisible] = useState(false);
 
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
        end: "+=1000",
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
  const nameRef = useRef(null);
  const pRef = useRef(null);


  useEffect(() => {
    if (!CSS.supports('animation-timeline: scroll()')) {
      gsap.registerPlugin(ScrollTrigger);
      const scrub = 0.2;

      if (nameRef.current) {
        const name = nameRef.current;

        gsap.timeline({
          scrollTrigger: {
            invalidateOnRefresh: true,
            trigger: name.parentNode,
            scrub: scrub,
            start: "top top",
            end: "bottom top-=25%"
          }
        })
        .to(name, { opacity: 1 })
        .to(name, {
          scrollTrigger: {
            invalidateOnRefresh: true,
            trigger: name.parentNode,
            scrub: scrub,
            start: "top top",
            end: "bottom top"
          },
          keyframes: {
            "0%": { background: "transparent" },
            "95%": { background: "transparent" },
            "100%": { z: "99vh", background: "black" }
          }
        }, 0);
      }

      if (pRef.current) {
        const p = pRef.current;

        gsap.timeline()
          .to(p, {
            opacity: 1,
            immediateRender: false,
            scrollTrigger: {
              trigger: p.parentNode.parentNode,
              scrub: scrub,
              start: "top bottom",
              end: "top 50%"
            }
          })
          .to(p, {
            opacity: 0,
            immediateRender: false,
            scrollTrigger: {
              trigger: p.parentNode.parentNode,
              scrub: scrub,
              start: "bottom bottom",
              end: "bottom 50%"
            }
          });
      }

    }
  }, []);

  return (
    <>
      {/* <section
        className="headerFirst"
        style={{
          height: "100vh",
          maxWidth: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2,
          paddingTop: "10vh"
     
        }}
      >
        <div className="header-reveal  text-8xl"
        ></div>
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
      </section> */}
<section className="main-section">
  
  <div className="section__content">
    
    <svg ref={nameRef}>

      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
        Meet Our Team
      </text>
    </svg>
  </div>
</section>

<section className="main-section">
  <div className="section__content">
    <p ref={pRef}>
    <div className="text-white font-didot flex justify-center items-center">
    <h2 className="text-[100px] m-0 text-center leading-[0.9] vertical-text">Our</h2>
    <h2 className="text-[100px] m-0 text-center leading-[0.9] normal-text">Doctors</h2>
  </div>
    </p>
  </div>
</section>
      <section
        className="text-wrapper"
        style={{
          height: "100vh",
          // paddingTop:"-10rem",
          maxWidth: "100%",
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2,

        }}
      >
        <div className="imageContainer art-wrapper">
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
                  <p>maybe a review or something about team qualifications</p>
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


        <section >


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
              src="/../../images/team_members/nicolle-Photoroom.jpg"
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
              src="/../../images/team_members/grace-Photoroom.jpg"
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

export default OurTeam;