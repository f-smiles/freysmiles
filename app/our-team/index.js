"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll } from "framer-motion";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowLeftIcon from "../_components/ui/ArrowLeftIcon";
import ArrowRightIcon from "../_components/ui/ArrowRightIcon";
const OurTeam = () => {
  gsap.registerPlugin(ScrollTrigger);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
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

  const teamRef = useRef(null);
  const doctorRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (teamRef.current && doctorRef.current) {
      const team = teamRef.current;
      const doctor = doctorRef.current;

      gsap.set(doctor, { opacity: 0 });

      const teamTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: team,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        onComplete: () => {
          gsap.to(doctor, { opacity: 1, duration: 0.5 });
        },
      });

      teamTimeline
        .to(team, { scale: 10, ease: "none" })
        .to(team.parentNode, { backgroundColor: "black", ease: "none" }, 0);
    }
  }, []);

  const imagesRef = useRef([]);
  imagesRef.current = [];

  const addToRefs = el => {
    if (el && !imagesRef.current.includes(el)) {
      imagesRef.current.push(el);
    }
  };

  useEffect(() => {
    imagesRef.current.forEach((img, index) => {
      gsap.fromTo(img, 
        { y: 100, opacity: 0 }, 
        {
          y: 0, 
          opacity: 1, 
          scrollTrigger: {
            trigger: img,
            start: "top bottom-=100",
            toggleActions: "play none none reverse",
            ease: "power3.out",
          }
        }
      );
    });
  }, []);
  const imgRef = useRef(null);
  const svgRef = useRef(null);
  const circleRef = useRef(null);
  const whiteLayerRef = useRef(null);

  
  useEffect(() => {
    const img = imgRef.current;
    const circle = circleRef.current;
  
    if (!circle || !img) {
      console.error("Elements are not available");
      return;
    }
  
    const calculateMaxRadius = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      return Math.sqrt(screenWidth ** 2 + screenHeight ** 2) / 2;
    };

    let initialRadius = 60; 
    gsap.set(circle, { attr: { r: initialRadius } });
  
    const circleTl = gsap.timeline({
      scrollTrigger: {
        trigger: circle,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 3
      }
    });
  
    circleTl.to(circle, { attr: { r: calculateMaxRadius() }, duration: 3 });
  

    gsap.set(img, { autoAlpha: 0 }); 
    ScrollTrigger.create({
      trigger: circle,
      start: 'top center', 
      end: 'bottom bottom',
      onEnter: () => gsap.to(img, { autoAlpha: 1, duration: 3 }),
      scrub: true
    });
  
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
      gsap.killTweensOf(circle);
      gsap.killTweensOf(img);
    };
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
 <div className="relative">
      <img 
        ref={imgRef}
        src="../images/ourdoctors.png" 
        className="fixed w-1/2 " 
        alt="Animated" 
      />
  <div className="z-10 flex justify-center items-center h-screen"> 
      <div className="svg">
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 620 620">
          <defs>
            <path id="text_0_path" fill="none" d="M236.551,300.935c0-38.395,31.125-69.519,69.519-69.519s69.519,31.125,69.519,69.519"/>
          </defs>
          <use xlinkHref="#text_0_path" stroke="none" fill="none"/>
          <text fontFamily="Arial" fontSize="18" textAnchor="start" fill="white">
            <textPath xlinkHref="#text_0_path" startOffset="2%">
              <tspan>MEET OUR TEAM</tspan>
            </textPath>
          </text>
        </svg>
      </div>
    </div>
      <svg 
        ref={svgRef}
        className="fixed top-0 left-0 w-full h-screen"
      >
        <defs>
          <mask id="mask">
            <rect width="100%" height="100%" fill="white"></rect>
            <circle ref={circleRef} cx="50%" cy="50%" r="1" fill="black"></circle>
          </mask>
        </defs>
        <rect ref={whiteLayerRef} width="100%" height="100%" fill="white"></rect>
        <rect width="100%" height="100%" fill="green" mask="url(#mask)"></rect>
      </svg>
      <div className="h-[2500px]"></div>
    </div>
      {/* <section className="main-section">
        <div className="section__content">
          <svg ref={teamRef}>
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
              Meet Our Team
            </text>
          </svg>
        </div>
      </section> */}

      {/* <section className="main-section">
        <div className="section__content">
          <p ref={doctorRef}>
            <div className="text-white font-didot flex justify-center items-center">
              <h2 className="text-[100px] m-0 text-center leading-[0.9] vertical-text">
                Our
              </h2>
              <h2 className="text-[100px] m-0 text-center leading-[0.9] normal-text">
                Doctors
              </h2>
            </div>
          </p>
        </div>
      </section> */}

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
        <div style={{ backgroundImage: 'url("../images/purplegradientwithoutstar.png")', backgroundSize: '100% auto' }} className=" horizontalContainer">
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
                  <p className="text-3xl">...and first aid</p>
                </div>
                <div className="horizontalItem horizontalBig">
                  <p>
                    This office is on 🔥! The orthodontists as well as every
                    single staff member. Keary Riddick
                  </p>
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
                    5 stars Had a wonderful experience at FreySmiles. Everyone
                    is extremely professional, polite, timely. Would highly
                    recommend! -TK
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
                    Fun fact 2:Our team is made up of former FreySmiles
                    patients, something we think is important, because we have
                    all experienced treatment and can help guide you through it.
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

        <section className="bg-white grid grid-cols-3 gap-4" >

        <div ref={addToRefs} className="relative team-container" style={{ padding: 0, margin: 0, position: 'relative' }}>
        <img className="members-style" src="/../../images/team_members/kayli.png" alt="Kayli" />
        <img
          src="../images/kaylitag.png" 
          className="w-96"
          alt="Tag" 
          style={{ 
            position: 'absolute',
            left: '70%', 
            top: '55%', 
            transform: 'translate(-50%, -50%)' 
          }}
        />
      </div>

<div ref={addToRefs} className="relative team-container" style={{ padding: 0, margin: 0, position: 'relative' }}>
  <img className="members-style" src="/../../images/team_members/lexi.png" alt="Lexi" />
  <img
    className="w-96"
    src="/../../images/lexi_tag.png" 
    alt="Elizabeth Tag" 
    style={{ position: 'absolute', left: '50%', top: '70%', transform: 'translate(-50%, -50%)' }}
  />
</div>

      <div ref={addToRefs} className="relative team-container" style={{ padding: 0, margin: 0, position: 'relative' }}>
        <img className="members-style" src="/../../images/team_members/elizabeth2.png" alt="Elizabeth" />
        <img
           className="w-96"
          src="../images/elizabeth_tag.png" 
          alt="Elizabeth Tag" 
          style={{ 
            position: 'absolute',
            left: '70%', 
            top: '55%', 
            transform: 'translate(-50%, -50%)' 
          }}
        />
      </div>
      <div ref={addToRefs} className="relative team-container" style={{ padding: 0, margin: 0, position: 'relative' }}>
        <img className="w-full h-full object-cover" src="/../../images/team_members/nicolle.png" alt="Nicolle" />
        <img
          src="../images/nicolletag.png" 
          className="w-96"
          alt="Nicolle Tag"
          style={{ 
            position: 'absolute',
            left: '70%', 
            top: '55%', 
            transform: 'translate(-50%, -50%)' 
          }}
        />
      </div>
      <div ref={addToRefs} className="relative team-container" style={{ padding: 0, margin: 0, position: 'relative' }}>
  <img className="w-full h-full object-cover" src="/../../images/team_members/grace.png" alt="Grace" />
  <img
    className="w-96"
    src="/../../images/gracetag.png" 
    alt="Grace Tag" 
    style={{ position: 'absolute', left: '65%', top: '60%', transform: 'translate(-50%, -50%)' }}
  />
</div>

<div ref={addToRefs} className="relative team-container" style={{ padding: 0, margin: 0, position: 'relative' }}>
  <img className="w-full h-full object-cover" src="/../../images/team_members/adrianacapsule.png" alt="Adriana" />
  <img
    className="w-96"
    src="/../../images/adrianatag.png" 
    alt="Elizabeth Tag" 
    style={{ position: 'absolute', left: '40%', top: '70%', transform: 'translate(-50%, -50%)' }}
  />
</div>


<div ref={addToRefs} className="relative team-container" style={{ padding: 0, margin: 0, position: 'relative' }}>
  <img className="w-full h-full object-cover" src="/../../images/team_members/dana.png" alt="Dana" />
  <img
    className="w-96"
    src="/../../images/danatag.png" 
    alt="Elizabeth Tag" 
    style={{ position: 'absolute', left: '40%', top: '70%', transform: 'translate(-50%, -50%)' }}
  />
</div>

<div ref={addToRefs} className="relative team-container" style={{ padding: 0, margin: 0, position: 'relative' }}>
  <img className="w-full h-full object-cover" src="/../../images/team_members/alyssa.png" alt="Alyssa" />
  <img
    className="w-96"
    src="/../../images/alyssatag.png" 
    alt="Elizabeth Tag" 
    style={{ position: 'absolute', left: '40%', top: '70%', transform: 'translate(-50%, -50%)' }}
  />
</div>

<div ref={addToRefs} className="relative team-container" style={{ padding: 0, margin: 0, position: 'relative' }}>
  <img className="w-full h-full object-cover" src="/../../images/team_members/lizzie.png" alt="Lizzie" />
  <img
    className="w-96"
    src="/../../images/lizzietag.png" 
    alt="Lizzie Tag" 
    style={{ position: 'absolute', left: '40%', top: '70%', transform: 'translate(-50%, -50%)' }}
  />
</div>


</section>



 
      </>
    </>
  );
};

export default OurTeam;