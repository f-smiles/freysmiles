"use client";
import Layout from "./layout.js";
import { SplitText } from "gsap-trial/all";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap, Power3 } from "gsap-trial";


const YourCare = () => {
  const [isBlotterLoaded, setIsBlotterLoaded] = useState(false);

  useEffect(() => {
    const loadScript = (src, callback) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = callback;
      document.body.appendChild(script);
    };

    if (!window.Blotter) {
      loadScript('/blotter.min.js', () => {
        console.log('Blotter loaded');

        loadScript('/liquidDistortMaterial.js', () => {
          console.log('LiquidDistortMaterial loaded');
          setIsBlotterLoaded(true);
        });
      });
    } else {
      setIsBlotterLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isBlotterLoaded) {
      let materials = []; 
  
      const lines = ["DISCOVER", "WHAT MAKES", "US UNIQUE"];
      let container = document.getElementById('blotter-target');
  
      if (container) {
        lines.forEach((line, index) => {

          let lineDiv = document.createElement('div');
          lineDiv.id = `blotter-line-${index + 1}`;
          container.appendChild(lineDiv);
  
          const text = new window.Blotter.Text(line, {
            // family: "",
            size: 100, 
          });
  
          let material = new window.Blotter.LiquidDistortMaterial();
          material.uniforms.uSpeed.value = 0.1;
          material.uniforms.uVolatility.value = 0.1;
          material.uniforms.uSeed.value = 0.1;
  
          let blotter = new window.Blotter(material, { texts: text });
          let scope = blotter.forText(text);
          scope.appendTo(lineDiv);
  
          materials.push(material); 
        });
  
        const handleMouseMove = (e) => {
          const formula = ((e.pageX * e.pageY) / 200000) / 1.5;
          materials.forEach(material => {
            material.uniforms.uVolatility.value = formula;
            material.uniforms.uSeed.value = formula;
          });
        };
  
        document.body.addEventListener('mousemove', handleMouseMove);
  
        return () => {
          document.body.removeEventListener('mousemove', handleMouseMove);
        };
      }
    }
  }, [isBlotterLoaded]);
  
  
  

  const [isOpen, setIsOpen] = useState(true);
  const shutterRef = useRef(null);

  const toggleShutter = () => {
    setIsOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const container = shutterRef.current;
    if (!container) return;

    container.classList.add("c-shutter--opening");
    container.classList.remove("c-shutter--closing", "c-shutter--closed");

    const initialTimer = setTimeout(() => {
      setIsOpen(false);
    });

    return () => clearTimeout(initialTimer);
  }, []);



  const scrollContainerRef = useRef(null);
  useEffect(() => {
    gsap.to(".bglinear", {
      scrollTrigger: {
        trigger: "#p2",
        scrub: true,
        start: "10% bottom",
        end: "80% 80%",
      },
      backgroundImage: "linear-gradient(270deg, #000 50%, #fff 0%)",
      duration: 3,
    });

    gsap.to(".bglinear", {
      scrollTrigger: {
        trigger: "#p2",
        scrub: true,
        start: "10% 80%",
        end: "80% 80%",
      },
      letterSpacing: "10px",
      duration: 3,
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const [isPinned, setIsPinned] = useState(false);
  const aboutTitleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (aboutTitleRef.current) {
        const offsetTop = aboutTitleRef.current.offsetTop;
        const isPinned = window.scrollY >= offsetTop;
        setIsPinned(isPinned);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const getTransitionStyle = () => {
    return {
      backgroundImage: `url(${images[currentImageIndex]})`,
      transition: "background-image 1s ease-in-out",
    };
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [showNewImage, setShowNewImage] = useState(false);
  const triggerRef = useRef(null);

  const [collectiveOpacity, setCollectiveOpacity] = useState(1);
  const [picsumImageOpacity, setPicsumImageOpacity] = useState(0);
  const [gifOpacity, setGifOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollFadeStartForPicsum = 100;
      const scrollFadeEndForPicsum = 500;
      const scrollFadeStartForGif = 500;
      const scrollFadeEndForGif = 900;

      const scrollPosition = window.scrollY;
      const fadeAmountForPicsum = Math.min(
        Math.max(
          (scrollPosition - scrollFadeStartForPicsum) /
            (scrollFadeEndForPicsum - scrollFadeStartForPicsum),
          0
        ),
        1
      );
      const fadeAmountForGif = Math.min(
        Math.max(
          (scrollPosition - scrollFadeStartForGif) /
            (scrollFadeEndForGif - scrollFadeStartForGif),
          0
        ),
        1
      );

      setCollectiveOpacity(1 - fadeAmountForPicsum);
      setPicsumImageOpacity(fadeAmountForPicsum);
      setGifOpacity(fadeAmountForGif);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [scrollPosition, setScrollPosition] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const aboutSectionRef = useRef(null);
  const lasth3Ref = useRef(null);
  const progressPath = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (e) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };



  // useEffect(() => {
  //   const pathLength = progressPath.current.getTotalLength();
  //   progressPath.current.style.strokeDasharray = `${pathLength} ${pathLength}`;
  //   progressPath.current.style.strokeDashoffset = pathLength;

  //   const updateProgress = () => {
  //     if (!aboutSectionRef.current || !lasth3Ref.current) return;

  //     const sectionTop = aboutSectionRef.current.offsetTop;
  //     const h3Bottom =
  //       lasth3Ref.current.offsetTop + lasth3Ref.current.offsetHeight;
  //     const scrollTop = window.scrollY;
  //     const viewportHeight = window.innerHeight;

  //     let progress;
  //     if (scrollTop + viewportHeight > sectionTop && scrollTop < h3Bottom) {
  //       progress = Math.min(
  //         (scrollTop - sectionTop) / (h3Bottom - sectionTop - viewportHeight),
  //         1
  //       );
  //     } else {
  //       progress = 0;
  //     }

  //     progress = Math.max(0, progress);
  //     progressPath.current.style.strokeDashoffset =
  //       pathLength - progress * pathLength;
  //   };

  //   window.addEventListener("scroll", updateProgress);
  //   return () => window.removeEventListener("scroll", updateProgress);
  // }, []);

  const parallaxStyle = {
    top: scrollPosition / 2.8,
    opacity: 1 - scrollPosition / 600,
  };

  const stackItems = [
    {
      text: "ASK ABOUT OUR PAYMENT PLANS",
      rotation: "-rotate-6",
      zIndex: "z-10",
    },
    {
      text: "FSA/HSA DOLLARS ACCEPTED",
      rotation: "rotate-1",
      zIndex: "z-20",
    },
    {
      text: "PLEASE BRING INSURANCE CARD IF YOU HAVE ORTHO COVERAGE",
      rotation: "-rotate-3",
      zIndex: "z-30",
    },
  ];

  const textContainerRef = useRef(null);
  const textRef1 = useRef(null);
  const textRef2 = useRef(null);
  const textRef3 = useRef(null);

  useEffect(() => {
    const onEntry = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.registerPlugin(SplitText);

          [textRef1, textRef2, textRef3].forEach(ref => {
            const split = new SplitText(ref.current, { type: 'lines' });
            gsap.from(split.lines, {
              duration: 1.5,
              y: '100%',
              stagger: 0.15,
              ease: 'power4.out'
            });
          });

          observer.disconnect();
        }
      });
    };

    const observer = new IntersectionObserver(onEntry, {
      threshold: 1 
    });

    if (textContainerRef.current) {
      observer.observe(textContainerRef.current);
    }

    return () => {
      observer.disconnect(); 
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.album',
        start: 'top top',
        end: '+=4000',
        scrub: true,
        pin: true,
      }
    });

    tl.to('.p1', { x: '-=700', duration: 1 }, 0)
      .to('.p2', { x: '-=1400', duration: 1 }, 0.5) 
      .to('.p3', { x: '-=1300', duration: 1 }, 1)
      .to('.p4', { x: '-=1200', duration: 1 }, 1.5);
  }, []);

useEffect(() => {
  gsap.timeline({
    scrollTrigger: {
      trigger: '.bottom',
      scrub: true,
      pin: true,
      start: 'top top',
      end: '+=3000',
    },
  })
  .to('.stripe', { stagger: 0.3, height: '100vh' })
  .to('.stripe', { stagger: 0.3, height: 0 })
  .to('.thats-all', { opacity: 1, scale: 1 });
}, []);

useEffect(() => {
  gsap.registerPlugin(ScrollTrigger);

  gsap.to('.img', {
    y: -700, 
    stagger: 0.3, 
    ease: 'none', 
    scrollTrigger: {
      trigger: '.img',
      start: 'top bottom',
      end: 'bottom center',
      scrub: true
    },
  });

}, []);



  return (
    <>
      <Layout>
        <div
          className="shutter-container "
          style={{
            "--color-foreground": "#dcdce8",
            "--delay": 10,
          }}
        >
          <ul ref={shutterRef} className="z-10 c-shutter">
            {[...Array(10)].map((_, i) => (
              <li key={i} className="c-shutter__slat"></li>
            ))}
          </ul>
          <div className="relative h-screen">
      
          <div className=" h-screen" id="blotter-target"></div>
        
          </div>
          <section className="gallery" style={{position:'relative', height: '200vh' }}>


          {/* <div className="flex justify-center items-center text-center h-screen">
          <div className="flex flex-col justify-center items-center text-center h-screen">
  <div className=" font-bold text-8xl">
    <div className="mb-4">DISCOVER WHAT</div>
    <div className="flex justify-center items-baseline relative">
      <img style={{ bottom: '-10%', left: '20%', transform: 'translateX(-50%)' }} className="w-32 h-32 absolute bottom-0" src="../images/whitedots.svg" alt="Green Squiggle" />
      <span>MAKES</span>
      <img className="w-[6em] absolute bottom-0" src="../images/pinksquiggle.svg" alt="Green Squiggle" style={{ bottom: '-320%', left: '80%', transform: 'translateX(-50%)' }} />
    </div>
    <div className="mt-4">US UNIQUE</div>
  </div>
</div>

</div> */}
  <div>

  <section className="grid grid-cols-3">
  {[
    "../images/nowbooking.png",
    "../images/freysmiles_insta.gif",
    "../images/firstappointment.svg",
    "../images/nocost.png",
    "../images/scan.mp4",
    "../images/checkeredpatient.svg"
  ].map((src, i) => {
    const isVideo = src.endsWith('.mp4');

    return (
      <div key={i} className="img relative w-full overflow-hidden">
        {isVideo ? (
          <video autoPlay loop muted className="object-cover w-full h-full">
            <source src={src} type="video/mp4" />
          </video>
        ) : (
          <img src={src} alt={`Image ${i + 1}`} className="object-cover w-full h-full" />
        )}
        <div className="absolute top-0 left-0 w-full h-screen z-10"></div>
      </div>
    );
  })}
</section>


    </div>

</section>

       
          {/* <footer className="bottom h-screen bg-[#F5F4F5] flex justify-start items-end flex-wrap m-0 p-0">

  <div className="stripe st1 flex-grow h-0 bg-[#1B1B1E]"></div>
  <div className="stripe st2 flex-grow h-0 bg-[#FAA916]"></div>
  <div className="stripe st3 flex-grow h-0 bg-[#FBFFFE]"></div>
  <div className="stripe st4 flex-grow h-0 bg-[#6D676E]"></div>
  
</footer> */}

          {/* <section
            ref={aboutSectionRef}
            id="About"
            className="large-section min-h-screen flex"
            onMouseMove={handleMouseMove}
            style={{
              position: "sticky",
              top: 0,
              backgroundAttachment: "fixed",
              backgroundSize: "cover",
            }}
          >
            {" "}
            <div className="parallax-fade-top" style={parallaxStyle}></div>
            <div
              id="cursor"
              style={{ left: cursorPosition.x, top: cursorPosition.y }}
            />
            <div
              id="cursor2"
              style={{ left: cursorPosition.x, top: cursorPosition.y }}
            />
            <div
              id="cursor3"
              style={{ left: cursorPosition.x, top: cursorPosition.y }}
            />
            <div className="progress-wrap fixed bottom-10 left-10">
              <svg
                className="progress-circle"
                width="100%"
                height="100%"
                viewBox="-1 -1 102 102"
              >
                <path
                  ref={progressPath}
                  d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
                />
              </svg>
            </div>
            <div className="about-title w-1/2">
              <section className="flex  h-full justify-center items-center">
                <div
                  className=" md:w-1/2 flex justify-center items-center"
                  style={{ opacity: collectiveOpacity }}
                >
                  <div
                    className="relative mx-2 "
                    style={{ width: "300px", height: "240px" }}
                  >
                    <img
                      className="rounded-full opacity-90 w-full h-full object-cover"
                      src="../../images/carepatient1.png"
                      alt="patient"
                      style={{ objectPosition: "40% 50%" }}
                    />
                  </div>
                  <div
                    className="relative mx-2 "
                    style={{ width: "300px", height: "300px" }}
                  >
                    <img
                      className="rounded-full opacity-90 w-full h-full object-cover"
                      src="../../images/carepatient2.png"
                      alt="patient"
                      style={{ objectPosition: "10% 50%" }}
                    />
                  </div>

                  <div
                    className="relative mx-2 "
                    style={{ width: "300px", height: "340px" }}
                  >
                    <img
                      className="rounded-full opacity-90 w-full h-full object-cover"
                      src="../../images/carepatient3.png"
                      alt="patient"
                    />
                  </div>
                  <div
                    className="relative mx-2 "
                    style={{ width: "330px", height: "400px" }}
                  >
                    <img
                      className="rounded-full opacity-90 w-full h-full object-cover"
                      src="../../images/carepatient4.png"
                      alt="patient"
                      style={{ objectPosition: "40% 50%" }}
                    />
                  </div>
                  <div
                    className="relative mx-2 "
                    style={{ width: "300px", height: "480px" }}
                  >
                    <img
                      className="rounded-full opacity-90 w-full h-full object-cover"
                      src="../../images/freysmilepatient1.jpg"
                      alt="patient"
                    />
                  </div>
                </div>
                <div
                  className="absolute inset-0 flex justify-center items-center"
                  style={{ opacity: picsumImageOpacity }}
                >
                  <img
                    src="../images/mobile.png"
                    alt="scan_gif"
                    className="opacity-90 object-contain"
                  />
                </div>
                <div
                  className="absolute inset-0 flex justify-center items-center"
                  style={{ opacity: gifOpacity }}
                >
                  <img
                    src="../images/freysmiles_insta.gif"
                    alt="gif_description"
                    className="object-contain"
                  />
                </div>
              </section>
            </div>
            <div className="about-pages w-1/2 bg-[#121212] ">
              <div>
                <section className="flex w-1/2 h-full justify-center items-center ">
                  <a
                    href="#"
                    className="font-helvetica-now-thin text-white text-opacity-60 font-light text-4xl leading-7 transition-all ease-in-out flex items-center"
                  >
              Start the process
                    <span
                      className="ml-6 inline-flex items-center justify-center w-12 h-12 rounded-full "
                      style={{
                        border: ".5px solid white",
                        transform: "scale(1)",
                        transition: "all .3s ease-in",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                        />
                      </svg>
                    </span>
                  </a>
                </section>
              </div>

              <div className="flex flex-col items-center mx-4" ref={triggerRef}>
                <h3
                  className="border border-[#d2fec9]   text-center text-xl text-[#d2fec9] mb-2 rounded-full px-4 py-2"
                  style={{
                    width: "80px",
                    height: "80px",
                    lineHeight: "60px",
                  }}
                >
                  1
                </h3>
                <p className="font-helvetica-now-thin text-white text-2xl px-20 text-center justify-center">
                  Book a personalized consultation with one of our doctors,
                  either virtually or in person.
                </p>
              </div>
              <div className="flex flex-col items-center mx-4">
                <h3
                  className="border border-gray-300   text-center text-xl text-lime-900 mb-2 rounded-full px-4 py-2"
                  style={{
                    width: "80px",
                    height: "80px",
                    lineHeight: "60px",
                  }}
                >
                  2
                </h3>
                <p className="font-helvetica-now-thin text-white text-2xl px-20 text-center justify-center">
                  Your first appointment will consist of a thorough orthodontic
                  examination including photos and a digital radiograph of your
                  teeth.
                </p>
              </div>

              <div
                ref={lasth3Ref}
                className="flex flex-col items-center mx-auto"
              >
                <h3
                  className="border border-gray-300   text-center text-xl text-lime-900 mb-2 rounded-full px-4 py-2"
                  style={{
                    width: "80px",
                    height: "80px",
                    lineHeight: "60px",
                  }}
                >
                  3
                </h3>
                <p className="font-helvetica-now-thin text-white text-2xl px-20 text-center justify-center">
                  Discover the ideal solution for your needs, free from any
                  financial obligations or commitments.
                </p>
              </div>
            </div>
          </section> */}

          <div
            // className="bg-[#ebded4] border rounded-[30px] section-style flex items-center z-10 relative"
            // style={{
            //   position: "sticky",
            //   top: 0,
            //   backgroundAttachment: "fixed",
            //   backgroundSize: "cover",
            // }}
          >
             <section className="album h-screen overflow-hidden relative">
      <picture className="absolute w-[700px] h-[500px] transform translate-x-[calc(50vw-350px)] translate-y-[calc(50vh-250px)]">
        <img src="../images/pinkblur1.svg" alt="greendot" className="picture p1 object-cover object-cover w-full h-fulll" />
        
      </picture>
      <picture className="absolute w-[700px] h-[500px] transform translate-x-[100vw] translate-y-[calc(50vh-250px)]">
      <img src="../images/pinkblur2.svg" alt="greendot" className="picture p2 object-cover object-cover w-full h-fulll" />
      </picture>
      <picture className="absolute w-[700px] h-[500px] transform translate-x-[100vw] translate-y-[calc(50vh-250px)]">
      <img src="../images/pinkblur3.svg" alt="greendot" className="picture p3 object-cover object-cover w-full h-fulll" />
      </picture>
      <picture className="absolute w-[700px] h-[500px] transform translate-x-[100vw] translate-y-[calc(50vh-250px)]">
      <img src="../images/pinkblur4.svg" alt="greendot" className="picture p4 object-cover object-cover w-full h-fulll" />
      </picture>
    </section>
          </div>
          <div
            style={{
              position: "sticky",
              top: 0,
      
              backgroundAttachment: "fixed",
              backgroundSize: "cover",
            }}
            className=" border rounded-[30px] section-style flex items-center z-10 relative"
          >
            <>
              <div className="">
               
                <div className="flex">
                <div className="mt-10 font-helvetica-now-thin flex-1  container">
                <div className="relative p-[100px]">
                  
                <div className="text-container" ref={textContainerRef}>
      <div className="line-container" ref={textRef1}>
        <h1 className="hidden-text text-2xl">Taking the first step towards treatment can sometimes feel overwhelming , especially when it comes to discussing personalized </h1>
      </div>
      <div className="line-container" ref={textRef2}>
        <h1 className="text-2xl hidden-text"> plans and navigating payment options. That's why we kindly request that all decision-makers be present during the initial visit. </h1>
      </div>
      <div className="line-container" ref={textRef3}>
        <h1 className="hidden-text text-2xl">Our goal is for every patient to walk out of our office fully informed with answers to all their questions in their treatment path.
</h1>
      </div>
    </div>
        </div>

</div>



                <div className="mt-20 flex-1 flex items-center justify-center">
    <svg width="100" height="100" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: "middle" }}>
        <g clip-path="url(#clip0_105_560)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M200 100.671L100 0L0 100.671H98.6668L0 200H200L101.333 100.671H200Z" fill="url(#paint0_linear_105_560)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_105_560" x1="20.5" y1="16" x2="100" y2="200" gradientUnits="userSpaceOnUse">
                <stop stop-color="#ACAAFF"/>
                <stop offset="1" stop-color="#C0E8FF"/>
            </linearGradient>
            <clipPath id="clip0_105_560">
                <rect width="200" height="200" fill="white"/>
            </clipPath>
        </defs>
    </svg>
    <p className="font-altero text-center text-8xl">Pricing</p>
</div>

                </div>
                <div className="flex flex-col items-center justify-center space-y-[-2rem] mt-[-4rem] mb-[-4rem] py-8 h-screen">
                  {stackItems.map((item, index) => (
                    <div
                      key={index}
                      className={`bg-[#e5d6F6] text-black text-center px-6 py-4 shadow-xl border-2 border-black rounded-3xl transform ${item.rotation} ${item.zIndex}`}
                      style={{ width: "1000px", height: "150px" }}
                    >
                      <p className="text-5xl font-semibold">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default YourCare;


        {/* <div
              className="absolute top-[calc(50%-60.5px)] left-0 w-full h-[1px] bg-black"
              style={{ zIndex: 5 }}
            ></div>

            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="z-20 flex flex-col items-center">
                <svg
                  width="160"
                  height="160"
                  viewBox="0 0 128 128"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    stroke="black"
                    strokeWidth=".5"
                    fill="#ebded4"
                  />
                  <image
                    href="../images/wavydesign.png"
                    x="0"
                    y="0"
                    height="128px"
                    width="128px"
                  />
                </svg>
                <p className="mt-10 flex text-center px-10">
                  The American Association of Orthodontists (AAO) recommends an
                  orthodontic evaluation by age 7 to assess and coordinate
                  optimal timing of treatment
                </p>
              </div>
              <div className="z-20 flex flex-col items-center">
                <svg
                  width="160"
                  height="160"
                  viewBox="0 0 128 128"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    stroke="black"
                    strokeWidth=".5"
                    fill="#ebded4"
                  />

                  <image
                    href="../images/fscartoon.png"
                    x="0"
                    y="0"
                    height="128px"
                    width="128px"
                  />
                </svg>
                <p className="mt-10 text-center px-10">
                  If immediate treatment isn't necessary, you'll be enrolled in
                  our FreySmiles Club, where you'll receive biannual and annual
                  check-ins to monitor your progress.
                </p>
              </div>

              <div className="z-20 flex flex-col items-center">
                <svg
                  width="160"
                  height="160"
                  viewBox="0 0 128 128"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    stroke="black"
                    strokeWidth=".5"
                    fill="#ebded4"
                  />
                  <image
                    href="../images/connect.png"
                    x="10"
                    y="10"
                    height="100px"
                    width="100px"
                  />
                </svg>
                <p className="mt-10 text-center px-10">
                  Early intervention can simplify or eliminate the need for
                  extensive treatment later on. Our collaboration with your
                  family dentist ensures comprehensive care throughout your
                  treatment.
                </p>
              </div>
            </div> */}
// const YourCare = () => {
//   const [activeAccordion, setActiveAccordion] = useState([
//     false,
//     false,
//     false,
//     false,
//   ]);

//   const toggleAccordion = (index) => {
//     setActiveAccordion((prevState) =>
//       prevState.map((isActive, i) => (i === index ? !isActive : false))
//     );
//   };

//   return (
//     <div className="my-60 flex justify-center items-start">
//       <div className="max-w-screen-xl flex mx-4">
//         <div className="flex-1">
//           <div className="flex flex-col justify-start">
//             <div
//               className={` py-3 px-4 flex justify-between items-center cursor-pointer select-none ${
//                 activeAccordion[0] ? "bg-white" : ""
//               }`}
//               onClick={() => toggleAccordion(0)}
//             >
//               <h2 className="flex text-lg font-medium ml-16 text-indigo-700 ">Your First Visit</h2>
//               <svg
//                 className={`h-6 w-6 transform ${
//                   activeAccordion[0] ? "rotate-180" : ""
//                 }`}
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d={activeAccordion[0] ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
//                 />
//               </svg>
//             </div>
//             <div
//               className={`overflow-hidden transition-all duration-1000 ${
//                 activeAccordion[0] ? "max-h-96" : "max-h-0"
//               }`}
//             >
//               <p>
// During your initial visit you’ll get to know some of the friendly
// faces of the FreySmiles orthodontic team and see what makes us
// unique. We are always excited about meeting new patients. Your first
// appointment will consist of a thorough orthodontic examination
// including photos, a digital radiograph of your teeth, and a
// discussion of your options. This important 60-90 minute visit will
// give us a picture of your orthodontic needs.
//               </p>
//             </div>
//                      <div className={`border-t border-indigo-300 border-t-1 border-indigo-300 py-3 px-4 flex justify-between items-center cursor-pointer select-none ${
//             activeAccordion[1]  ? "bg-white" : ""
//           }`}
//           onClick={() => toggleAccordion(1)}
//         >
//           <h2 className="text-lg font-medium ml-16">Accordion Item #2</h2>
//           <svg
//             className={`h-6 w-6 transform ${
//               activeAccordion[1]  ? "rotate-180" : ""
//             }`}
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d={activeAccordion[1]  ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
//             />
//           </svg>
//         </div>
//         <div
//           className={`overflow-hidden transition-all duration-1000 ${
//             activeAccordion[1] ? "max-h-96" : "max-h-0"
//           }`}
//         >
//           <p>
//             Many times we are able to save you a return trip back to office and
//             can start treatment at your first visit. We know you’ll be excited
//             to see your new FreySmile!
//           </p>
//         </div>
//         <div
//           className={`border-t border-indigo-300 py-3 px-4 flex justify-between items-center cursor-pointer select-none ${
//             activeAccordion[2]  ? "bg-white" : ""
//           }`}
//           onClick={() => toggleAccordion(2)}
//         >
//           <h2 className="text-lg font-medium ml-16 text-indigo-700">Growth And Guidance</h2>
//           <svg
//             className={`h-6 w-6 transform ${
//               activeAccordion[2]  ? "rotate-180" : ""
//             }`}
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d={activeAccordion[2]  ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
//             />
//           </svg>
//         </div>
//         <div
//           className={`overflow-hidden transition-all duration-1000 ${
//             activeAccordion[2] ? "max-h-96" : "max-h-0"
//           }`}
//         >
//           <p>
//             {" "}
//             If braces are not needed right away, you will be enrolled in our
//             complementary growth and guidance program, called our Future
//             FreySmiles Club, where we will see you every 6-12 months to monitor
//             your progress. Timing is extremely important for us to be able to
//             provide the best results and to deliver your new smile as quickly as
//             possible. These visits for a “peace of mind policy” cost you
//             nothing! We’ll also be working with your family dentist before and
//             during braces to provide you with the highest level of care.
//           </p>
//         </div>
//         <div
//           className={`border-t border-indigo-300 py-3 px-4 flex justify-between items-center cursor-pointer select-none ${
//             activeAccordion[3] ? "bg-white" : ""
//           }`}
//           onClick={() => toggleAccordion(3)}
//         >
//           <h2 className="text-lg font-medium ml-16 text-indigo-700">What To Bring</h2>
//           <svg
//             className={`h-6 w-6 transform ${
//               activeAccordion[3]  ? "rotate-180" : ""
//             }`}
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d={activeAccordion[3] ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
//             />
//           </svg>
//         </div>
//         <div
//           className={`overflow-hidden transition-all duration-1000 ${
//             activeAccordion[3] ? "max-h-96" : "max-h-0"
//           }`}
//         >
//           <p >
//             {" "}
//             Since treatment plans and payment options may be discussed, we ask
//             that a parent or guardian be present for the first visit. Including
//             everyone who will be making this important decision helps us
//             communicate thoroughly. We are an insurance friendly office so
//             please assist us by bringing your insurance card if you have
//             orthodontic coverage. We want our patients to leave the office with
//             a clear understanding of their specific treatment plan, so don’t
//             hesitate to ask questions.
//           </p>
//         </div>
//           </div>
//         </div>
//         <div className="flex-1 flex justify-end">
// <div className=" max-h-96 overflow-hidden">
// <img className="opacity-90 w-full h-auto" src="../../images/itero.png" alt="scan" style={{ maxWidth: '100%', maxHeight: '100%' }} />
//   </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default YourCare;
