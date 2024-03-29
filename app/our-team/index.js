"use client";
import React, { useEffect, useState, useRef } from "react";
import PurpleOrange from "../../public/images/PurpleOrange.js";
import { SplitText } from "gsap-trial/all";
import { motion, useScroll } from "framer-motion";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowLeftIcon from "../_components/ui/ArrowLeftIcon";
import ArrowRightIcon from "../_components/ui/ArrowRightIcon";

const Layer = ({ colorClass }) => {
  return (
    <div
      className={`absolute top-0 left-0 right-0 h-full w-full ${colorClass}`}
    ></div>
  );
};

const OurTeam = () => {

  
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(SplitText);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    return () => {
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      }
    };
  }, []);

  const [index, setIndex] = useState(1);
  const [switchDoctor, setSwitchDoctor] = useState(false);
  const [animationPlayed, setAnimationPlayed] = useState(false);

  const doctorBioRef = useRef(null);

const toggleSwitchDoctor = () => {
  setSwitchDoctor(prevState => !prevState);
  setAnimationPlayed(false); 
};
useEffect(() => {
  const clearAnimation = () => {
    gsap.killTweensOf(doctorBioRef.current);
  };
  const startAnimation = () => {
    const doctorBio = doctorBioRef.current;
    if (doctorBio) {
      const splitText = new SplitText(doctorBio, { type: 'lines' });
      gsap.from(splitText.lines, {
        duration: 2,
        xPercent: 20,
        autoAlpha: 0,
        ease: 'expo.out',
        stagger: 0.12,
  
      });
    }
  };

  if (doctorBioRef.current) {
    clearAnimation();
    startAnimation();
  }
  return () => clearAnimation();
}, [switchDoctor]);

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

  const imagesRef = useRef([]);
  imagesRef.current = [];

  const addToRefs = (el) => {
    if (el && !imagesRef.current.includes(el)) {
      imagesRef.current.push(el);
    }
  };

  useEffect(() => {
    imagesRef.current.forEach((img, index) => {
      gsap.fromTo(
        img,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: img,
            start: "top bottom-=100",
            toggleActions: "play none none reverse",
            ease: "power3.out",
          },
        }
      );
    });
  }, []);

  const svgRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) {
      console.error("Circle element is not available");
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
      onComplete: () => {
        gsap.to(".content", { autoAlpha: 1, duration: 1 });
      },
    });

    circleTl.to(circle, { attr: { r: calculateMaxRadius() }, duration: 3 });

    return () => {
      gsap.killTweensOf(circle);
    };
  }, []);

  useEffect(() => {
    const layer = document.querySelector(".layer");

    const tl = gsap.timeline();

    tl.to(layer, {
      clipPath: "circle(71% at 50% 50%)",
      duration: 1,
      ease: "power1.inOut",
    }).to(layer, {
      clipPath: "circle(0% at 50% 50%)",
      duration: 1,
      ease: "power1.inOut",
    });
  }, []);

  const [svgs, setSvgs] = useState([]);
  const svgWidth = 200;
  useEffect(() => {
    setSvgs((prevSvgs) => {
      const newSvg = {
        id: `svg-${Date.now()}`,
        right: svgWidth * 4,
      };

      const overlapAdjustment = 1;

      const updatedSvgs = prevSvgs
        .map((svg) => ({
          ...svg,
          right: svg.right - svgWidth + overlapAdjustment,
        }))
        .filter((svg) => svg.right >= -svgWidth)
        .concat(newSvg);

      return updatedSvgs;
    });
    const intervalId = setInterval(() => {
      setSvgs((prevSvgs) => {
        const newSvg = {
          id: `svg-${Date.now()}`,
          right: svgWidth * 4,
        };

        const updatedSvgs = prevSvgs
          .map((svg) => ({ ...svg, right: svg.right - svgWidth }))
          .filter((svg) => svg.right >= -svgWidth)
          .concat(newSvg);

        return updatedSvgs;
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  const items = [
    {
      title: '5',
      num: 'Adriana',
      imgSrc: '/../../images/team_members/Adriana-Photoroom.jpg'
    },
    {
      title: '7',
      num: 'Alyssa',
      imgSrc: '/../../images/team_members/Alyssascan.png'
    },
    {
      title: '6',
      num: 'Dana',
      imgSrc: '/../../images/team_members/Dana-Photoroom.png'
    },
   
   
    {
      title: '2',
      num: 'Elizabeth',
      imgSrc: '/../../images/team_members/Elizabethaao.png'
    },
 
       {
      title: '4',
      num: 'Grace',
      imgSrc: '/../../images/team_members/Grace-Photoroom.jpg'
    },
    {
      title: '1',
      num: 'Lexi',
      imgSrc: '/../../images/team_members/Lexigreen.png'
    },
    {
      title: '8',
      num: 'Lizzie',
      imgSrc: '/../../images/team_members/Lizzie-Photoroom.png'
    },
    {
      title: '3',
      num: 'Nicolle',
      imgSrc: '/../../images/team_members/Nicollewaving.png'
    },
    {
      title: '9',
      num: 'x',
      imgSrc: '/../../images/team_members/Kayli-Photoroom.png'
    }
  ];
  const [progress, setProgress] = useState(0);
  const carouselRef = useRef();
  const cursorRef = useRef();

  const speedWheel = 0.02;
  const speedDrag = -0.1;
  let startX = 0;
  let isDown = false;

  const getZindex = (length, active) => {
    return Array.from({ length }, (_, i) => (active === i ? length : length - Math.abs(active - i)));
  };

  const displayItems = (index, active, length) => {
    const zIndex = getZindex(length, active)[index];
    const activeFactor = (index - active) / length;
    return {
      '--zIndex': zIndex,
      '--active': activeFactor,
    };
  };

  const animate = () => {
    const boundedProgress = Math.max(0, Math.min(progress, 100));
    const active = Math.floor((boundedProgress / 100) * (carouselRef.current.children.length - 1));
    Array.from(carouselRef.current.children).forEach((item, index) => {
      const styles = displayItems(index, active, carouselRef.current.children.length);
      Object.keys(styles).forEach(key => item.style.setProperty(key, styles[key]));
    });
  };

  useEffect(animate, [progress]);


  useEffect(() => {
    const handleWheel = (e) => {
      const wheelProgress = e.deltaY * speedWheel;
      setProgress(progress => progress + wheelProgress);
    };

    const handleMouseMove = (e) => {
  
      if (e.type === 'mousemove' && cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }

      if (!isDown) return;
      const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const mouseProgress = (x - startX) * speedDrag;
      setProgress(progress => progress + mouseProgress);
      startX = x;
    };

    const handleMouseDown = (e) => {
      isDown = true;
      startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    };

    const handleMouseUp = () => {
      isDown = false;
    };

    document.addEventListener('wheel', handleWheel);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchstart', handleMouseDown);
    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);

    return () => {
  
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchstart', handleMouseDown);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, []);


  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [className, setClassName] = useState('');

  useEffect(() => {
    const updatePosition = (e) => {
      if (carouselRef.current) {
        const rect = carouselRef.current.getBoundingClientRect();
        const isInCarousel = (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        );
        if (isInCarousel) {
          setPosition({ x: e.clientX, y: e.clientY });
          setClassName(''); 
        } else {
          setClassName('hidden'); 
        }
      }
    };

    window.addEventListener('mousemove', updatePosition);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
    };
  }, []);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => {
      setIsDragging(true);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const cursorStyle = {
    position: 'fixed',
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    zIndex: 99,
    willChange: 'transform',
  };

  const cursorCircleStyle = {
    width: isDragging ? '64px' : '128px', 
    height: isDragging ? '64px' : '128px', 
    marginTop: '-50%',
    marginLeft: '-50%',
    borderRadius: '50%',
    border: 'solid 1px #0058EF',
    backgroundColor: '#0058EF',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    transition: 'width 0.3s cubic-bezier(0.25, 1, 0.5, 1), height 0.3s cubic-bezier(0.25, 1, 0.5, 1)', // Add transition for size change
  };




  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 });
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  const greenCursorStyle = {
    position: 'fixed',
    left: `${cursorPosition.x}px`,
    top: `${cursorPosition.y}px`,
    width: isFocused ? '100px' : '40px',
    height: isFocused ? '100px' : '40px',
    borderRadius: '50%',
    backgroundColor: isFocused ? 'rgb(190,255,3)' : '#FFFFFF',
    pointerEvents: 'none',
    opacity: .7,
    transform: 'translate(-50%, -50%)',
    transition: 'width 0.5s, height 0.5s, background-color 0.25s',
    zIndex: 9999
  }; 
  return (
    <>
    <div className="bg-[#E2E2E2]">
      <div
        className="layer circle-animation absolute top-0 left-0 w-full h-full gradient-green z-10"
        ref={circleRef}
      ></div>
      <div className="content relative z-0"></div>

      <div className="relative">
  
      </div>
      <section className=" py-24 sm:py-32">
      <div >
     
    </div>
        <div className="w-full px-6 mx-auto mb-12 lg:px-8 max-w-7xl">

          <h1 className="font-poppins text-[90px] tracking-tight">
           Meet Our
            <div style={{ fontStyle: "italic", fontSize: "inherit" }}>
              Doctors
            </div>
          </h1>

          {/* <h1 className="font-poppins tracking-tight">
  <span style={{ fontSize: "3em" }}>
    <span style={{ fontStyle: 'italic', fontSize: 'inherit' }}>M</span>eet
  </span>
  <span style={{ fontSize: '2em' }}>Our</span>
  <div style={{ fontSize: '3em' }}>
    <span style={{ fontStyle: 'italic', fontSize: 'inherit' }}>D</span>octors
  </div>
</h1> */}
        </div>
        <div className="grid grid-cols-12 gap-8 px-6 mx-auto max-w-7xl lg:px-8">
          <div className="col-span-12 col-start-1 grid-rows-2 space-y-8 lg:col-span-6">
            {/* slider controls */}
            <div
              id="controls"
              className="flex items-center justify-start row-span-1 row-start-1 space-x-4"
            >
              <button
                className="z-0 p-3 transition-all duration-200 ease-linear border rounded-full hover:text-white text-primary-50 border-primary-50 hover:bg-primary-50"
                onClick={toggleSwitchDoctor}
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <span className="font-poppins">0{!switchDoctor ? index : index + 1} - 02</span>
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
                <p ref={doctorBioRef} className="font-helvetica-now-thin heading">
                  Dr. Daniel Frey pursued his pre-dental requisites at the University of
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
                <p ref={doctorBioRef} className="font-helvetica-now-thin  heading">
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
          <div className="col-span-5 lg:col-span-3 lg:col-start-7">
            <figure className="relative w-full aspect-[3/4] overflow-hidden">
              <img
                style={{
                  position: "absolute",
                  width: "100%",
                  transition: "transform 1s",
                  transform: switchDoctor
                    ? "translateX(100%)"
                    : "translateX(0)",
                }}
                src="../../images/team_members/GreggFrey.png"
                alt="Dr. Gregg Frey"
              />
              <img
                style={{
                  position: "absolute",
                  width: "100%",
                  transition: "transform 1s",
                  transform: switchDoctor
                    ? "translateX(0)"
                    : "translateX(-100%)",
                }}
                src="../../images/team_members/DanFrey.png"
                alt="Dr. Daniel Frey"
              />
            </figure>
            <figcaption >
  <h5 className="font-helvetica-now-thin">
    {!switchDoctor ? "Dr. Gregg Frey" : "Dr. Dan Frey"}
  </h5>
  <p className="font-helvetica-now-thin">
    {!switchDoctor ? "DDS" : "DMD, MSD"}
  </p>
</figcaption>
          </div>
          <div className="col-span-5 lg:col-span-2 lg:col-start-11">
            <figure
              className="relative grayscale w-full aspect-[3/4] overflow-hidden cursor-pointer"
              onClick={toggleSwitchDoctor}
            >
              <img
                style={{
                  position: "absolute",
                  width: "100%",
                  transition: "transform 1s",
                  transform: switchDoctor
                    ? "translateX(0)"
                    : "translateX(-100%)",
                }}
                src="../../images/team_members/GreggFrey.png"
                alt="Dr. Daniel Frey"
              />
              <img
                style={{
                  position: "absolute",
                  width: "100%",
                  transition: "transform 1s",
                  transform: switchDoctor
                    ? "translateX(100%)"
                    : "translateX(0)",
                }}
                src="../../images/team_members/DanFrey.png"
                alt="Dr. Gregg Frey"
              />
            </figure>
          </div>
        </div>
      </section>
      <>


      <div style={greenCursorStyle}>
        <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
         Click 
        </span>
      </div>
        <div
    onMouseEnter={() => setIsFocused(true)}
    onMouseLeave={() => setIsFocused(false)}
          className=" horizontalContainer"
        >

          <div className="horizontalWrapper">
            <div className="horizontalScroller">
              <div className="horizontalRow">
              <div className="horizontalItem horizontalFilled">
  <a 
    href="https://www.trapezio.com/training-resources/course-outlines/soa-prep-course-outline/" 
    className="horizontalItemLink"
  >
    <p className="sm:text-left md:text-center">
      Our members have received the designation of Specialized Orthodontic Assistant. This is a voluntary certification program started by the American Association of Orthodontists to recognize those in the profession for their knowledge and experience.
    </p>
   
  </a>
</div>

                <div className="horizontalItem horizontalFilled">
                  <p >  Fun fact-our team is made up of former FreySmiles
                    patients, something we think is important, because we have
                    all experienced treatment and can help guide you through it.</p>
                  <img className="w-90 h-90 absolute bottom-0" src="../images/threedots.svg" alt="Green Squiggle" />
                </div>
                <a href="https://g.co/kgs/Sds93Ha" className="horizontalItem horizontalBig">
  <p>
    This office is on 🔥! The orthodontists as well as every
    single staff member.
  </p>
  <span className="link-text" data-text="Check it out">
    Keary Riddick
  </span>
</a>

              </div>
              <div className="horizontalRow">
                <div className="horizontalItem horizontalBig">
                  <p>Trained in CPR and first aid</p>
                </div>
                <div className="horizontalItem horizontalFilled ">
  <a href="https://g.co/kgs/YkknjNg" className="horizontalItemLink">

    <p className> 
      Had a wonderful experience at FreySmiles. Everyone is extremely professional, polite, timely. Would highly recommend! -TK
    </p><span>  <img className="w-90 h-auto -mt-80  " src="../images/fivestars.svg" alt="Green Squiggle" /></span>
  </a>
</div>

                <div className="horizontalItem horizontalFilled">
                  <p>
                  Our team members are X-ray certified.
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
        <div className="svg-container">
            {svgs.map((svg) => (
              <div
                key={svg.id}
                className="svg-wrapper"
                style={{
                  position: "absolute",
                  right: `${svg.right}px`,
                  transition: "right 2s ease-out",
                }}
              >
                <svg
                  width={svgWidth}
                  height={svgWidth}
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100,0 A100,100 0 0,1 100,200 A100,100 0 0,1 100,0 Z"
                    fill="#F3F2ED"
                  />
                </svg>
              </div>
            ))}
          </div>
        <div ref={carouselRef} className="relative z-10 h-screen overflow-hidden pointer-events-none">
           <div id="cursor" style={cursorStyle} className={className}>
           <div className="cursor__circle" style={cursorCircleStyle}>
            Drag
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
</svg>

        </div>
    </div>
      {items.map(item => (
        <div key={item.num} className="carousel-item">
          <div className="carousel-box">
            <div className="titleCard">{item.title}</div>
            <div className="numCard">{item.num}</div>
            <img src={item.imgSrc} alt={item.title} />
          </div>
        </div>
      ))}
    </div>

      </>
      </div>
    </>
  );
};

export default OurTeam;
