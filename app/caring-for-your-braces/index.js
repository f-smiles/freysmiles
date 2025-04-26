"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CaringForYourBraces = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let tl;

    const updateGSAPValues = () => {
      const containerWidth = window.innerWidth;
      const numSections = document.querySelectorAll(".allsections").length;
      const totalScrollDistance = (numSections - 1) * containerWidth;

      const greenOffset = -containerWidth * 0.64;
      const whiteOffset = -containerWidth * 1.44;
      const orangeOffset = -containerWidth * 2.24;
      const redOffset = -containerWidth * 3.04;
      const blackOffset = -containerWidth * 3.84;

      if (tl) {
        tl.kill();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      }

      // Set initial text content X offsets
      gsap.set(".greenContentText", { x: greenOffset });
      gsap.set(".whiteContentText", { x: whiteOffset });
      gsap.set(".orangeContentText", { x: orangeOffset });
      gsap.set(".redContentText", { x: redOffset });
      gsap.set(".blackContentText", { x: blackOffset });

      // Set initial translateX for sections
      gsap.set(".purpleSection", { x: "0vw" });
      gsap.set(".greenSection", { x: "80vw" });
      gsap.set(".whiteSection", { x: "95vw" });
      gsap.set(".orangeSection", { x: "100vw" });
      gsap.set(".redSection", { x: "100vw" });
      gsap.set(".blackSection", { x: "100vw" });

      gsap.set(".purpleSectionImage", {
        scale: 1,
        xPercent: -60,
        transformOrigin: "100% 100%",
      });
      gsap.set(".greenSectionImage", {
        scale: 0.45,
        xPercent: -15,
        transformOrigin: "100% 100%",
      });
      gsap.set(".whiteSectionImage", {
        scale: 0.15,
        xPercent: 0,
        transformOrigin: "100% 100%",
      });
      gsap.set(".orangeSectionImage", {
        scale: 0,
        xPercent: 0,
        transformOrigin: "100% 100%",
      });
      gsap.set(".redSectionImage", {
        scale: 0,
        xPercent: 0,
        transformOrigin: "100% 100%",
      });

      gsap.set(".purpleSectionImage .imageInnerContainer", {
        scale: 1,
        transformOrigin: "50% 50%",
      });
      gsap.set(".greenSectionImage  .imageInnerContainer", {
        scale: 1.55,
        transformOrigin: "50% 50%",
      });
      gsap.set(".whiteSectionImage  .imageInnerContainer", {
        scale: 1.85,
        transformOrigin: "50% 50%",
      });
      gsap.set(".orangeSectionImage .imageInnerContainer", {
        scale: 2,
        transformOrigin: "50% 50%",
      });
      gsap.set(".redSectionImage    .imageInnerContainer", {
        scale: 2,
        transformOrigin: "50% 50%",
      });

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${totalScrollDistance}`,
          scrub: 1,
          pin: true,
        },
      });

      // Slide each section using translateX
      tl.to(".greenSection", { x: "0vw", duration: 1, ease: "none" }, 0);
      tl.to(".whiteSection", { x: "80vw", duration: 1, ease: "none" }, 0);
      tl.to(".orangeSection", { x: "95vw", duration: 1, ease: "none" }, 0);
      tl.to(".redSection", { x: "100vw", duration: 1, ease: "none" }, 0);
      tl.to(".blackSection", { x: "100vw", duration: 1, ease: "none" }, 0);

      tl.to(".whiteSection", { x: "0vw", duration: 1, ease: "none" }, 1);
      tl.to(".orangeSection", { x: "80vw", duration: 1, ease: "none" }, 1);
      tl.to(".redSection", { x: "95vw", duration: 1, ease: "none" }, 1);
      tl.to(".blackSection", { x: "100vw", duration: 1, ease: "none" }, 1);

      tl.to(".orangeSection", { x: "0vw", duration: 1, ease: "none" }, 2);
      tl.to(".redSection", { x: "80vw", duration: 1, ease: "none" }, 2);
      tl.to(".blackSection", { x: "95vw", duration: 1, ease: "none" }, 2);

      tl.to(".redSection", { x: "0vw", duration: 1, ease: "none" }, 3);
      tl.to(".blackSection", { x: "80vw", duration: 1, ease: "none" }, 3);

      tl.to(".blackSection", { x: "0vw", duration: 1, ease: "none" }, 4);

      // Reveal content text
      tl.to(".greenContentText", { x: "0%", duration: 0.8, ease: "none" }, 0.2);
      tl.to(".whiteContentText", { x: "0%", duration: 1.8, ease: "none" }, 0.2);
      tl.to(
        ".orangeContentText",
        { x: "0%", duration: 2.8, ease: "none" },
        0.2
      );
      tl.to(".redContentText", { x: "0%", duration: 3.8, ease: "none" }, 0.2);
      tl.to(".blackContentText", { x: "0%", duration: 4.8, ease: "none" }, 0.2);

      tl.to(".purpleSectionImage", { 
        scale: 0.2, 
        xPercent: -150, 
        ease: "power2.out",
        duration: 4  
      }, 0); 
      tl.to(".greenSectionImage", { 
        scale: 0.8, 
        xPercent: -150, 
        ease: "power2.out",
        duration: 1 
      }, 0); 
      tl.to(".whiteSectionImage", { 
        scale: 0.8, 
        xPercent: -150, 
        ease: "power2.out", 
        duration: 1 
      }, 1.5); 
      tl.to(".orangeSectionImage", {
        scale: 0.8,
        xPercent: -150,
        ease: "power2.out",
      duration: 1
      },1.5);
      tl.to(".redSectionImage", {
        scale: 0.8,
        xPercent: -150,
        ease: "power2.out",
       duration: 1,
      },1);

      tl.to(".purpleSectionImage .imageInnerContainer", { 
        scale: 1.2, 
        ease: "power2.out", 
        duration: 2 
      }, 0); 
      tl.to(".greenSectionImage .imageInnerContainer", { 
        scale: 1.2, 
        ease: "power2.out", 
        duration: 1
      }, 0); 
      tl.to(".whiteSectionImage .imageInnerContainer", {
        scale: 1.2,
        ease: "power2.out",
     duration: 1
      }, 1);
      tl.to(".orangeSectionImage .imageInnerContainer", {
        scale: 1.2,
        ease: "power2.out",
  duration: 1
      },1);
      tl.to(".redSectionImage .imageInnerContainer", {
        scale: 1.2,
        ease: "power2.out",
      duration: 1,
      },1);

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    };

    const ctx = gsap.context(() => {
      updateGSAPValues();
    }, containerRef);

    updateGSAPValues();
    window.addEventListener("resize", updateGSAPValues);

    return () => {
      window.removeEventListener("resize", updateGSAPValues);
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    gsap.to(".fixedNav", {
      duration: 0.5,
      scrollTrigger: {
        trigger: "body",
        start: "top top",
      },
    });
  }, []);

  const cubeRef = useRef(null);
  const cuboidRefs = useRef([]);
  const wordRefs = useRef([]);

  useEffect(() => {
    const container = cubeRef.current;
    const cuboids = cuboidRefs.current;
    const words = wordRefs.current;

    let winW = window.innerWidth;
    let winH = window.innerHeight;
    let pointer = { x: winW / 2, y: winH / 2 };

    const setWinDimensions = () => {
      winW = window.innerWidth;
      winH = window.innerHeight;
    };

    const calcOffset = (x, y) => {
      const dx = (2 * (x - winW / 2)) / winW;
      const dy = (-2 * (y - winH / 2)) / winH;
      return [dx, dy];
    };

    const followPointer = (x, y) => {
      const [dx, dy] = calcOffset(x, y);
      const deltaS = 450 * Math.abs(dx);
      const deltaW = 600 * Math.abs(dy);

      gsap.to(words, {
        fontStretch: `${550 - deltaS}%`,
        fontWeight: 800 - deltaW,
        duration: 2,
      });
    };

    const init = () => {
      setWinDimensions();
      gsap.set(container, { visibility: "visible", opacity: 1 });

      gsap.timeline({ delay: 0.5 }).from(cuboids, {
        y: 0,
        duration: 3,
        stagger: 0.14,
        ease: "elastic(0.4,0.3)",
      });

      gsap.to(cuboids, {
        rotateX: -360,
        duration: 8,
        repeat: -1,
        ease: "none",
      });

      gsap.fromTo(
        cuboids,
        { rotateY: 8, rotate: -10 },
        {
          rotateY: -8,
          rotate: 10,
          duration: 2.2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        }
      );
    };

    const handleMove = (e) => followPointer(e.clientX, e.clientY);
    const handleTouch = (e) =>
      followPointer(e.touches[0].clientX, e.touches[0].clientY);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleTouch);
    window.addEventListener("touchstart", handleTouch);
    window.addEventListener("resize", setWinDimensions);

    init();

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleTouch);
      window.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("resize", setWinDimensions);
    };
  }, []);
  return (
    <div ref={containerRef} className=" min-h-screen">
      <div>
        <div
          style={{
            position: "fixed",
            top: "20vh",
            width: "100%",
            paddingLeft: "15rem",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          {/* <div className="containercube" ref={cubeRef}>
      <div className="hi">
        <div className="hi__cuboid" ref={(el) => (cuboidRefs.current[0] = el)}>
          <div className="face face--front">
            <p className="hi__word" ref={(el) => (wordRefs.current[0] = el)}></p>
          </div>
          <div className="face face--back">
            <p className="hi__word" ref={(el) => (wordRefs.current[1] = el)}></p>
          </div>
          <div className="face face--top">
            <p className="hi__word" ref={(el) => (wordRefs.current[2] = el)}>Braces</p>
          </div>
          <div className="face face--bottom">
            <p className="hi__word" ref={(el) => (wordRefs.current[3] = el)}>Care</p>
          </div>
        </div>
      </div>
    </div> */}
          {/* <div className="relative w-fit">

  <div className="absolute inset-0" />
  <svg fill="none" height="83" viewBox="0 0 83 83" width="83" xmlns="http://www.w3.org/2000/svg"><path d="m28.9392 17.858c1.3435 1.3435 3.4104 1.3435 4.7539 0l5.5806-5.5806c1.3434-1.3434 3.4103-1.3434 4.7538 0l5.7872 5.7873c1.3435 1.3435 1.3435 3.4104.0001 4.7538l-49.295211 49.2952 10.541111 10.5411 49.2951-49.2952c1.3435-1.3434 3.4104-1.3434 4.7539 0l5.7873 5.7873c1.3434 1.3435 1.3434 3.4104 0 4.7538l-5.5806 5.5806c-1.3435 1.3435-1.3435 3.4104 0 4.7539l5.7872 5.7872c1.3435 1.3435 1.3435 3.4104 0 4.7539l-5.5805 5.5805c-1.3435 1.3435-1.3435 3.4104 0 4.7539l5.7872 5.7872c1.3435 1.3435 3.4104 1.3435 4.7539 0l5.5805-5.5806c1.3435-1.3434 1.3435-3.4103 0-4.7538l-5.7872-5.7872c-1.3435-1.3435-1.3435-3.4104 0-4.7539l5.5806-5.5806c1.3434-1.3434 1.3434-3.4103-.0001-4.7538l-5.7872-5.7873c-1.3435-1.3434-1.3435-3.4103 0-4.7538l5.5806-5.5806c1.3434-1.3435 1.3434-3.4103 0-4.7538l-5.7873-5.7873c-1.3435-1.3435-1.3435-3.4103 0-4.7538l5.5806-5.5806c1.3435-1.3435 1.3435-3.41035 0-4.75382l-5.7873-5.78728c-1.3435-1.343473-3.4103-1.343472-4.7538 0l-5.5806 5.58059c-1.3435 1.34347-3.4104 1.34346-4.7538-.00001l-5.7873-5.78726c-1.3435-1.34348-3.4104-1.343486-4.7538-.00001l-5.5806 5.58058c-1.3435 1.34348-3.4104 1.34348-4.7539.00001l-5.7872-5.78727c-1.3435-1.343477-3.4104-1.343476-4.7539 0l-5.5805 5.58058c-1.3435 1.34347-3.4104 1.34347-4.7539 0l-5.7872-5.78728c-1.3435-1.34347-3.41039-1.343472-4.75387 0l-5.58058 5.58058c-1.343475 1.34348-1.343473 3.41039 0 4.75379l5.78727 5.7873c1.34348 1.3435 3.41038 1.3435 4.75388 0l5.5805-5.5806c1.3435-1.3434 3.4104-1.3434 4.7539 0zm31.21-5.3739c1.3434-1.3435 3.4103-1.3435 4.7538 0l5.7873 5.7873c1.3434 1.3435 1.3434 3.4103 0 4.7538l-5.5806 5.5806c-1.3435 1.3435-3.4104 1.3435-4.7539 0l-5.7872-5.7873c-1.3435-1.3434-1.3435-3.4103 0-4.7538z" fill="#C9FE6E"/></svg>

  <h1
    className="relative text-[64px] font-neuehaas45 leading-none "
  >
    Braces Care
  </h1>
</div> */}
        </div>

        <div>


          <div
            style={{
              fontFamily: "NeueMontrealBook",
              height: "100%",
              position: "relative",
              top: "0",
              width: "100%",
            }}
          >
            <div
              style={{
                height: "100vh",
                overflow: "hidden",
                position: "absolute",
                top: "0",
                width: "100%",
              }}
              className="purpleSection allsections"
            >
              <div>
                <div
                  className="purpleInner"
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    paddingLeft: "12rem",
                    paddingTop: "0vh",
                  }}
                >
                  <div
                    className="contentText"
                    style={{
                      marginTop: "18.25rem",
                      overflow: "hidden",
                      width: "475px",
                    }}
                  >
                    <div className="flex flex-row gap-4">
                      <button className="font-neueroman flex items-center justify-between text-[12px] uppercase">
                        <span className="mr-4 w-1.5 h-1.5 bg-black rounded-full"></span>
                        Treatment Duration
                      </button>
                    </div>{" "}
                    <p className="font-neueroman uppercase mt-10 text-[13px] leading-[1.5]">
                      Your treatment time will depend on your customized plan
                      and how closely you follow our team’s instructions. Most
                      Frey Smiles patients see their ideal smile in just 12 to
                      20 months with the right guidance along the way. When
                      you’re ready to begin, schedule a consultation, and we’ll
                      handle the rest.
                    </p>
                  </div>
                  <div className="purpleSectionImage">
                    <div
                      className="imageInnerContainer"
                     
                    >
                      <img
                        src="../images/stayontrack.png"
                        alt="portal"
                        style={{
                          width: "100%",
                          height: "auto",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                height: "100vh",
                overflow: "hidden",
                position: "absolute",
                top: "0",
                width: "100%",
              }}
              className="greenSection allsections"
            >
              <div
                style={{
                  display: "flex",
                  overflow: "hidden",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  paddingLeft: "12rem",
                  paddingTop: "0vh",
                }}
              >
                <div
                  className="greenContentText"
                  style={{
                    marginTop: "18.25rem",
                    overflow: "hidden",
                    width: "475px",
                  }}
                >
                  <div className="flex flex-row gap-4">
                  <button className="font-neueroman flex items-center justify-between text-[12px] uppercase">
                      <span className="mr-4 w-1.5 h-1.5 uppercase bg-black rounded-full"></span>
                      Brushing & Flossing
                    </button>
                  </div>{" "}
                  <p className="font-neueroman uppercase mt-10 text-[13px] leading-[1.5]">
                    Brushing and flossing during orthodontic treatment is as
                    important as ever. all orthodontic appliances like clear
                    aligners, brackets, and wires interfere with the mouth's
                    normal self-cleansing mechanisms. Research shows only 10% of
                    patients brush and floss consistently during active
                    treatment. We recommend three cleanings a year for braces
                    patients; check if your insurance covers the third. When you
                    begin treatment, we'll equip you with tools such as spare
                    toothbrushes and dental floss to help with cleaning.
                  </p>
                  <div className="flex items-center space-x-2"></div>
                </div>
                <div className="greenSectionImage">
                  <div
                    className="imageInnerContainer"
                    style={{
                      marginTop: "18.25rem",
                    }}
                  >
                    <img
                      src="../images/flossbrush.png"
                      alt="brushing"
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                height: "100vh",
                overflow: "hidden",
                position: "absolute",
                top: "0",
                width: "100%",
              }}
              className="whiteSection allsections"
            >
              <div
                style={{
                  display: "flex",
                  overflow: "hidden",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  paddingLeft: "16rem",
                  paddingTop: "0vh",
                }}
              >
                <div
                  className="whiteContentText"
                  style={{
                    marginTop: "18.25rem",
                    overflow: "hidden",
                    width: "475px",
                  }}
                >
                  <div className="flex flex-row gap-4">
                  <button className="font-neueroman flex items-center justify-between text-[12px] uppercase">
                      <span className="mr-4 w-1.5 h-1.5 uppercase bg-black rounded-full"></span>
                      General Soreness
                    </button>
                  </div>
                  <div className="font-neueroman uppercase mt-10 text-[13px] leading-[1.5]">
                    When you first get braces, your mouth might feel sore, and
                    your teeth may be tender for 3–5 days—kind of like a dull
                    headache. Taking Tylenol or your usual pain reliever can
                    help ease the discomfort. Your lips, cheeks, and tongue
                    might also feel irritated for a week or two as they adjust.
                    No worries—we’ve got you covered with wax to prevent rubbing
                    and irritation. Hang in there—it gets easier!
                  </div>
                </div>
                <div className="whiteSectionImage">
                  <div
                    className="imageInnerContainer w-1/3"
                    style={{
                      marginTop: "3.25rem",
                    }}
                  >
                    <img
                      src="../images/hanginthere.png"
                      alt="portal"
                      style={{
                        maxHeight: "100%",
                        width: "auto",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                height: "100vh",
                overflow: "hidden",
                position: "absolute",
                top: "0",
                width: "100%",
              }}
              className="orangeSection allsections"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  paddingLeft: "16rem",
                  paddingTop: "0vh",
                }}
              >
                <div
                  className="orangeContentText"
                  style={{
                    width: "475px",
                    marginTop: "18.25rem",
                    overflow: "hidden",
                  }}
                >
                  <div className="flex flex-row gap-4">
                  <button className="font-neueroman flex items-center justify-between text-[12px] uppercase">
                      <span className="mr-4 w-1.5 h-1.5 uppercase bg-black rounded-full"></span>
                      Eating with braces
                    </button>
                  </div>
                  <div className="font-neueroman uppercase mt-10 text-[13px] leading-[1.5]">
                    Traditionally, patients have been advised to avoid certain
                    foods during braces treatment, as aggressive or rapid
                    chewing can break brackets. Crunchy, chewy, sugary, and
                    acidic foods should be avoided. While this is not a
                    comprehensive list, some examples include dense breads,
                    caramel, gum, soda, and lean meats. Apples should be sliced,
                    and corn on the cob may require careful navigation.
                  </div>
                </div>
                <div
                  className="w-1/3 "
                  style={{
                    marginTop: "20.25rem",
                  }}
                >
                  <img
                    src="../images/soda1.png"
                    alt="portal"
                    style={{
                      maxHeight: "70%",
                      width: "auto",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
            </div>
            <div
              style={{
                height: "100vh",
                overflow: "hidden",
                position: "absolute",
                top: "0",
                width: "100%",
              }}
              className=" redSection allsections"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  paddingLeft: "16rem",
                  paddingTop: "0vh",
                }}
              >
                <div
                  className="redContentText"
                  style={{
                    width: "475px",
                    marginTop: "18.25rem",
                    overflow: "hidden",
                  }}
                >
                  <div className="flex flex-row gap-4">
                  <button className="font-neueroman flex items-center justify-between text-[12px] uppercase">
                      <span className="mr-4 w-1.5 h-1.5 uppercase bg-black rounded-full"></span>
                      Rubberband wear
                    </button>
                  </div>
                  <div className="font-neueroman uppercase mt-10 text-[13px] leading-[1.5]">
                    If your doctor has prescribed rubber bands, it’s essential
                    to follow the prescription for the best results. Not wearing
                    them as directed or frequently breaking brackets can affect
                    your treatment outcome. During treatment, you’ll receive
                    different rubber band sizes based on wire size and planned
                    corrections. While you may accumulate various elastics, keep
                    in mind that not all are interchangeable for every
                    configuration.
                  </div>
                </div>
                <div
                  className="w-1/3 "
                  style={{
                    marginTop: "13.25rem",
                  }}
                >
                  <img
                    src="../images/rubberbands2.png"
                    alt="portal"
                    style={{
                      maxHeight: "80%",
                      width: "auto",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
            </div>
            <div
              style={{
                height: "100vh",
                overflow: "hidden",
                position: "absolute",
                top: "0",
                width: "100%",
              }}
              className=" blackSection allsections"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  paddingLeft: "16rem",
                  paddingTop: "0vh",
                }}
              >
                <div
                  className="blackContentText"
                  style={{
                    width: "475px",
                    marginTop: "18.25rem",
                    overflow: "hidden",
                  }}
                >
                  <div className="flex flex-row gap-4">
                  <button className="font-neueroman flex items-center justify-between text-[12px] uppercase">
                      <span className="mr-4 w-1.5 h-1.5 uppercase bg-black rounded-full"></span>
                      Final Considerations
                    </button>
                  </div>
                  <div className="font-neueroman uppercase mt-10 text-[13px] leading-[1.5]">
                    Teeth will become loose, and some more than others. The
                    teeth will settle into the bone and soft tissue, and
                    mobility will return to physiologic norms at the end of
                    treatment. Brackets and other orthodontic appliances are
                    temporary, and occasional breakages are expected. These are
                    factored into your treatment time and retention plan. During
                    your treatment, you may encounter dental professionals,
                    hygienists, or specialists with different perspectives on
                    care. Our office uses advanced techniques that some may not
                    fully understand. While we're always open to discussing our
                    approach with other professionals, patient care remains our
                    priority. If you're ever unsure, you can always circle back
                    with the doctor who planned your treatment. Trust the
                    process—we're here to guide you.
                  </div>
                </div>
                <div
                  className="w-1/3 "
                  style={{
                    marginTop: "20.25rem",
                  }}
                >
                  <video
                    src="https://video.wixstatic.com/video/11062b_163d7539f7824eb895994a6460f0995b/720p/mp4/file.mp4"
                    className="object-cover w-full h-full"
                    autoPlay
                    loop
                    muted
                    playsInline
                  ></video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaringForYourBraces;

// "use client";
// import React, { useRef, useEffect } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// export default function HorizontalContainer() {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: containerRef.current,
//           start: "top top",
//           end: "+=9000",
//           scrub: 1,
//           pin: true,

//         },
//       });

//       // 1st: purple expands, green & white expand together
//       tl.to(
//         ".purpleSection",
//         { left: "0vw", width: "70vw", duration: 1, ease: "none" },
//         0
//       );
//       tl.to(
//         ".contentText",
//         {
//           x: "0",
//           duration: 0.5,
//           ease: "none",
//         },
//         .5
//       );
//       tl.to(
//         ".image-wrapper",
//         {
//           scale: 1.5,
//           transformOrigin: "bottom right",
//           duration: 1,
//           ease: "power2.out",
//         },
//         0
//       );

//       tl.to(
//         ".greenSection",
//         { left: "70vw", width: "20vw", duration: 1, ease: "none" },
//         0
//       );

//       tl.to(
//         ".whiteSection",
//         { left: "90vw", width: "10vw", duration: 1, ease: "none" },
//         0
//       );

//       tl.to(
//         ".greenSection",
//         { left: "0vw", width: "70vw", duration: 1, ease: "none" },
//         1
//       );
//       tl.to(
//         ".greenContentText",
//         {
//           x: "0%",
//           duration: 0.5,
//           ease: "none",
//         },
//         1.5
//       );
//       tl.to(
//         ".image-wrapper2",
//         {
//           scale: 2.5,
//           transformOrigin: "bottom right",
//           duration: 1,
//           ease: "power2.out",
//         },
//         1
//       );
//       tl.to(
//         ".whiteSection",
//         { left: "70vw", width: "15vw", duration: 1, ease: "none" },
//         1
//       );
//       tl.to(
//         ".orangeSection",
//         { left: "85vw", width: "15vw", duration: 1, ease: "none" },
//         1
//       );
//       tl.set(".greenSection", { zIndex: 4 }, 1);

//       // 3rd: white moves over green, orange expands, red appears
//       tl.to(
//         ".whiteSection",
//         { left: "0vw", width: "70vw", duration: 1, ease: "none" },
//         2
//       );
//       tl.to(
//         ".whiteContentText",
//         {
//           x: "0%",
//           duration: 0.5,
//           ease: "none",
//         },
//         2.5
//       );
//       tl.to(
//         ".orangeSection",
//         { left: "70vw", width: "20vw", duration: 1, ease: "none" },
//         2
//       );
//       tl.to(
//         ".redSection",
//         { left: "90vw", width: "10vw", duration: 1, ease: "none" },
//         2
//       );
//       tl.set(".whiteSection", { zIndex: 5 }, 2);

//       // 4th: orange moves over white, red expands
//       tl.to(
//         ".orangeSection",
//         { left: "0vw", width: "70vw", duration: 1, ease: "none" },
//         3
//       );
//       tl.to(
//         ".orangeContentText",
//         {
//           x: "0%",
//           duration: 0.5,
//           ease: "none",
//         },
//         3.5
//       );
//       tl.to(
//         ".redSection",
//         { left: "70vw", width: "30vw", duration: 1, ease: "none" },
//         3
//       );
//       tl.set(".orangeSection", { zIndex: 6 }, 3);

//       // 5th: red moves over orange as the final section
//       tl.to(
//         ".redSection",
//         { left: "0vw", width: "100vw", duration: 1, ease: "none" },
//         4
//       );
//       tl.set(".redSection", { zIndex: 7 }, 4);
//       tl.to(
//         ".redContentText",
//         {
//           x: "0%",
//           duration: 0.5,
//         },
//         4.5
//       );
//     }, containerRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <>
//       <div
//    style={{
//     position: "fixed",
//     top: "20vh",
//     left: "-150px",
//     width: "100%",
//     paddingLeft: "16rem",
//     zIndex: 10,
//     pointerEvents: "none",
//   }}
//       >
//         <h1 className="text-[82px] font-generalregular">Self-Care</h1>
//       </div>
//       <section
//         ref={containerRef}
//         style={{
//           position: "relative",
//           height: "100vh",
//           overflow: "hidden",
//         }}
//       >
//         {/* gray */}
//         <div
//           className="graySection"
//           style={{
//             position: "absolute",
//             top: 0,
//             left: "0vw",
//             width: "70vw",
//             height: "100%",
//             overflow: "hidden",
//             background: "#EFEFEF",
//             zIndex: 1,
//           }}
//         >
//           <div className="flex flex-col h-screen justify-center">
//             <div className="h-2/3 flex flex-col md:flex-row gap-8 md:gap-16 ">
//               <div
//                 style={{
//                   position: "relative",
//                   width: "100%",
//                   height: "100%",
//                 }}
//               >
//                 <div
//                   style={{
//                     position: "absolute",
//                     transform: "translate(0%, 0%)",
//                     width: "550px",
//                     bottom: 30,
//                     left: "10%",
//                     paddingRight: "68px",
//                   }}
//                   className="contentText flex flex-col justify-end"
//                 >
//                   <p className="text-[14px] font-neue-montreal md:text-[16px] leading-relaxed mb-8">
//                     How long you’ll wear braces depends on your treatment plan
//                     and how well you follow our team's instructions. At
//                     FreySmiles, most patients achieve their ideal smile in 12 to
//                     20 months. Ready to get started? Let’s make it happen.
//                   </p>
//                   <hr className="border-t border-[#262626] mb-8" />
//                   <div className="flex items-center space-x-2">
//                     <h3 className="font-helvetica-neue-light text-sm font-medium uppercase tracking-widest mb-0 leading-none">
//                       • Learn More
//                     </h3>
//                   </div>
//                 </div>
//               </div>
//               <div className="absolute right-0 bottom-[10%] flex justify-end">
//                 <div
//                   className="image-wrapper rounded-2xl overflow-hidden"
//                   style={{
//                     width: "350px",
//                     height: "auto",
//                   }}
//                 >
//       <div className="relative w-full h-screen flex items-center justify-center overflow-visible">
//   {/* Arch - Positioned Correctly */}
//   <div className="absolute w-[250px] top-[30%] right-[20%]">
//     <img
//       src="https://cdn.prod.website-files.com/5ffdc00ed84c8443afac3d5f/60b114b72343062eb3433b53_Doorway%401.5x.png"
//       alt="Arch"
//     />
//   </div>

//   {/* Staggered Steps - Adjusted to Prevent Cropping */}
//   <div className="absolute bottom-[5%] left-[10%] flex flex-col items-center">
//     {/* Bottom Step - Furthest Left */}
//     <img
//       src="https://cdn.prod.website-files.com/5ffdc00ed84c8443afac3d5f/60b114b63e81a1741fde0d23_Step%20Bottom%401.5x.png"
//       alt="Step"
//       className="w-[250px] ml-[-50px]"
//     />

//     {/* Middle Step - Slightly Right */}
//     <img
//       src="https://cdn.prod.website-files.com/5ffdc00ed84c8443afac3d5f/60b114b63e81a1741fde0d23_Step%20Bottom%401.5x.png"
//       alt="Step"
//       className="w-[230px] ml-[-30px] mt-[-30px]"
//     />

//     {/* Top Step - Most Right */}
//     <img
//       src="https://cdn.prod.website-files.com/5ffdc00ed84c8443afac3d5f/60b114b63e81a1741fde0d23_Step%20Bottom%401.5x.png"
//       alt="Step"
//       className="w-[210px] ml-[-10px] mt-[-30px]"
//     />
//   </div>
// </div>

//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* purple */}
//         <div
//           className="purpleSection"
//           style={{
//             position: "absolute",
//             overflow: "hidden",
//             top: 0,
//             left: "70vw",
//             width: "20vw",
//             height: "100%",
//             background: "#CABDFE",
//             zIndex: 2,
//           }}
//         >
//           <div className="flex flex-col h-screen justify-center">
//             <div className="h-2/3 flex flex-col md:flex-row gap-8 md:gap-16 ">
//               <div
//                 style={{
//                   position: "relative",
//                   width: "100%",
//                   height: "100%",
//                 }}
//               >
//                 <div
//                   style={{
//                     position: "absolute",

//                     transform: "translateX(-650px)",
//                     width: "550px",
//                     bottom: 30,
//                     left: "100px",
//                     paddingRight: "68px",
//                   }}
//                   className="contentText flex flex-col justify-end"
//                 >
//                   <p className="text-[14px] font-helvetica-neue-light md:text-[16px] font-light leading-relaxed mb-8">
//                     Brushing and flossing during orthodontic treatment is more
//                     important than ever. All orthodontic appliances such as
//                     clear aligners, brackets, and wires interfere with normal
//                     self-cleansing mechanisms of the mouth. Research shows that
//                     only 10% of patients brush and floss consistently during
//                     active treatment. We always recommend patients with braces
//                     get three cleanings a year. Check with your insurance to see
//                     if they'll cover a third cleaning. When you begin treatment
//                     we will equip you with a number of tools to help with
//                     cleaning, including spare toothbrushes, and dental floss.
//                   </p>
//                   <hr className="border-t border-[#262626] mb-8" />
//                   <div className="flex items-center space-x-2">
//                     <h3 className="font-helvetica-neue-light text-black text-sm font-medium uppercase tracking-widest mb-0 leading-none">
//                       • Brushing and Flossing
//                     </h3>
//                   </div>
//                 </div>
//               </div>
//               <div className="absolute right-0 bottom-[6%] flex justify-end">
//                 <div
//                   className="image-wrapper rounded-2xl overflow-hidden"
//                   style={{
//                     width: "250px",
//                     height: "auto",
//                   }}
//                 >
//                   <img
//                     src="../images/purplefloss.jpeg"
//                     className="w-full h-auto"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* green */}
//         <div
//           className="greenSection"
//           style={{
//             position: "absolute",
//             top: 0,
//             left: "90vw",
//             width: "10vw",
//             height: "100%",
//             background: "#fb9474",
//             zIndex: 3,
//           }}
//         >
//           <div className="flex flex-col h-screen justify-center">
//             <div className="h-2/3 flex flex-col md:flex-row gap-8 md:gap-16 ">
//               <div
//                 style={{
//                   overflow: "hidden",
//                   position: "relative",
//                   width: "100%",
//                   height: "100%",
//                 }}
//               >
//                 <div
//                   style={{
//                     transform: "translateX(-105%)",
//                     width: "550px",
//                     bottom: 30,
//                     left: "10%",
//                     paddingRight: "68px",
//                   }}
//                   className="absolute greenContentText flex flex-col justify-end"
//                 >
//                   <p className="text-[14px] font-helvetica-neue-light md:text-[16px] font-light leading-relaxed mb-8">
//                     When you first get braces, your mouth might feel sore, and
//                     your teeth may be tender for 3–5 days—kind of like a dull
//                     headache. Taking Tylenol or your usual pain reliever can
//                     help ease the discomfort. Your lips, cheeks, and tongue
//                     might also feel irritated for a week or two as they adjust.
//                     No worries—we’ve got you covered with wax to prevent rubbing
//                     and irritation. Hang in there—it gets easier!
//                   </p>
//                   <hr className="border-t border-[#262626] mb-8" />
//                   <div className="flex items-center space-x-2">
//                     <h3 className="font-helvetica-neue-light text-sm font-medium uppercase tracking-widest mb-0 leading-none">
//                       • General Soreness
//                     </h3>
//                   </div>
//                 </div>
//               </div>
//               <div className="absolute right-0 bottom-[6%] flex justify-end">
//                 <div
//                   className="image-wrapper2 rounded-2xl overflow-hidden"
//                   style={{
//                     width: "150px",
//                     height: "auto",
//                   }}
//                 >
//                   <img src="https://cdn.prod.website-files.com/63088dc6f3670c21541c6fe6/639bd720adaf8a32db61b090_Gallery%2018-p-1080.jpg" className="w-full h-auto" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* white */}
//         <div
//           className="whiteSection"
//           style={{
//             position: "absolute",
//             top: 0,
//             left: "100vw",
//             width: "0vw",
//             height: "100%",
//             background: "#C3D393",
//             zIndex: 1,
//             overflow: "hidden",
//           }}
//         >
//           <div className="flex flex-col h-screen justify-center">
//             <div className="h-2/3 flex flex-col md:flex-row gap-8 md:gap-16 ">
//               <div
//                 style={{
//                   overflow: "hidden",
//                   position: "relative",
//                   width: "100%",
//                   height: "100%",
//                 }}
//               >
//                 <div
//                   style={{
//                     transform: "translateX(-105%)",
//                     width: "550px",
//                     left: "10%",
//                     bottom: 30,
//                     paddingRight: "68px",
//                   }}
//                   className="absolute whiteContentText flex flex-col justify-end"
//                 >
//                   <p className="text-[14px] font-helvetica-neue-light md:text-[16px] font-light text-black leading-relaxed mb-8">
//                     Traditionally, patients have been advised to avoid specific
//                     foods during braces treatment. Overly aggressive and rapid
//                     chewing will break your brackets. Crunchy, chewy, sugary,
//                     and acidic foods should be avoided. While this is not a
//                     comprehensive list, here is a basic guideline: Dense breads,
//                     caramel, gum, soda, lean meats. apples should be sliced and
//                     corn on the cob may require precise navigation.
//                   </p>
//                   <hr className="border-t border-[#262626] mb-8" />
//                   <div className="flex items-center space-x-2">
//                     <h3 className="font-helvetica-neue-light text-sm font-medium uppercase tracking-widest mb-0 leading-none">
//                       • Eating with braces
//                     </h3>
//                   </div>
//                 </div>
//               </div>
//               <div className="absolute right-0 bottom-[6%] flex justify-end">
//                 <div
//                   className="image-wrapper2 rounded-2xl overflow-hidden"
//                   style={{
//                     width: "150px",
//                     height: "auto",
//                   }}
//                 >
//                   <img
//                     src="https://cdn.prod.website-files.com/63088dc6f3670c21541c6fe6/639bd699a51be20ee78cf192_Gallery%209-p-1080.jpg"
//                     className="w-full h-auto"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* orange */}
//         <div
//           className="orangeSection"
//           style={{
//             position: "absolute",
//             top: 0,
//             left: "100vw",
//             width: "0vw",
//             height: "100%",
//             background: "#9DD2D6",
//             zIndex: 1,
//             overflow: "hidden",
//           }}
//         >
//           <div className="flex flex-col h-screen justify-center">
//             <div className="h-2/3 flex flex-col md:flex-row gap-8 md:gap-16 ">
//               <div
//                 style={{
//                   overflow: "hidden",
//                   position: "relative",
//                   width: "100%",
//                   height: "100%",
//                 }}
//               >
//                 <div
//                   style={{
//                     transform: "translate(-105%, 0%)",
//                     maxWidth: "500px",
//                     left: "10%",
//                     bottom: 30,
//                     paddingRight: "68px",
//                   }}
//                   className="orangeContentText absolute flex flex-col justify-end"
//                 >
//                   <p className="text-[14px] font-helvetica-neue-light md:text-[16px] font-light text-black leading-relaxed mb-8">
//                     If your doctor has prescribed rubber bands it's essential
//                     for you to follow the prescription for an ideal result.
//                     Failure to follow protocol and frequently breaking brackets
//                     will lead to a less than ideal treatment result. You’ll be
//                     given a number of different rubber band sizes during
//                     treatment—these are determined by the wire size and planned
//                     correction. You may accumulate a stockpile of various
//                     elastics, but keep in mind that not all elastics are
//                     interchangeable for every configuration.
//                   </p>
//                   <hr className="border-t border-[#262626] mb-8" />
//                   <div className="flex items-center space-x-2">
//                     <h3 className="font-helvetica-neue-light text-sm font-medium uppercase tracking-widest mb-0 leading-none">
//                       • Rubberband wear
//                     </h3>
//                   </div>
//                 </div>
//               </div>
//               <div className="absolute right-0 bottom-[6%] flex justify-end">
//                 <div
//                   className="image-wrapper2 rounded-2xl overflow-hidden"
//                   style={{
//                     width: "150px",
//                     height: "auto",
//                   }}
//                 >
//                   <img
//                     src="../images/bracesrubberbands.png"
//                     className="w-full h-auto"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div
//           className="redSection"
//           style={{
//             position: "absolute",
//             top: 0,
//             left: "100vw",
//             width: "0vw",
//             height: "100%",
//             background: "#EFE9F5",
//             zIndex: 1,
//             overflow: "hidden",
//           }}
//         >
//           <div className="flex flex-col h-screen justify-center">
//             <div className="h-2/3 flex flex-col md:flex-row gap-8 md:gap-16 ">
//               <div
//                 style={{
//                   overflow: "hidden",
//                   position: "relative",
//                   width: "100%",
//                   height: "100%",
//                 }}
//               >
//                 <div
//                   style={{
//                     transform: "translateX(-105%)",
//                     maxWidth: "550px",
//                     left: "10%",
//                     bottom: 30,
//                     paddingRight: "68px",
//                   }}
//                   className="redContentText absolute flex flex-col justify-end"
//                 >
//                   <p className="text-[14px] font-helvetica-neue-light md:text-[16px] font-light text-black leading-relaxed mb-8">
//                     Teeth will become loose, and some more than others.The teeth
//                     will settle into the bone and soft tissue and mobility will
//                     return to physiologic norms at the end of treatment.
//                     Brackets will also break. All orthodontic appliances are
//                     temporary, breakages are expected and considered when
//                     calculating your treatment time and retention. Dental
//                     professionals,dental hygenists, and other specialists all
//                     have different knowledge bases and motivations pertaining to
//                     patient care. It is not unlikely that at some point during
//                     treatment you may receive conflicting information. We're on
//                     the cutting edge with our office and some people may not
//                     comprehend what we're doing. We're always open educating
//                     other professionals on our cutting edge treatment plans,
//                     however patient care is our prority. Whenever in doubt, you
//                     can always circle back with the doctor who treatment planned
//                     your case. Trust our process.
//                   </p>
//                   <hr className="border-t border-[#262626] mb-8" />
//                   <div className="flex items-center space-x-2">
//                     <h3 className="font-helvetica-neue-light text-sm font-medium uppercase tracking-widest mb-0 leading-none">
//                       • Final Considerations
//                     </h3>
//                   </div>
//                 </div>
//               </div>
//               <div className="absolute right-0 bottom-[6%] flex justify-end">
//                 <div
//                   className="image-wrapper2 rounded-2xl overflow-hidden"
//                   style={{
//                     width: "150px",
//                     height: "auto",
//                   }}
//                 >
//                          <img src="../images/portal.avif" className="w-full h-auto" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }
