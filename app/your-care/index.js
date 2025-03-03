"use client";
import * as THREE from "three";
import * as PIXI from 'pixi.js';
import Layout from "./layout.js";
import { SplitText } from "gsap-trial/all";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { gsap, TweenLite, TimelineMax, Sine } from 'gsap';

const YourCare = () => {

  // const canvasRef = useRef();

  // useEffect(() => {
  //   const camera = new THREE.PerspectiveCamera(
  //     45,
  //     window.innerWidth / window.innerHeight,
  //     1,
  //     100
  //   );
  //   camera.position.set(0, -0.5, 25);
  //   const scene = new THREE.Scene();
  //   const renderer = new THREE.WebGLRenderer({ alpha: true });
  //   renderer.setClearColor(0x000000, 0);

  //   renderer.setSize(window.innerWidth, window.innerHeight);
  //   canvasRef.current.appendChild(renderer.domElement);

  //   const vertexShader = `
  //     varying vec2 vUv;
  //     void main() {
  //       vUv = uv;
  //       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  //     }
  //   `;

  //   const fragmentShader = `
  //     precision highp float;
  //     varying vec2 vUv;
  //     uniform vec3 u_c1;
  //     uniform vec3 u_c2;
  //     uniform float u_time;
  //     void main() {
  //       vec3 pX = vec3(vUv.x);
  //       vec3 pY = vec3(vUv.y);
  //       vec3 c1 = u_c1;
  //       vec3 c2 = u_c2;
  //       vec3 c3 = vec3(0.0, 1.0, 1.0); // aqua
  //       vec3 cmix1 = mix(c1, c2, pX + pY/2. + cos(u_time));
  //       vec3 cmix2 = mix(c2, c3, (pY - sin(u_time))*0.5);
  //       vec3 color = mix(cmix1, cmix2, pX * cos(u_time+2.));
  //       gl_FragColor = vec4(color, 1.0);
  //     }
  //   `;

  //   const uniforms = {
  //     u_c1: { type: "v3", value: new THREE.Vector3(0.9, 0.8, 0.3) },
  //     u_c2: { type: "v3", value: new THREE.Vector3(1.0, 0.54, 0.4) },
  //     u_time: { type: "f", value: 0 },
  //   };
  //   const shaderMaterial = new THREE.ShaderMaterial({
  //     uniforms,
  //     vertexShader,
  //     fragmentShader,
  //   });

  //   // const gumGeometry = new THREE.SphereGeometry(5, 64, 64);
  //   // const gum = new THREE.Mesh(gumGeometry, shaderMaterial);
  //   // scene.add(gum);

  //   // const bgGeometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
  //   // const bgMesh = new THREE.Mesh(bgGeometry, shaderMaterial);
  //   // scene.add(bgMesh);

  //   const gumGeometry = new THREE.SphereGeometry(5, 64, 64);
  //   const gum = new THREE.Mesh(gumGeometry, shaderMaterial);
  //   scene.add(gum);
  //   const clock = new THREE.Clock();
  //   const animate = () => {
  //     uniforms.u_time.value = clock.getElapsedTime();
  //     renderer.render(scene, camera);
  //     requestAnimationFrame(animate);
  //   };
  //   animate();

  //   const handleResize = () => {
  //     camera.aspect = window.innerWidth / window.innerHeight;
  //     camera.updateProjectionMatrix();
  //     renderer.setSize(window.innerWidth, window.innerHeight);
  //   };
  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //     const canvasElement = renderer.domElement;
  //     if (canvasRef.current?.contains(canvasElement)) {
  //       canvasRef.current.removeChild(canvasElement);
  //     }
  //   };
  // }, []);
  // const [isBlotterLoaded, setIsBlotterLoaded] = useState(false);

  // useEffect(() => {
  //   const loadScript = (src, callback) => {
  //     const script = document.createElement("script");
  //     script.src = src;
  //     script.onload = callback;
  //     document.body.appendChild(script);
  //   };

  //   if (!window.Blotter) {
  //     loadScript("/blotter.min.js", () => {
  //       console.log("Blotter loaded");

  //       loadScript("/liquidDistortMaterial.js", () => {
  //         console.log("LiquidDistortMaterial loaded");
  //         setIsBlotterLoaded(true);
  //       });
  //     });
  //   } else {
  //     setIsBlotterLoaded(true);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (isBlotterLoaded) {
  //     let materials = [];

  //     const lines = ["DISCOVER", "WHAT MAKES", "US UNIQUE"];
  //     let container = document.getElementById("blotter-target");

  //     if (container) {
  //       lines.forEach((line, index) => {
  //         let lineDiv = document.createElement("div");
  //         lineDiv.id = `blotter-line-${index + 1}`;
  //         container.appendChild(lineDiv);

  //         const text = new window.Blotter.Text(line, {
  //           // family: "",
  //           // fill: "#f4ecd7",
  //           size: 100,
  //         });

  //         let material = new window.Blotter.LiquidDistortMaterial();
  //         material.uniforms.uSpeed.value = 0.1;
  //         material.uniforms.uVolatility.value = 0.1;
  //         material.uniforms.uSeed.value = 0.1;

  //         let blotter = new window.Blotter(material, { texts: text });
  //         let scope = blotter.forText(text);
  //         scope.appendTo(lineDiv);

  //         materials.push(material);
  //       });
  //       // const handleMouseMove = (e) => {
  //       //   const formula = ((e.pageX * e.pageY) / 200000) / 1.5;
  //       //   materials.forEach(material => {
  //       //     material.uniforms.uVolatility.value = formula;
  //       //     material.uniforms.uSeed.value = formula;
  //       //   });
  //       // };
  //       const handleMouseMove = (e) => {
  //         let formula = (e.pageX * e.pageY) / 200000 / 1.2;
  //         formula = Math.min(formula, 0.65);
  //         materials.forEach((material) => {
  //           material.uniforms.uVolatility.value = formula;
  //           material.uniforms.uSeed.value = formula;
  //         });
  //       };

  //       document.body.addEventListener("mousemove", handleMouseMove);

  //       return () => {
  //         document.body.removeEventListener("mousemove", handleMouseMove);
  //       };
  //     }
  //   }
  // }, [isBlotterLoaded]);

  // const scrollContainerRef = useRef(null);
  // useEffect(() => {
  //   gsap.to(".bglinear", {
  //     scrollTrigger: {
  //       trigger: "#p2",
  //       scrub: true,
  //       start: "10% bottom",
  //       end: "80% 80%",
  //     },
  //     backgroundImage: "linear-gradient(270deg, #000 50%, #fff 0%)",
  //     duration: 3,
  //   });

  //   gsap.to(".bglinear", {
  //     scrollTrigger: {
  //       trigger: "#p2",
  //       scrub: true,
  //       start: "10% 80%",
  //       end: "80% 80%",
  //     },
  //     letterSpacing: "10px",
  //     duration: 3,
  //   });

  //   return () => {
  //     ScrollTrigger.getAll().forEach((t) => t.kill());
  //   };
  // }, []);

  // const [isPinned, setIsPinned] = useState(false);
  // const aboutTitleRef = useRef(null);

  // useEffect(() => {
  //   const onScroll = () => {
  //     if (aboutTitleRef.current) {
  //       const offsetTop = aboutTitleRef.current.offsetTop;
  //       const isPinned = window.scrollY >= offsetTop;
  //       setIsPinned(isPinned);
  //     }
  //   };

  //   window.addEventListener("scroll", onScroll);
  //   return () => window.removeEventListener("scroll", onScroll);
  // }, []);

  // const getTransitionStyle = () => {
  //   return {
  //     backgroundImage: `url(${images[currentImageIndex]})`,
  //     transition: "background-image 1s ease-in-out",
  //   };
  // };

  // const [currentImageIndex, setCurrentImageIndex] = useState(0);





  // const [scrollPosition, setScrollPosition] = useState(0);
  // const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // const lasth3Ref = useRef(null);
  // const progressPath = useRef(null);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setScrollPosition(window.scrollY);
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  // const handleMouseMove = (e) => {
  //   setCursorPosition({ x: e.clientX, y: e.clientY });
  // };


  // const parallaxStyle = {
  //   top: scrollPosition / 2.8,
  //   opacity: 1 - scrollPosition / 600,
  // };


  // const textContainerRef = useRef(null);

  // useEffect(() => {
  //   gsap.registerPlugin(SplitText, ScrollTrigger);

  //   const onEntry = (entries, observer) => {
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting) {
  //         const textElements = textContainerRef.current.querySelectorAll("h1");

  //         textElements.forEach((textElement) => {
  //           const split = new SplitText(textElement, { type: "lines" });
  //           gsap.from(split.lines, {
  //             duration: 1.5,
  //             y: "100%",
  //             stagger: 0.15,
  //             ease: "power4.out",
  //           });
  //         });

  //         observer.disconnect();
  //       }
  //     });
  //   };

  //   const observer = new IntersectionObserver(onEntry, {
  //     threshold: 1,
  //   });

  //   if (textContainerRef.current) {
  //     observer.observe(textContainerRef.current);
  //   }

  //   return () => observer.disconnect();
  // }, []);

  // useEffect(() => {
  //   gsap
  //     .timeline({
  //       scrollTrigger: {
  //         trigger: ".bottom",
  //         scrub: true,
  //         pin: true,
  //         start: "top top",
  //         end: "+=3000",
  //       },
  //     })
  //     .to(".stripe", { stagger: 0.3, height: "100vh" })
  //     .to(".stripe", { stagger: 0.3, height: 0 })
  //     .to(".thats-all", { opacity: 1, scale: 1 });
  // }, []);

  // useEffect(() => {
  //   const tl = gsap.timeline({ duration: 3, ease: "back" });
  //   const animatedElement = gsap.utils.toArray("p .highlight");
  //   const lineOne = document.querySelector(".one");
  //   const lineTwo = document.querySelector(".two");
  //   const lineThree = document.querySelector(".three");
  //   const lineFour = document.querySelector(".four");

  //   gsap.set([lineOne, lineThree, lineFour], { xPercent: -101, autoAlpha: 0 });
  //   gsap.set(lineTwo, { xPercent: 101, autoAlpha: 0 });
  //   gsap.set(animatedElement, {
  //     y: -100,
  //     autoAlpha: 0,
  //     scale: 1.5,
  //     rotationX: 45,
  //   });

  //   tl.to(lineOne, { xPercent: 0, autoAlpha: 1 })
  //     .to(lineTwo, { xPercent: 0, autoAlpha: 1 }, "-=.15")
  //     .to(lineThree, { xPercent: 0, autoAlpha: 1 }, "-=.21")
  //     .to(lineFour, { xPercent: 0, autoAlpha: 1 }, "-=.15")
  //     .to(animatedElement, {
  //       y: 0,
  //       autoAlpha: 1,
  //       scale: 1,
  //       stagger: 0.4,
  //       rotationX: 0,
  //     });
  // }, []);

  // const steps = [
  //   "Get in touch",
  //   "Initial Consult",
  //   "Be supported",
  //   "Expert Care",
  // ];
  // const cardImages = [
  //   "../images/nowbooking.png",
  //   "../images/firstappointment.svg",
  //   "../images/nocost.png",
  //   "../images/freysmiles_insta.gif",
  // ];

  // const [currentCardIndex, setCurrentCardIndex] = useState(0);
  // const translateY = -(currentCardIndex * 20) + "rem";
  // const [isSliderVisible, setIsSliderVisible] = useState(false);

  // const updateSlider = (index) => {
  //   setCurrentCardIndex(index);
  // };

  // const closeSlider = () => {
  //   setIsSliderVisible(false);
  // };

  // const sectionRef = useRef(null);

  // useEffect(() => {
  //   gsap.registerPlugin(ScrollTrigger);

  //   const section = sectionRef.current;
  //   const horizontalScrollLength = section.scrollWidth - section.offsetWidth;

  //   ScrollTrigger.create({
  //     trigger: section,
  //     start: "top top",
  //     end: horizontalScrollLength,
  //     pin: true,
  //     scrub: 1,
  //     onUpdate: (self) => {
  //       gsap.to(section, {
  //         x: -self.progress * horizontalScrollLength,
  //         ease: "none",
  //       });
  //     },
  //   });
  // }, []);


  // const firstCardRef = useRef(null);

  // useEffect(() => {
  //   gsap.registerPlugin(ScrollTrigger);

  //   if (firstCardRef.current) {
  //     const container = firstCardRef.current;
  //     const image = container.querySelector(".bg");

  //     let tl = gsap.timeline({
  //       scrollTrigger: {
  //         trigger: container,
  //         toggleActions: "restart none none reset",
  //       },
  //     });

  //     tl.set(container, { autoAlpha: 1 });
  //     tl.from(container, 1.5, {
  //       xPercent: -100,
  //       ease: "power2.out",
  //     });
  //     tl.from(image, 1.5, {
  //       xPercent: 100,
  //       scale: 1.3,
  //       delay: -1.5,
  //       ease: "power2.out",
  //     });
  //   }
  // }, []);
  // useEffect(() => {
  //   const tl = gsap.timeline({ repeat: -1, duration: 2, delay: 3, yoyo: true });

  //   tl.to("#char2", { rotation: 360 });
  //   tl.to("#char12", { rotation: 360 });

  //   const splittedText = new SplitText(".split", { type: "chars" });
  //   const chars = splittedText.chars;

  //   gsap.from(chars, {
  //     yPercent: 450,
  //     stagger: { each: 0.05, from: "random" },
  //     ease: "back.out",
  //     duration: 1,
  //   });

  //   gsap.to(".bg-verticalText", {
  //     scale: 1.1,
  //     duration: 2,
  //     repeat: -1,
  //     yoyo: true,
  //     ease: "power1.inOut",
  //   });
  // }, []);
  // const horizontalScrollTrackRef = useRef(null);


  // const [scrollProgress, setScrollProgress] = useState(0);

  // useEffect(() => {

  //   const horizontalMainTl = gsap.timeline({
  //     scrollTrigger: {
  //       trigger: horizontalScrollTrackRef.current,
  //       scrub: true,

  //     },
  //   })
  //   .to(horizontalScrollTrackRef.current, {
  //     xPercent: -100,
  //     ease: "none",
  //     onUpdate: () => updateScrollProgress(horizontalMainTl),
  //   });


  //   function updateScrollProgress(timeline) {
  //     setScrollProgress(Math.round(timeline.progress() * 100));
  //   }


  //   return () => {
  //     horizontalMainTl.kill();
  //   };
  // }, []);

  // const stageRef = useRef(null);


  // const baseUrl = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/106114/";
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY; 
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight; 

      setScroll(scrollPercent); // Update state
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
    <div     style={{
      height: "100vw", 
      background: `linear-gradient(180deg, rgba(212, 212, 212, ${1 - scroll}) 0%, #FBC705 100%)`, 
      transition: "background 0.3s ease-out", 
      padding: "min(18vw,0px) 0 min(8vw,40px)",
    }}>

    </div>
      {/* <Layout>

      <div class="nav_bar sticky">
            <div class="nav_top-logo">
              <div class="nav_logo-embed w-embed"></div>
              <div class="nav_logo-text is-top">Est. 1980</div>
            </div>
            <div class="nav_trigger">
              <div class="nav_icon">
                <div class="nav_icon-line"></div>
                <div class="nav_icon-line"></div>
                <div class="nav_icon-line"></div>
              </div>
            </div>
            <div className="nav_bottom-progress w-full absolute bottom-8 left-0 flex justify-center items-center">
              <div class="nav_logo-text is-bottom">
              <span className="nav_progress-number">{scrollProgress}</span>%
              </div>
            </div>
          </div>

        <div className="horizontal-scroll-section" ref={sectionRef}>


          <div className="section-wrapper">

          <div id="stage" />
            <div className="bg-[#F1F1F1] relative pagesection">
<img className="py-40 px-40 rounded-full" src="../images/skyclouds.jpeg"></img>
            </div>
            <div className="relative pagesection">
              <div className="min-h-screen   relative">
                <div ref={canvasRef} className="w-32 h-32"></div>
                <div
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(120px)",
                  }}
                >
                  <div className=" h-screen" id="blotter-target"></div>
                </div>

                <div
                  className="grid absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center"
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "repeat(4,1fr)",
                    gridTemplateRows: "1fr",
                    justifyContent: "center",
                  }}
                >
                  <div
                    className="grid-lines"
                    style={{
                      width: "1px",
                      background: "#000",
                      height: "100%",
                      opacity: 0.25,
                    }}
                  ></div>
                  <div
                    className="grid-lines"
                    style={{
                      width: "1px",
                      background: "#000",
                      height: "100%",
                      opacity: 0.25,
                    }}
                  ></div>
                  <div
                    className="grid-lines"
                    style={{
                      width: "1px",
                      background: "#000",
                      height: "100%",
                      opacity: 0.25,
                    }}
                  ></div>
                  <div
                    className="grid-lines"
                    style={{
                      width: "1px",
                      background: "#000",
                      height: "100%",
                      opacity: 0.25,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="bg-[#F1EFEB] relative pagesection ">
              <div className="description panel relative h-screen flex justify-center items-center">
                <img
                  className="bg-verticalText absolute"
                  src="../images/chromeoval.svg"
                  alt=""
                  style={{ objectFit: "contain", width: "20%", height: "auto" }}
                />

                <h1
                  className="font-oakes-regular split text-6xl text-[#ffff83]"
                  id="splitText"
                >
                  Science backed approach
                </h1>
              </div>
            </div>

            <div className="cd-slider pagesection">
              <div className="main_cards">
                {cardImages.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`card ${
                      currentCardIndex === index ? "current_card" : ""
                    }`}
                  >
                    <div
                      style={{ backgroundImage: `url(${imageUrl})` }}
                      className="bg"
                    ></div>
                  </div>
                ))}
              </div>
              <nav className="steps">
                {steps.map((step, index) => (
                  <a
                    key={index}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      updateSlider(index);
                    }}
                  >
                    {step}
                  </a>
                ))}
              </nav>

              <nav className="numbers">
                <ul
                  style={{
                    transform: `translateY(${translateY})`,
                    transition: "transform 0.6s ease",
                  }}
                >
                  {steps.map((_, index) => (
                    <li
                      key={index}
                      className={
                        currentCardIndex === index ? "current_number" : ""
                      }
                    >
                      0{index + 1}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="pagesection">
              <div id="pricing" className="bg-[#E1EEEC] flex">
                <div className="mt-10 container">
                  <div className="gsaptext-container mx-auto">
                    <p className="font-poppins text-center text-6xl">Pricing</p>
                    <p className="font-helvetica-neue one text-xl">
                      <span className="highlight"> Taking </span>{" "}
                      <span> the first step </span>
                      <span className="highlight">towards treatment </span>{" "}
                      <span>
                        can sometimes feel overwhelming, especially when it{" "}
                      </span>
                    </p>
                    <p className="two text-xl">
                      <span>comes to discussing</span>{" "}
                      <span className="highlight"> personalized </span>
                      <span>
                        treatment plans. That&apos;s why we kindly request that all{" "}
                      </span>
                    </p>
                    <p className="three text-xl">
                      <span>
                        decision-makers be present during the initial visit.{" "}
                      </span>
                      <span className="highlight">Our goal</span>{" "}
                      <span>is for every patient to walk </span>
                    </p>
                    <p className="four text-xl">
                      <span>
                        out of our office fully informed with answers to all
                        their questions in their treatment path.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
       
            </div>

            <div className="pagesection"></div>
          </div>


        
        </div>
      </Layout> */}
    </>
  );
};

export default YourCare;
